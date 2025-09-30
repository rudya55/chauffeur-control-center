import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, AlertCircle } from "lucide-react";
import { AreaChart, PieChart } from "@/components/ui/chart";

const AccountingDashboard = () => {
  // Mock data
  const monthlyData = [
    { month: "Jan", revenus: 4500, depenses: 2100 },
    { month: "Fev", revenus: 5200, depenses: 2300 },
    { month: "Mar", revenus: 4800, depenses: 2200 },
    { month: "Avr", revenus: 5500, depenses: 2400 },
    { month: "Mai", revenus: 6200, depenses: 2600 },
    { month: "Jun", revenus: 5800, depenses: 2500 },
  ];

  const expenseCategories = [
    { name: "Maintenance", value: 800, fill: "hsl(142, 76%, 36%)" },
    { name: "Assurance", value: 400, fill: "hsl(217, 91%, 60%)" },
    { name: "Péage", value: 300, fill: "hsl(48, 96%, 53%)" },
    { name: "Parking", value: 250, fill: "hsl(280, 87%, 65%)" },
    { name: "Nettoyage", value: 200, fill: "hsl(31, 97%, 72%)" },
  ];

  const totalRevenue = 32000;
  const totalExpenses = 14100;
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = ((netProfit / totalRevenue) * 100).toFixed(1);
  const pendingInvoices = 3;

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
              Total: 3,450€
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
