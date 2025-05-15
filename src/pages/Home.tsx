
import OnlineStatusToggle from "@/components/OnlineStatusToggle";
import Map from "@/components/Map";
import { Check, X, MapPin, Users, Luggage, CarFront, Euro, CreditCard, DollarSign, Bank } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

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
  const [incomingReservation, setIncomingReservation] = useState<Reservation | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Simulate incoming reservation after page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIncomingReservation({
        id: '123',
        pickupAddress: 'Aéroport Charles de Gaulle, Terminal 2E',
        destination: '23 Rue de Rivoli, Paris',
        date: '2025-05-17',
        time: '14:30',
        passengers: 2,
        luggage: 3,
        driverAmount: '45.00',
        paymentType: 'card',
        vehicleType: 'berline'
      });
    }, 3000);
    
    // Notification system
    const checkUpcomingReservations = () => {
      const now = new Date();
      // Simulate a reservation tomorrow
      const reservationDate = new Date('2025-05-16T10:15:00');
      const hoursDiff = Math.floor((reservationDate.getTime() - now.getTime()) / (1000 * 60 * 60));
      
      if (hoursDiff === 24) {
        toast({
          title: "Rappel de réservation",
          description: "Vous avez une course prévue demain à 10:15"
        });
      } else if (hoursDiff === 12) {
        toast({
          title: "Rappel de réservation",
          description: "Vous avez une course prévue dans 12 heures"
        });
      } else if (hoursDiff === 2) {
        toast({
          title: "Rappel de réservation",
          description: "Vous avez une course prévue dans 2 heures"
        });
      } else if (hoursDiff === 1) {
        toast({
          title: "Attention",
          description: "Vous avez une course dans 1 heure et vous n'avez pas démarré",
          variant: "destructive"
        });
      }
    };

    // Check for notifications every minute
    const notificationInterval = setInterval(checkUpcomingReservations, 60000);
    checkUpcomingReservations(); // Check immediately too

    return () => {
      clearTimeout(timer);
      clearInterval(notificationInterval);
    };
  }, [toast]);

  const handleAcceptReservation = () => {
    toast({
      title: "Réservation acceptée",
      description: "La réservation a été ajoutée à votre calendrier",
    });
    setIncomingReservation(null);
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

  // Function to render payment type icon
  const renderPaymentIcon = (type?: 'cash' | 'card' | 'transfer' | 'paypal') => {
    switch(type) {
      case 'cash':
        return <Euro className="h-4 w-4 text-green-500" />;
      case 'card':
        return <CreditCard className="h-4 w-4 text-blue-500" />;
      case 'transfer':
        return <Bank className="h-4 w-4 text-purple-500" />; 
      case 'paypal':
        return <DollarSign className="h-4 w-4 text-blue-600" />; 
      default:
        return <DollarSign className="h-4 w-4 text-gray-500" />;
    }
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

      {/* Incoming Reservation card */}
      {incomingReservation && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-10 w-11/12 max-w-md">
          <div className="bg-white dark:bg-card rounded-lg shadow-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-base font-medium dark:text-primary">Nouvelle demande de réservation</span>
            </div>
            <div className="space-y-2 mb-4">
              <div>
                <p className="text-sm font-medium dark:text-primary">Départ:</p>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-primary" />
                  <p className="text-sm">{incomingReservation.pickupAddress}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium dark:text-primary">Destination:</p>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-destructive" />
                  <p className="text-sm">{incomingReservation.destination}</p>
                </div>
              </div>
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium dark:text-primary">Date & Heure:</p>
                  <p className="text-sm">{incomingReservation.date} à {incomingReservation.time}</p>
                </div>
                <div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1 text-gray-500" />
                    <p className="text-sm">Passagers: {incomingReservation.passengers}</p>
                    <Luggage className="h-4 w-4 ml-2 mr-1 text-gray-500" />
                    <p className="text-sm">Bagages: {incomingReservation.luggage}</p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium dark:text-primary">Type de véhicule:</p>
                <div className="flex items-center">
                  <CarFront className="h-4 w-4 mr-1 text-gray-500" />
                  <p className="text-sm capitalize">{incomingReservation.vehicleType === 'first-class' ? 'First Class' : incomingReservation.vehicleType}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium dark:text-primary">Type de paiement:</p>
                <div className="flex items-center">
                  {renderPaymentIcon(incomingReservation.paymentType)}
                  <p className="text-sm ml-1">
                    {incomingReservation.paymentType === 'cash' && "Espèces"}
                    {incomingReservation.paymentType === 'card' && "Carte bleue"}
                    {incomingReservation.paymentType === 'transfer' && "Virement"}
                    {incomingReservation.paymentType === 'paypal' && "PayPal"}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium dark:text-primary">Prix net chauffeur:</p>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-1 text-green-500" />
                  <p className="text-sm">{incomingReservation.driverAmount}€</p>
                </div>
              </div>
            </div>
            <div className="flex justify-between gap-2">
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
        </div>
      )}

      {/* No reservation message */}
      {!incomingReservation && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-10 w-11/12 max-w-md">
          <div className="bg-white dark:bg-card rounded-lg shadow-lg p-4">
            <div className="flex items-center mb-2">
              <span className="text-base font-medium dark:text-primary">Demandes de réservations en cours</span>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-3">
              Toutes les nouvelles réservations apparaîtront ici
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
