
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import OnlineStatusToggle from "@/components/OnlineStatusToggle";
import Map from "@/components/Map";

const Home = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">Accueil</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-full md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle>Disponibilité</CardTitle>
          </CardHeader>
          <CardContent>
            <OnlineStatusToggle />
          </CardContent>
        </Card>
        
        <div className="col-span-full md:col-span-2 md:row-span-2">
          <Card className="h-[70vh]">
            <CardHeader className="pb-2">
              <CardTitle>Position actuelle</CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-65px)]">
              <Map />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
