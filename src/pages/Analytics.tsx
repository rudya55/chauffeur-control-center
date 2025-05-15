
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, BarChart, LineChart, PieChart } from "@/components/ui/chart";

const Analytics = () => {
  // Mock data for charts
  const revenueData = [
    {
      date: "Jan",
      revenue: 250,
    },
    {
      date: "Feb",
      revenue: 320,
    },
    {
      date: "Mar",
      revenue: 270,
    },
    {
      date: "Apr",
      revenue: 350,
    },
    {
      date: "May",
      revenue: 313,
    },
  ];

  const ridesData = [
    {
      name: "Lun",
      rides: 3,
    },
    {
      name: "Mar",
      rides: 5,
    },
    {
      name: "Mer",
      rides: 2,
    },
    {
      name: "Jeu",
      rides: 6,
    },
    {
      name: "Ven",
      rides: 8,
    },
    {
      name: "Sam",
      rides: 10,
    },
    {
      name: "Dim",
      rides: 4,
    },
  ];

  const dispatchersData = [
    { name: "TaxiCorp", value: 15 },
    { name: "VTCService", value: 8 },
    { name: "LuxDrive", value: 5 },
    { name: "Others", value: 2 },
  ];

  const hoursData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}h`,
    rides: Math.floor(Math.random() * 5),
  }));

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">Analyse</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">38</div>
            <p className="text-xs text-muted-foreground">
              +12% par rapport au mois dernier
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Revenue Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1 503,25 €</div>
            <p className="text-xs text-muted-foreground">
              +8.5% par rapport au mois dernier
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Temps Moyen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32 min</div>
            <p className="text-xs text-muted-foreground">
              Par course ce mois-ci
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Distance Moyenne</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8,2 km</div>
            <p className="text-xs text-muted-foreground">
              Par course ce mois-ci
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenus par mois</CardTitle>
          </CardHeader>
          <CardContent>
            <AreaChart
              data={revenueData}
              categories={["revenue"]}
              index="date"
              colors={["#1a73e8"]}
              valueFormatter={(value) => `${value}€`}
              className="h-72"
              showAnimation
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Courses par jour</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              data={ridesData}
              categories={["rides"]}
              index="name"
              colors={["#00a19d"]}
              valueFormatter={(value) => `${value} courses`}
              className="h-72"
              showAnimation
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Répartition par dispatcheur</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart
              data={dispatchersData}
              index="name"
              category="value"
              valueFormatter={(value) => `${value} courses`}
              colors={["#1a73e8", "#00a19d", "#e63946", "#888888"]}
              className="h-72"
              showAnimation
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Courses par heure</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart
              data={hoursData}
              categories={["rides"]}
              index="hour"
              colors={["#e63946"]}
              valueFormatter={(value) => `${value} courses`}
              className="h-72"
              showAnimation
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Conseils personnalisés</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-l-4 border-primary p-4 bg-primary/5 rounded">
            <h3 className="font-semibold mb-1">Optimisez vos heures de travail</h3>
            <p className="text-sm">
              Vos statistiques montrent que vous obtenez plus de courses entre 8h et 10h, ainsi qu'entre 18h et 20h.
              Concentrez-vous sur ces heures pour maximiser vos revenus.
            </p>
          </div>
          <div className="border-l-4 border-secondary p-4 bg-secondary/5 rounded">
            <h3 className="font-semibold mb-1">Développez votre réseau</h3>
            <p className="text-sm">
              TaxiCorp représente 50% de vos courses. Envisagez de diversifier vos sources de réservations pour 
              ne pas dépendre d'un seul dispatcheur.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
