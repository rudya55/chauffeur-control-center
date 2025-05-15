
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import ReservationCard from "@/components/ReservationCard";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// Type de réservation
type ReservationType = {
  id: string;
  clientName: string;
  pickupAddress: string;
  destination: string;
  date: string;
  phone: string;
  flightNumber?: string;
  dispatcher: string;
  passengers?: number;
  status?: 'pending' | 'accepted' | 'started' | 'arrived' | 'onBoard' | 'completed';
  actualPickupTime?: string;
  dropoffTime?: string;
  distance?: string;
  duration?: string;
  amount?: string;
  rating?: number;
  comment?: string;
};

// Données de réservations (simulations)
const initialUpcomingReservations: ReservationType[] = [
  {
    id: "1",
    clientName: "Jean Dupont",
    pickupAddress: "Aéroport Charles de Gaulle, Terminal 2E",
    destination: "23 Rue de Rivoli, Paris",
    date: "2025-05-16T14:30:00",
    phone: "+33612345678",
    flightNumber: "AF1234",
    dispatcher: "TaxiCorp",
    passengers: 2,
    status: 'pending'
  },
  {
    id: "2",
    clientName: "Marie Martin",
    pickupAddress: "Gare de Lyon, Paris",
    destination: "45 Avenue des Champs-Élysées, Paris",
    date: "2025-05-17T09:15:00",
    phone: "+33687654321",
    flightNumber: "",
    dispatcher: "VTCService",
    passengers: 1,
    status: 'pending'
  }
];

const initialMyReservations: ReservationType[] = [
  {
    id: "3",
    clientName: "Pierre Leroy",
    pickupAddress: "Hôtel Ritz, Paris",
    destination: "Tour Eiffel, Paris",
    date: "2025-05-18T18:45:00",
    phone: "+33698765432",
    flightNumber: "",
    dispatcher: "LuxDrive",
    passengers: 3,
    status: 'accepted'
  }
];

const initialCompletedReservations: ReservationType[] = [
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
    passengers: 2,
    amount: "25.50",
    rating: 4,
    comment: "Très bon chauffeur, ponctuel et professionnel.",
    status: 'completed'
  }
];

const Reservations = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [upcomingReservations, setUpcomingReservations] = useState<ReservationType[]>(initialUpcomingReservations);
  const [myReservations, setMyReservations] = useState<ReservationType[]>(initialMyReservations);
  const [completedReservations, setCompletedReservations] = useState<ReservationType[]>(initialCompletedReservations);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Gérer l'acceptation d'une réservation
  const handleAcceptReservation = (id: string) => {
    // Trouver la réservation
    const reservationToAccept = upcomingReservations.find(res => res.id === id);
    if (!reservationToAccept) return;

    // Supprimer de la liste des réservations à venir
    setUpcomingReservations(prev => prev.filter(res => res.id !== id));

    // Ajouter à la liste des réservations acceptées avec le statut mis à jour
    setMyReservations(prev => [
      ...prev, 
      { ...reservationToAccept, status: 'accepted' }
    ]);
  };

  // Gérer le refus d'une réservation
  const handleRejectReservation = (id: string) => {
    setUpcomingReservations(prev => prev.filter(res => res.id !== id));
  };

  // Gérer le démarrage d'une course
  const handleStartRide = (id: string) => {
    setMyReservations(prev => prev.map(res => 
      res.id === id ? { ...res, status: 'started' } : res
    ));
  };

  // Gérer l'arrivée au point de prise en charge
  const handleArrived = (id: string) => {
    setMyReservations(prev => prev.map(res => 
      res.id === id ? { ...res, status: 'arrived', actualPickupTime: new Date().toISOString() } : res
    ));
  };

  // Gérer le client à bord
  const handleClientBoarded = (id: string) => {
    setMyReservations(prev => prev.map(res => 
      res.id === id ? { ...res, status: 'onBoard' } : res
    ));
  };

  // Gérer la fin d'une course
  const handleCompleteRide = (id: string, rating: number, comment: string) => {
    // Trouver la réservation
    const reservationToComplete = myReservations.find(res => res.id === id);
    if (!reservationToComplete) return;

    // Supprimer de la liste des réservations en cours
    setMyReservations(prev => prev.filter(res => res.id !== id));

    // Ajouter aux réservations terminées avec les données supplémentaires
    setCompletedReservations(prev => [
      ...prev, 
      { 
        ...reservationToComplete,
        status: 'completed',
        dropoffTime: new Date().toISOString(),
        distance: "12.5 km", // Ces données seraient calculées dans une vraie application
        duration: "35 min",
        amount: "32.00",
        rating,
        comment
      }
    ]);
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Réservations</h1>
        
        {/* Menu hamburger */}
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <div className="py-4">
              <h2 className="text-lg font-medium mb-4">Menu</h2>
              <nav className="space-y-2">
                <a href="/" className="block px-4 py-2 hover:bg-muted rounded-md">Accueil</a>
                <a href="/reservations" className="block px-4 py-2 bg-muted rounded-md font-medium">Réservations</a>
                <a href="/accounting" className="block px-4 py-2 hover:bg-muted rounded-md">Comptabilité</a>
                <a href="/analytics" className="block px-4 py-2 hover:bg-muted rounded-md">Analyse</a>
                <a href="/settings" className="block px-4 py-2 hover:bg-muted rounded-md">Paramètres</a>
                <button 
                  className="block w-full text-left px-4 py-2 hover:bg-muted rounded-md text-destructive"
                  onClick={() => alert("Déconnexion")}
                >
                  Déconnexion
                </button>
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      
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
                onAccept={handleAcceptReservation}
                onReject={handleRejectReservation}
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
                onStartRide={handleStartRide}
                onArrived={handleArrived}
                onClientBoarded={handleClientBoarded}
                onComplete={handleCompleteRide}
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
