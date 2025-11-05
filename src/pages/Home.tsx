import OnlineStatusToggle from "@/components/OnlineStatusToggle";
import Map from "@/components/Map";
import ThemeToggle from "@/components/ThemeToggle";
import NotificationBell from "@/components/NotificationBell";

const Home = () => {
  return (
    <div className="relative h-screen w-full p-4 overflow-hidden bg-background flex flex-col items-center justify-center">
  {/* Map as background - Full screen */}
  <Map className="absolute inset-0" />
      <div className="text-center">
        <h1 className="text-2xl font-bold">Serveur de test</h1>
        <p className="text-muted-foreground">La carte est temporairement désactivée pour le débogage.</p>
      </div>

      {/* Top-right controls */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <ThemeToggle />
        <NotificationBell />
      </div>

      {/* Top-center toggle */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
        <OnlineStatusToggle />
      </div>
    </div>
  );
};

export default Home;
