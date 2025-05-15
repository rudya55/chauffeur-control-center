
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, MapPin, Phone, Plane } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Mock data for reservations
const upcomingReservations = [
  {
    id: "1",
    clientName: "Jean Dupont",
    pickupAddress: "Aéroport Charles de Gaulle, Terminal 2E",
    destination: "23 Rue de Rivoli, Paris",
    date: "2025-05-16T14:30:00",
    phone: "+33612345678",
    flightNumber: "AF1234",
    dispatcher: "TaxiCorp"
  },
  {
    id: "2",
    clientName: "Marie Martin",
    pickupAddress: "Gare de Lyon, Paris",
    destination: "45 Avenue des Champs-Élysées, Paris",
    date: "2025-05-17T09:15:00",
    phone: "+33687654321",
    flightNumber: "",
    dispatcher: "VTCService"
  }
];

const myReservations = [
  {
    id: "3",
    clientName: "Pierre Leroy",
    pickupAddress: "Hôtel Ritz, Paris",
    destination: "Tour Eiffel, Paris",
    date: "2025-05-18T18:45:00",
    phone: "+33698765432",
    flightNumber: "",
    dispatcher: "LuxDrive"
  }
];

const completedReservations = [
  {
    id: "4",
    clientName: "Sophie Bernard",
    pickupAddress: "14 Rue de la Paix, Paris",
    destination: "Musée du Louvre, Paris",
    date: "2025-05-14T10:30:00",
    actualPickupTime: "2025-05-14T10:35:00",
    dropoffTime: "2025-05-14T11:15:00",
    distance: "5.2 km",
    duration: "40 min",
    phone: "+33654321987",
    flightNumber: "",
    dispatcher: "TaxiCorp",
    amount: "25.50"
  }
];

const ReservationCard = ({ 
  reservation, 
  type 
}: { 
  reservation: any, 
  type: 'upcoming' | 'current' | 'completed' 
}) => {
  const formattedDate = new Date(reservation.date).toLocaleString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });

  const handleShowPassenger = (name: string) => {
    alert(`Affichage pancarte pour: ${name}`);
  };

  const handleCheckFlight = (flight: string) => {
    if (!flight) return;
    alert(`Vérification du vol: ${flight}`);
  };

  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 
              className="text-lg font-semibold cursor-pointer hover:text-primary"
              onClick={() => handleShowPassenger(reservation.clientName)}
            >
              {reservation.clientName}
            </h3>
            <div className="text-sm text-gray-500">
              {formattedDate}
            </div>
          </div>
          <Badge>{reservation.dispatcher}</Badge>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 mt-1 text-primary shrink-0" />
            <div>
              <div className="text-sm font-medium">Prise en charge:</div>
              <div className="text-sm">{reservation.pickupAddress}</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 mt-1 text-destructive shrink-0" />
            <div>
              <div className="text-sm font-medium">Destination:</div>
              <div className="text-sm">{reservation.destination}</div>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-gray-500" />
            <a href={`tel:${reservation.phone}`} className="text-sm hover:text-primary">
              {reservation.phone}
            </a>
          </div>
          
          {reservation.flightNumber && (
            <div 
              className="flex items-center gap-2 cursor-pointer hover:text-primary"
              onClick={() => handleCheckFlight(reservation.flightNumber)}
            >
              <Plane className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{reservation.flightNumber}</span>
            </div>
          )}
        </div>

        {type === 'upcoming' && (
          <div className="mt-4 flex gap-2">
            <Button 
              variant="outline" 
              className="flex-1 bg-secondary/10 hover:bg-secondary/20 border-secondary/30"
              onClick={() => alert(`Réservation ${reservation.id} acceptée`)}
            >
              <Check className="mr-2 h-4 w-4" />
              Accepter
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 bg-destructive/10 hover:bg-destructive/20 border-destructive/30"
              onClick={() => alert(`Réservation ${reservation.id} refusée`)}
            >
              <X className="mr-2 h-4 w-4" />
              Refuser
            </Button>
          </div>
        )}

        {type === 'completed' && (
          <div className="mt-4 border-t pt-3">
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center">
                <div className="text-xs text-gray-500">Distance</div>
                <div className="font-medium">{reservation.distance}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500">Durée</div>
                <div className="font-medium">{reservation.duration}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500">Montant</div>
                <div className="font-medium">{reservation.amount} €</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const Reservations = () => {
  const [activeTab, setActiveTab] = useState("upcoming");

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">Réservations</h1>
      
      <Tabs defaultValue="upcoming" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="w-full">
          <TabsTrigger value="upcoming" className="flex-1">
            À venir
            {upcomingReservations.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {upcomingReservations.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="current" className="flex-1">
            Mes Réservations
            {myReservations.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {myReservations.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex-1">
            Terminées
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="mt-4">
          {upcomingReservations.length > 0 ? (
            upcomingReservations.map(reservation => (
              <ReservationCard 
                key={reservation.id} 
                reservation={reservation} 
                type="upcoming" 
              />
            ))
          ) : (
            <div className="text-center py-10 text-gray-500">
              Aucune réservation à venir
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="current" className="mt-4">
          {myReservations.length > 0 ? (
            myReservations.map(reservation => (
              <ReservationCard 
                key={reservation.id} 
                reservation={reservation} 
                type="current" 
              />
            ))
          ) : (
            <div className="text-center py-10 text-gray-500">
              Aucune réservation en cours
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="mt-4">
          {completedReservations.length > 0 ? (
            completedReservations.map(reservation => (
              <ReservationCard 
                key={reservation.id} 
                reservation={reservation} 
                type="completed" 
              />
            ))
          ) : (
            <div className="text-center py-10 text-gray-500">
              Aucune réservation terminée
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reservations;
