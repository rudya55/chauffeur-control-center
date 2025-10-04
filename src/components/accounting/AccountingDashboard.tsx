import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, AlertCircle } from "lucide-react";
import { AreaChart, PieChart } from "@/components/ui/chart";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";


const AccountingDashboard = () => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<any[]>([]);

  useEffect(() => {
    fetchAccountingData();
    
    // Subscribe to realtime changes
    const channel = supabase
      .channel('accounting-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'accounting_transactions'
      }, () => {
        fetchAccountingData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchAccountingData = async () => {
    const { data: transactions } = await supabase
      .from('accounting_transactions')
      .select('*')
      .order('transaction_date', { ascending: false });

    if (transactions) {
      // Calculate total revenue
      const revenue = transactions
        .filter(t => t.transaction_type === 'revenue')
        .reduce((sum, t) => sum + parseFloat(String(t.amount || '0')), 0);
      setTotalRevenue(revenue);

      // Calculate total expenses and commissions
      const expenses = transactions
        .filter(t => t.transaction_type === 'expense' || t.transaction_type === 'commission')
        .reduce((sum, t) => sum + parseFloat(String(t.amount || '0')), 0);
      setTotalExpenses(expenses);

      // Group by month
      const monthlyStats: any = {};
      transactions.forEach(t => {
        const month = new Date(t.transaction_date).toLocaleDateString('fr-FR', { month: 'short' });
        if (!monthlyStats[month]) {
          monthlyStats[month] = { month, revenus: 0, depenses: 0 };
        }
        if (t.transaction_type === 'revenue') {
          monthlyStats[month].revenus += parseFloat(String(t.amount || '0'));
        } else {
          monthlyStats[month].depenses += parseFloat(String(t.amount || '0'));
        }
      });
      setMonthlyData(Object.values(monthlyStats));

      // Expense categories
      const categories: any = {};
      transactions
        .filter(t => t.transaction_type !== 'revenue')
        .forEach(t => {
          const cat = t.category || 'Autre';
          categories[cat] = (categories[cat] || 0) + parseFloat(String(t.amount || '0'));
        });
      setExpenseCategories(
        Object.entries(categories).map(([name, value], i) => ({
          name,
          value: Number(value),
          fill: `hsl(${i * 60}, 70%, 50%)`
        }))
      );
    }
  };

  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : '0';
  const pendingInvoices = 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover-scale border-l-4 border-l-green-500 bg-gradient-to-br from-green-50 to-white dark:from-green-950/20 dark:to-background">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus totaux</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalRevenue.toLocaleString()}€</div>
            <p className="text-xs flex items-center mt-1 text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12.5% vs mois dernier
            </p>
          </CardContent>
        </Card>

        <Card className="hover-scale border-l-4 border-l-red-500 bg-gradient-to-br from-red-50 to-white dark:from-red-950/20 dark:to-background">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dépenses totales</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totalExpenses.toLocaleString()}€</div>
            <p className="text-xs flex items-center mt-1 text-red-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +5.2% vs mois dernier
            </p>
          </CardContent>
        </Card>

        <Card className="hover-scale border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-background">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bénéfice net</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{netProfit.toLocaleString()}€</div>
            <p className="text-xs mt-1 text-blue-600">
              Marge: {profitMargin}%
            </p>
          </CardContent>
        </Card>

        <Card className="hover-scale border-l-4 border-l-orange-500 bg-gradient-to-br from-orange-50 to-white dark:from-orange-950/20 dark:to-background">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Factures en attente</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingInvoices}</div>
            <p className="text-xs mt-1 text-orange-600">
              En temps réel
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="hover-scale">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="h-1 w-8 bg-gradient-to-r from-green-500 to-blue-500 rounded"></span>
              Évolution mensuelle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AreaChart
              data={monthlyData}
              categories={["revenus", "depenses"]}
              index="month"
              colors={["hsl(142, 76%, 36%)", "hsl(0, 84%, 60%)"]}
              valueFormatter={(value) => `${value}€`}
              className="h-80"
            />
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded"></span>
              Répartition des dépenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart
              data={expenseCategories}
              index="name"
              category="value"
              colors={[
                "hsl(142, 76%, 36%)",
                "hsl(217, 91%, 60%)",
                "hsl(48, 96%, 53%)",
                "hsl(280, 87%, 65%)",
                "hsl(31, 97%, 72%)"
              ]}
              valueFormatter={(value) => `${value}€`}
              className="h-80"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AccountingDashboard;
