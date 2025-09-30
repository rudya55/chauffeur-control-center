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
    { name: "Carburant", value: 1200, fill: "hsl(var(--chart-1))" },
    { name: "Maintenance", value: 800, fill: "hsl(var(--chart-2))" },
    { name: "Assurance", value: 400, fill: "hsl(var(--chart-3))" },
    { name: "Péage", value: 300, fill: "hsl(var(--chart-4))" },
  ];

  const totalRevenue = 32000;
  const totalExpenses = 14100;
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = ((netProfit / totalRevenue) * 100).toFixed(1);
  const pendingInvoices = 3;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus totaux</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRevenue.toLocaleString()}€</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +12.5% vs mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dépenses totales</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalExpenses.toLocaleString()}€</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1 text-red-500" />
              +5.2% vs mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bénéfice net</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{netProfit.toLocaleString()}€</div>
            <p className="text-xs text-muted-foreground mt-1">
              Marge: {profitMargin}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Factures en attente</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingInvoices}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total: 3,450€
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Évolution mensuelle</CardTitle>
          </CardHeader>
          <CardContent>
            <AreaChart
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
            <CardTitle>Répartition des dépenses</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart
              data={expenseCategories}
              index="name"
              category="value"
              colors={["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"]}
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
