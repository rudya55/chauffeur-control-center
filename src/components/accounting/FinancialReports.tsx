import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, TrendingUp, TrendingDown } from "lucide-react";
import { BarChart, LineChart } from "@/components/ui/chart";
import { toast } from "sonner";

const FinancialReports = () => {
  const monthlyData = [
    { month: "Janvier", revenus: 4500, depenses: 2100, benefice: 2400 },
    { month: "Février", revenus: 5200, depenses: 2300, benefice: 2900 },
    { month: "Mars", revenus: 4800, depenses: 2200, benefice: 2600 },
    { month: "Avril", revenus: 5500, depenses: 2400, benefice: 3100 },
    { month: "Mai", revenus: 6200, depenses: 2600, benefice: 3600 },
    { month: "Juin", revenus: 5800, depenses: 2500, benefice: 3300 },
  ];

  const kpis = [
    { label: "Revenus moyens", value: "5,167€", trend: "+8.5%", isPositive: true },
    { label: "Dépenses moyennes", value: "2,350€", trend: "+3.2%", isPositive: false },
    { label: "Bénéfice moyen", value: "2,817€", trend: "+12.4%", isPositive: true },
    { label: "Taux de marge", value: "54.5%", trend: "+2.1%", isPositive: true },
  ];

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
