
import OnlineStatusToggle from "@/components/OnlineStatusToggle";
import Map from "@/components/Map";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Home = () => {
  return (
    <div className="relative h-screen w-full p-0 overflow-hidden">
      {/* Map as background */}
      <div className="absolute inset-0 z-0">
        <Map />
      </div>
      
      {/* Status toggle at top center */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
        <OnlineStatusToggle />
      </div>

      {/* Message circle button at top right */}
      <div className="absolute top-4 right-4 z-10">
        <Button variant="outline" size="icon" className="bg-white rounded-full shadow-md">
          <MessageCircle className="h-5 w-5" />
        </Button>
      </div>

      {/* Reservations card */}
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-10 w-11/12 max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-4">
          <div className="flex items-center mb-2">
            <span className="text-base font-medium">Demandes de réservations en cours</span>
          </div>
          <div className="text-sm text-gray-500 text-center py-3">
            Toutes les nouvelles réservations apparaîtront ici
          </div>
        </div>
      </div>

      {/* Bottom action button */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
        <Button className="rounded-full bg-green-500 hover:bg-green-600 h-14 w-14 flex items-center justify-center">
          <span className="sr-only">Action</span>
        </Button>
      </div>
    </div>
  );
};

export default Home;
