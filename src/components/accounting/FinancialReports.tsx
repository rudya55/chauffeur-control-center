import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, TrendingUp, TrendingDown } from "lucide-react";
import { BarChart, LineChart } from "@/components/ui/chart";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const FinancialReports = () => {
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [kpis, setKpis] = useState<any[]>([]);

  useEffect(() => {
    fetchFinancialData();
    
    const channel = supabase
      .channel('financial-reports-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'accounting_transactions'
        },
        () => {
          fetchFinancialData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchFinancialData = async () => {
    const { data, error } = await supabase
      .from('accounting_transactions')
      .select('*');

    if (error) {
      console.error('Error fetching financial data:', error);
      return;
    }

    // Group by month
    const monthlyStats: Record<string, { revenus: number; depenses: number; benefice: number }> = {};
    
    data?.forEach((transaction) => {
      const date = new Date(transaction.transaction_date);
      const monthKey = date.toLocaleString('fr-FR', { month: 'long', year: 'numeric' });
      
      if (!monthlyStats[monthKey]) {
        monthlyStats[monthKey] = { revenus: 0, depenses: 0, benefice: 0 };
      }
      
      const amount = Number(transaction.amount);
      if (transaction.transaction_type === 'revenue') {
        monthlyStats[monthKey].revenus += amount;
      } else {
        monthlyStats[monthKey].depenses += amount;
      }
      monthlyStats[monthKey].benefice = monthlyStats[monthKey].revenus - monthlyStats[monthKey].depenses;
    });

    const formattedMonthlyData = Object.entries(monthlyStats).map(([month, stats]) => ({
      month: month.charAt(0).toUpperCase() + month.slice(1),
      ...stats
    }));

    setMonthlyData(formattedMonthlyData);

    // Calculate KPIs
    const totalRevenue = formattedMonthlyData.reduce((sum, m) => sum + m.revenus, 0);
    const totalExpense = formattedMonthlyData.reduce((sum, m) => sum + m.depenses, 0);
    const avgRevenue = formattedMonthlyData.length > 0 ? totalRevenue / formattedMonthlyData.length : 0;
    const avgExpense = formattedMonthlyData.length > 0 ? totalExpense / formattedMonthlyData.length : 0;
    const avgProfit = avgRevenue - avgExpense;
    const marginRate = avgRevenue > 0 ? (avgProfit / avgRevenue) * 100 : 0;

    setKpis([
      { label: "Revenus moyens", value: `${avgRevenue.toFixed(0)}€`, trend: "+8.5%", isPositive: true },
      { label: "Dépenses moyennes", value: `${avgExpense.toFixed(0)}€`, trend: "+3.2%", isPositive: false },
      { label: "Bénéfice moyen", value: `${avgProfit.toFixed(0)}€`, trend: "+12.4%", isPositive: true },
      { label: "Taux de marge", value: `${marginRate.toFixed(1)}%`, trend: "+2.1%", isPositive: true },
    ]);
  };

  const handleExportPDF = () => {
    toast.success("Export PDF du rapport en cours...");
  };

  const handleExportExcel = () => {
    toast.success("Export Excel du rapport en cours...");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Rapport mensuel</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleExportPDF}>
                <FileText className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
              <Button variant="outline" onClick={handleExportExcel}>
                <Download className="mr-2 h-4 w-4" />
                Export Excel
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4 mb-6">
            {kpis.map((kpi, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="text-sm text-muted-foreground mb-1">{kpi.label}</div>
                  <div className="text-2xl font-bold mb-1">{kpi.value}</div>
                  <div className={`text-xs flex items-center ${kpi.isPositive ? "text-green-600" : "text-red-600"}`}>
                    {kpi.isPositive ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {kpi.trend}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Évolution du chiffre d'affaires</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={monthlyData}
                  categories={["revenus", "depenses"]}
                  index="month"
                  colors={["hsl(var(--chart-1))", "hsl(var(--chart-2))"]}
                  valueFormatter={(value) => `${value}€`}
                  className="h-80"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Analyse du bénéfice</CardTitle>
              </CardHeader>
              <CardContent>
                <LineChart
                  data={monthlyData}
                  categories={["benefice"]}
                  index="month"
                  colors={["hsl(var(--chart-3))"]}
                  valueFormatter={(value) => `${value}€`}
                  className="h-80"
                />
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialReports;
