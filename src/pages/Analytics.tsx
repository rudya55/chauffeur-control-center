
import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { 
  AreaChart, 
  BarChart, 
  LineChart, 
  PieChart 
} from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/hooks/use-language";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart4, LineChart as LineChartIcon, PieChart as PieChartIcon, ArrowUp, ArrowDown } from "lucide-react";

const Analytics = () => {
  const { t } = useLanguage();
  const [timeRange, setTimeRange] = useState("month");
  
  // Mock data for charts
  const revenueData = [
    { month: "Janvier", revenue: 950 },
    { month: "Février", revenue: 1100 },
    { month: "Mars", revenue: 980 },
    { month: "Avril", revenue: 1250 },
    { month: "Mai", revenue: 1400 },
    { month: "Juin", revenue: 1200 },
  ];
  
  const weeklyRides = [
    { day: "Lun", rides: 18 },
    { day: "Mar", rides: 22 },
    { day: "Mer", rides: 16 },
    { day: "Jeu", rides: 25 },
    { day: "Ven", rides: 32 },
    { day: "Sam", rides: 24 },
    { day: "Dim", rides: 10 },
  ];
  
  const monthlyStats = [
    { month: "Janvier", completed: 68, canceled: 12 },
    { month: "Février", completed: 72, canceled: 8 },
    { month: "Mars", completed: 80, canceled: 10 },
    { month: "Avril", completed: 92, canceled: 5 },
    { month: "Mai", completed: 95, canceled: 7 },
    { month: "Juin", completed: 85, canceled: 9 },
  ];
  
  const dispatcherData = [
    { name: "Dispatch-A", rides: 45 },
    { name: "Dispatch-B", rides: 32 },
    { name: "Dispatch-C", rides: 28 },
    { name: "Dispatch-D", rides: 15 },
  ];
  
  const formatEuro = (value: number) => `${value} €`;
  
  return (
    <div className="p-4 sm:p-6">
      <PageHeader title="analytics" />
      
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-semibold">Tableau de bord analytique</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Cette semaine</SelectItem>
            <SelectItem value="month">Ce mois</SelectItem>
            <SelectItem value="quarter">Ce trimestre</SelectItem>
            <SelectItem value="year">Cette année</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total des courses</p>
                <h3 className="text-2xl font-bold mt-2">128</h3>
              </div>
              <div className="p-2 bg-green-100 rounded-full">
                <BarChart4 className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <ArrowUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-green-600 font-medium">12%</span>
              <span className="text-muted-foreground ml-2">vs mois dernier</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Revenus du mois</p>
                <h3 className="text-2xl font-bold mt-2">1,250 €</h3>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <LineChartIcon className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <ArrowUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-green-600 font-medium">8.2%</span>
              <span className="text-muted-foreground ml-2">vs mois dernier</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Évaluation moyenne</p>
                <h3 className="text-2xl font-bold mt-2">4.8 / 5</h3>
              </div>
              <div className="p-2 bg-yellow-100 rounded-full">
                <PieChartIcon className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <ArrowUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-green-600 font-medium">0.2</span>
              <span className="text-muted-foreground ml-2">vs mois dernier</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Taux d'acceptation</p>
                <h3 className="text-2xl font-bold mt-2">95%</h3>
              </div>
              <div className="p-2 bg-purple-100 rounded-full">
                <BarChart4 className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <ArrowDown className="h-4 w-4 text-red-600 mr-1" />
              <span className="text-red-600 font-medium">2%</span>
              <span className="text-muted-foreground ml-2">vs mois dernier</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Aperçu</TabsTrigger>
          <TabsTrigger value="dispatchers">Répartiteurs</TabsTrigger>
          <TabsTrigger value="rides">Courses</TabsTrigger>
          <TabsTrigger value="revenue">Revenus</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Revenus mensuels</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <AreaChart 
                  data={revenueData}
                  index="month"
                  categories={["revenue"]}
                  colors={["#0ea5e9"]}
                  valueFormatter={formatEuro}
                  className="h-[300px]"
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Courses par répartiteur</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <PieChart 
                  data={dispatcherData}
                  index="name"
                  category="rides"
                  colors={["#8b5cf6", "#ec4899", "#f97316", "#22c55e"]}
                  className="h-[300px]"
                />
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Statistiques mensuelles</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <BarChart 
                data={monthlyStats}
                index="month"
                categories={["completed", "canceled"]}
                colors={["#22c55e", "#ef4444"]}
                className="h-[300px]"
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="dispatchers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance des répartiteurs</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <PieChart 
                data={dispatcherData}
                index="name"
                category="rides"
                colors={["#8b5cf6", "#ec4899", "#f97316", "#22c55e"]}
                className="h-[400px]"
              />
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Évaluations par répartiteur</CardTitle>
              </CardHeader>
              <CardContent>
                <table className="w-full">
                  <thead>
                    <tr className="text-left">
                      <th className="pb-2">Répartiteur</th>
                      <th className="pb-2">Évaluation</th>
                      <th className="pb-2">Courses</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-2">Dispatch-A</td>
                      <td className="py-2">4.9 / 5</td>
                      <td className="py-2">45</td>
                    </tr>
                    <tr>
                      <td className="py-2">Dispatch-B</td>
                      <td className="py-2">4.7 / 5</td>
                      <td className="py-2">32</td>
                    </tr>
                    <tr>
                      <td className="py-2">Dispatch-C</td>
                      <td className="py-2">4.8 / 5</td>
                      <td className="py-2">28</td>
                    </tr>
                    <tr>
                      <td className="py-2">Dispatch-D</td>
                      <td className="py-2">4.6 / 5</td>
                      <td className="py-2">15</td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Taux d'acceptation</CardTitle>
              </CardHeader>
              <CardContent>
                <table className="w-full">
                  <thead>
                    <tr className="text-left">
                      <th className="pb-2">Répartiteur</th>
                      <th className="pb-2">Acceptés</th>
                      <th className="pb-2">Taux</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-2">Dispatch-A</td>
                      <td className="py-2">43/45</td>
                      <td className="py-2">96%</td>
                    </tr>
                    <tr>
                      <td className="py-2">Dispatch-B</td>
                      <td className="py-2">30/32</td>
                      <td className="py-2">94%</td>
                    </tr>
                    <tr>
                      <td className="py-2">Dispatch-C</td>
                      <td className="py-2">27/28</td>
                      <td className="py-2">96%</td>
                    </tr>
                    <tr>
                      <td className="py-2">Dispatch-D</td>
                      <td className="py-2">14/15</td>
                      <td className="py-2">93%</td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="rides" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Courses hebdomadaires</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <BarChart 
                data={weeklyRides}
                index="day"
                categories={["rides"]}
                colors={["#8b5cf6"]}
                className="h-[300px]"
              />
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Types de courses</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <PieChart 
                  data={[
                    { type: "Aéroport", count: 48 },
                    { type: "Ville", count: 35 },
                    { type: "Longue distance", count: 25 },
                    { type: "Événement", count: 20 },
                  ]}
                  index="type"
                  category="count"
                  colors={["#0ea5e9", "#8b5cf6", "#ec4899", "#f97316"]}
                  className="h-[300px]"
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Heures de pointe</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <LineChart 
                  data={[
                    { hour: "6h", rides: 6 },
                    { hour: "8h", rides: 15 },
                    { hour: "10h", rides: 8 },
                    { hour: "12h", rides: 10 },
                    { hour: "14h", rides: 7 },
                    { hour: "16h", rides: 9 },
                    { hour: "18h", rides: 18 },
                    { hour: "20h", rides: 12 },
                    { hour: "22h", rides: 9 },
                  ]}
                  index="hour"
                  categories={["rides"]}
                  colors={["#ec4899"]}
                  className="h-[300px]"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenus mensuels</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <AreaChart 
                data={revenueData}
                index="month"
                categories={["revenue"]}
                colors={["#22c55e"]}
                valueFormatter={formatEuro}
                className="h-[300px]"
                showAnimation={true}
              />
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Moyennes par course</CardTitle>
              </CardHeader>
              <CardContent>
                <table className="w-full">
                  <thead>
                    <tr className="text-left">
                      <th className="pb-2">Type</th>
                      <th className="pb-2">Prix moyen</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-2">Aéroport</td>
                      <td className="py-2">65 €</td>
                    </tr>
                    <tr>
                      <td className="py-2">Ville</td>
                      <td className="py-2">28 €</td>
                    </tr>
                    <tr>
                      <td className="py-2">Longue distance</td>
                      <td className="py-2">120 €</td>
                    </tr>
                    <tr>
                      <td className="py-2">Événement</td>
                      <td className="py-2">45 €</td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Méthodes de paiement</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <PieChart 
                  data={[
                    { method: "Carte", percentage: 65 },
                    { method: "Espèces", percentage: 20 },
                    { method: "Virement", percentage: 10 },
                    { method: "Autre", percentage: 5 },
                  ]}
                  index="method"
                  category="percentage"
                  colors={["#0ea5e9", "#8b5cf6", "#22c55e", "#f97316"]}
                  className="h-[300px]"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
