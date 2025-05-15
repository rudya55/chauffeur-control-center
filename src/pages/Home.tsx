
import OnlineStatusToggle from "@/components/OnlineStatusToggle";
import Map from "@/components/Map";
import { Check, X, MapPin, Plane, ArrowRight, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Reservation {
  id: string;
  pickupAddress: string;
  destination: string;
  date: string;
  time: string;
  clientName?: string;
  passengers?: number;
  luggage?: number;
  amount?: string;
  driverAmount?: string;
  commission?: string;
  vehicleType?: 'standard' | 'berline' | 'van' | 'mini-bus' | 'first-class';
  paymentType?: 'cash' | 'card' | 'transfer' | 'paypal';
}

const Home = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [incomingReservation, setIncomingReservation] = useState<Reservation | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Simulate incoming reservation after page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIncomingReservation({
        id: '123',
        pickupAddress: 'CDG',
        destination: 'Sofitel Le Scribe Paris Opéra',
        date: '2025-05-16',
        time: '11:25',
        passengers: 2,
        luggage: 3,
        driverAmount: '101.73',
        paymentType: 'card',
        vehicleType: 'berline'
      });
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleAcceptReservation = () => {
    toast({
      title: "Réservation acceptée",
      description: "La réservation a été ajoutée à votre calendrier",
    });
    setIncomingReservation(null);
    navigate("/reservations");
  };

  const handleRejectReservation = () => {
    toast({
      title: "Réservation refusée",
      description: "La réservation a été refusée",
    });
    setIncomingReservation(null);
  };

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
    const event = new CustomEvent('toggle-sidebar');
    window.dispatchEvent(event);
  };

  const handleCardClick = () => {
    navigate("/reservations");
  };

  const formatDate = (date: string, time: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'long'
    };
    
    const dateObj = new Date(`${date}T${time}`);
    const formattedDate = dateObj.toLocaleDateString('fr-FR', options);
    return `${formattedDate} ${time}`;
  };

  return (
    <div className="relative h-screen w-full p-0 overflow-hidden">
      {/* Map as background */}
      <div className="absolute inset-0 z-0">
        <Map onMenuToggle={handleMenuToggle} />
      </div>
      
      {/* Status toggle at top center */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
        <OnlineStatusToggle />
      </div>

      {/* Reservation card */}
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-10 w-11/12 max-w-md">
        <div className="bg-white dark:bg-card rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200">
            <Plane className="h-5 w-5" />
            <h3 className="text-lg font-medium">Demandes de réservations en cours</h3>
          </div>
          
          {/* Content */}
          {incomingReservation ? (
            <div 
              className="p-4 hover:bg-slate-50 cursor-pointer transition-colors"
              onClick={handleCardClick}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className="h-2 w-2 bg-black rounded-full mr-2"></div>
                  <div className="text-base">{formatDate(incomingReservation.date, incomingReservation.time)}</div>
                </div>
                <div className="font-bold">≈ {incomingReservation.driverAmount} € (NET)</div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="font-bold">{incomingReservation.pickupAddress}</div>
                <ArrowRight className="mx-2" />
                <div className="font-bold text-right">{incomingReservation.destination}</div>
              </div>
              
              <div className="mt-4 flex justify-between gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1 bg-red-50 hover:bg-red-100 border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/30"
                  onClick={handleRejectReservation}
                >
                  <X className="mr-1 h-4 w-4" /> Refuser
                </Button>
                <Button 
                  className="flex-1 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
                  onClick={handleAcceptReservation}
                >
                  <Check className="mr-1 h-4 w-4" /> Accepter
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-6 px-4">
              Toutes les nouvelles réservations apparaîtront ici
            </div>
          )}
          
          {/* Footer */}
          <div className="bg-gray-50 dark:bg-gray-800/50 py-3 px-4 text-right border-t border-gray-200">
            <a href="/reservations" className="text-blue-600 font-medium">
              Toutes les réservations &gt;
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
