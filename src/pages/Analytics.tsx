
import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";

const Analytics = () => {
  const { t } = useLanguage();
  const [timeRange, setTimeRange] = useState("month");
  const [totalRides, setTotalRides] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [acceptanceRate, setAcceptanceRate] = useState(0);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [dispatcherData, setDispatcherData] = useState<any[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<any[]>([]);
  const [weeklyRides, setWeeklyRides] = useState<any[]>([]);

  useEffect(() => {
    fetchAnalytics();
    
    // Subscribe to realtime changes
    const channel = supabase
      .channel('analytics-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'reservations'
      }, () => {
        fetchAnalytics();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'accounting_transactions'
      }, () => {
        fetchAnalytics();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [timeRange]);

  const fetchAnalytics = async () => {
    // Fetch all reservations
    const { data: reservations } = await supabase
      .from('reservations')
      .select('*')
      .order('created_at', { ascending: false });

    if (reservations) {
      // Total rides
      setTotalRides(reservations.length);

      // Total revenue from completed rides
      const completedRides = reservations.filter(r => r.status === 'completed');
      const revenue = completedRides.reduce((sum, r) => sum + parseFloat(String(r.amount || '0')), 0);
      setTotalRevenue(revenue);

      // Average rating
      const ratedRides = completedRides.filter(r => r.rating);
      const avgRat = ratedRides.length > 0 
        ? ratedRides.reduce((sum, r) => sum + (r.rating || 0), 0) / ratedRides.length 
        : 0;
      setAvgRating(avgRat);

      // Acceptance rate
      const acceptedOrCompleted = reservations.filter(
        r => r.status === 'accepted' || r.status === 'started' || r.status === 'arrived' || r.status === 'onBoard' || r.status === 'completed'
      ).length;
      const rate = reservations.length > 0 ? (acceptedOrCompleted / reservations.length) * 100 : 0;
      setAcceptanceRate(rate);

      // Revenue by month
      const revenueByMonth: any = {};
      completedRides.forEach(r => {
        const month = new Date(r.created_at).toLocaleDateString('fr-FR', { month: 'long' });
        revenueByMonth[month] = (revenueByMonth[month] || 0) + parseFloat(String(r.amount || '0'));
      });
      setRevenueData(Object.entries(revenueByMonth).map(([month, revenue]) => ({ month, revenue: Number(revenue) })));

      // Dispatcher stats
      const dispatcherStats: any = {};
      reservations.forEach(r => {
        dispatcherStats[r.dispatcher] = (dispatcherStats[r.dispatcher] || 0) + 1;
      });
      setDispatcherData(Object.entries(dispatcherStats).map(([name, rides]) => ({ name, rides: Number(rides) })));

      // Monthly stats
      const statsPerMonth: any = {};
      reservations.forEach(r => {
        const month = new Date(r.created_at).toLocaleDateString('fr-FR', { month: 'long' });
        if (!statsPerMonth[month]) {
          statsPerMonth[month] = { completed: 0, canceled: 0 };
        }
        if (r.status === 'completed') statsPerMonth[month].completed++;
        if (r.status === 'cancelled') statsPerMonth[month].canceled++;
      });
      setMonthlyStats(Object.entries(statsPerMonth).map(([month, stats]: any) => ({ month, ...stats })));

      // Weekly rides
      const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
      const ridesByDay: any = { Lun: 0, Mar: 0, Mer: 0, Jeu: 0, Ven: 0, Sam: 0, Dim: 0 };
      reservations.forEach(r => {
        const dayIndex = new Date(r.created_at).getDay();
        const dayName = days[dayIndex === 0 ? 6 : dayIndex - 1];
        ridesByDay[dayName]++;
      });
      setWeeklyRides(Object.entries(ridesByDay).map(([day, rides]) => ({ day, rides })));
    }
  };
  
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
                <h3 className="text-2xl font-bold mt-2">{totalRides}</h3>
              </div>
              <div className="p-2 bg-green-100 rounded-full">
                <BarChart4 className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Revenus totaux</p>
                <h3 className="text-2xl font-bold mt-2">{totalRevenue.toFixed(2)} €</h3>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <LineChartIcon className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Évaluation moyenne</p>
                <h3 className="text-2xl font-bold mt-2">{avgRating.toFixed(1)} / 5</h3>
              </div>
              <div className="p-2 bg-yellow-100 rounded-full">
                <PieChartIcon className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Taux d'acceptation</p>
                <h3 className="text-2xl font-bold mt-2">{acceptanceRate.toFixed(0)}%</h3>
              </div>
              <div className="p-2 bg-purple-100 rounded-full">
                <BarChart4 className="h-5 w-5 text-purple-600" />
              </div>
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
