
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import ReservationCard from "@/components/ReservationCard";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ChatDialog } from "@/components/ChatDialog";
import NotificationBell from "@/components/NotificationBell";
import { useLanguage } from "@/hooks/use-language";

// Type de réservation
type VehicleType = 'standard' | 'berline' | 'van' | 'mini-bus' | 'first-class';
type PaymentType = 'cash' | 'card' | 'transfer' | 'paypal';

type ReservationType = {
  id: string;
  clientName: string;
  pickupAddress: string;
  destination: string;
  date: string;
  phone: string;
  flightNumber?: string;
  dispatcher: string;
  dispatcherLogo?: string;
  passengers?: number;
  luggage?: number;
  status?: 'pending' | 'accepted' | 'started' | 'arrived' | 'onBoard' | 'completed';
  actualPickupTime?: string;
  dropoffTime?: string;
  distance?: string;
  duration?: string;
  amount?: string;
  driverAmount?: string;
  commission?: string;
  vehicleType?: VehicleType;
  paymentType?: PaymentType;
  rating?: number;
  comment?: string;
  route?: {lat: number, lng: number}[];
};

const initialUpcomingReservations: ReservationType[] = [
  {
    id: "1",
    clientName: "Jean Dupont",
    pickupAddress: "1 Avenue des Champs-Élysées, Paris",
    destination: "Aéroport Charles de Gaulle, Paris",
    date: "2025-05-20T08:30:00",
    phone: "+33612345678",
    flightNumber: "AF1234",
    dispatcher: "TaxiCorp",
    dispatcherLogo: "🚕",
    passengers: 2,
    luggage: 2,
    amount: "85.50",
    driverAmount: "68.40",
    commission: "17.10",
    vehicleType: 'berline',
    paymentType: 'card',
    status: 'pending'
  },
  {
    id: "2",
    clientName: "Marie Lefevre",
    pickupAddress: "15 Rue de Rivoli, Paris",
    destination: "Gare de Lyon, Paris",
    date: "2025-05-22T14:15:00",
    phone: "+33687654321",
    flightNumber: "",
    dispatcher: "LuxDrive",
    dispatcherLogo: "✨",
    passengers: 1,
    luggage: 1,
    amount: "45.00",
    driverAmount: "36.00",
    commission: "9.00",
    vehicleType: 'standard',
    paymentType: 'cash',
    status: 'pending'
  },
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
    dispatcherLogo: "✨",
    passengers: 3,
    luggage: 4,
    status: 'accepted',
    amount: "120.00",
    driverAmount: "96.00",
    commission: "24.00",
    paymentType: 'cash',
    vehicleType: 'first-class'
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
    dispatcherLogo: "🚕",
    passengers: 2,
    luggage: 2,
    amount: "25.50",
    driverAmount: "20.40",
    commission: "5.10",
    paymentType: 'card',
    vehicleType: 'standard',
    rating: 4,
    comment: "Très bon chauffeur, ponctuel et professionnel.",
    status: 'completed',
    route: [
      {lat: 48.869, lng: 2.332},
      {lat: 48.865, lng: 2.330},
      {lat: 48.861, lng: 2.335},
      {lat: 48.860, lng: 2.337}
    ]
  }
];

const Reservations = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("current");
  const [upcomingReservations, setUpcomingReservations] = useState<ReservationType[]>(initialUpcomingReservations);
  const [myReservations, setMyReservations] = useState<ReservationType[]>(initialMyReservations);
  const [completedReservations, setCompletedReservations] = useState<ReservationType[]>(initialCompletedReservations);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [currentDispatcher, setCurrentDispatcher] = useState("");

  // Accepter une réservation
  const handleAcceptReservation = (id: string) => {
    // Trouver la réservation dans la liste des réservations à venir
    const reservation = upcomingReservations.find(res => res.id === id);
    
    if (reservation) {
      // Mettre à jour le statut et déplacer vers mes réservations
      const updatedReservation = { ...reservation, status: 'accepted' };
      setMyReservations(prev => [...prev, updatedReservation]);
      
      // Retirer de la liste des réservations à venir
      setUpcomingReservations(prev => prev.filter(res => res.id !== id));
    }
  };

  // Refuser une réservation
  const handleRejectReservation = (id: string) => {
    // Simplement retirer de la liste des réservations à venir
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

    // Générer un itinéraire simulé (dans un cas réel, ce serait l'historique du trajet GPS)
    const simulatedRoute = [
      {lat: 48.870, lng: 2.330}, // Point de départ
      {lat: 48.865, lng: 2.334},
      {lat: 48.862, lng: 2.338},
      {lat: 48.858, lng: 2.340} // Destination
    ];

    // Ajouter aux réservations terminées avec les données supplémentaires
    setCompletedReservations(prev => [
      ...prev, 
      { 
        ...reservationToComplete,
        status: 'completed',
        dropoffTime: new Date().toISOString(),
        distance: "12.5 km", // Ces données seraient calculées dans une vraie application
        duration: "35 min",
        rating,
        comment,
        route: simulatedRoute
      }
    ]);
  };
  
  // Ouvrir le chat avec un dispatcher
  const openChatWithDispatcher = (dispatcher: string) => {
    setCurrentDispatcher(dispatcher);
    setShowChat(true);
  };

  // Load reservations from localStorage on initial load
  useEffect(() => {
    const storedMyReservations = localStorage.getItem('myReservations');
    
    if (storedMyReservations) {
      setMyReservations(JSON.parse(storedMyReservations));
    }
  }, []);

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">{t("reservations")}</h1>
        
        <div className="flex items-center gap-2">
          {/* Add notification bell */}
          <NotificationBell />
          
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
                <h2 className="text-lg font-medium mb-4">{t("menu")}</h2>
                <nav className="space-y-2">
                  <a href="/" className="block px-4 py-2 hover:bg-muted rounded-md">{t("home")}</a>
                  <a href="/reservations" className="block px-4 py-2 bg-muted rounded-md font-medium">{t("reservations")}</a>
                  <a href="/accounting" className="block px-4 py-2 hover:bg-muted rounded-md">{t("accounting")}</a>
                  <a href="/analytics" className="block px-4 py-2 hover:bg-muted rounded-md">{t("analytics")}</a>
                  <a href="/settings" className="block px-4 py-2 hover:bg-muted rounded-md">{t("settings")}</a>
                  <button 
                    className="block w-full text-left px-4 py-2 hover:bg-muted rounded-md text-destructive"
                    onClick={() => alert(t("logout"))}
                  >
                    {t("logout")}
                  </button>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
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
                onChatWithDispatcher={openChatWithDispatcher}
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

      {/* Dialog de chat avec traduction */}
      <ChatDialog 
        open={showChat} 
        onOpenChange={setShowChat} 
        dispatcher={currentDispatcher}
      />
    </div>
  );
};

export default Reservations;
