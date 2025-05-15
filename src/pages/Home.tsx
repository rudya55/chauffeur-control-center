
import OnlineStatusToggle from "@/components/OnlineStatusToggle";
import Map from "@/components/Map";
import { Check, X } from "lucide-react";
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
}

const Home = () => {
  const { toast } = useToast();
  const [incomingReservation, setIncomingReservation] = useState<Reservation | null>(null);
  const [upcomingReservation, setUpcomingReservation] = useState<Reservation | null>(null);

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
        luggage: 3
      });
    }, 3000);
    
    // Show upcoming reservation (24h before)
    setUpcomingReservation({
      id: '124',
      pickupAddress: 'Gare de Lyon, Paris',
      destination: '45 Avenue des Champs-Élysées, Paris',
      date: '2025-05-16',
      time: '10:15',
      clientName: 'Marie Dubois',
      passengers: 1,
      luggage: 1
    });

    // Notification system
    const checkUpcomingReservations = () => {
      const now = new Date();
      const upcomingRes = {
        id: '124',
        pickupAddress: 'Gare de Lyon, Paris',
        destination: '45 Avenue des Champs-Élysées, Paris',
        date: '2025-05-16',
        time: '10:15',
        clientName: 'Marie Dubois',
        passengers: 1,
        luggage: 1
      };

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
                <p className="text-sm">{incomingReservation.pickupAddress}</p>
              </div>
              <div>
                <p className="text-sm font-medium dark:text-primary">Destination:</p>
                <p className="text-sm">{incomingReservation.destination}</p>
              </div>
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium dark:text-primary">Date & Heure:</p>
                  <p className="text-sm">{incomingReservation.date} à {incomingReservation.time}</p>
                </div>
                <div>
                  <p className="text-sm font-medium dark:text-primary">Passagers: {incomingReservation.passengers}</p>
                  <p className="text-sm font-medium dark:text-primary">Bagages: {incomingReservation.luggage}</p>
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
      
      {/* Upcoming reservation (24h before) */}
      {upcomingReservation && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-10 w-11/12 max-w-md">
          <div className="bg-white dark:bg-card rounded-lg shadow-lg p-4 border-l-4 border-blue-500 dark:border-blue-400">
            <div className="flex justify-between items-center mb-2">
              <span className="text-base font-medium dark:text-primary">Course de demain</span>
              <span className="text-sm bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 rounded-full px-2 py-0.5">
                {upcomingReservation.time}
              </span>
            </div>
            <div className="space-y-1">
              <div>
                <p className="text-sm font-medium dark:text-primary">Client:</p>
                <p className="text-sm">{upcomingReservation.clientName}</p>
              </div>
              <div>
                <p className="text-sm font-medium dark:text-primary">Départ:</p>
                <p className="text-sm">{upcomingReservation.pickupAddress}</p>
              </div>
              <div>
                <p className="text-sm font-medium dark:text-primary">Destination:</p>
                <p className="text-sm">{upcomingReservation.destination}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
