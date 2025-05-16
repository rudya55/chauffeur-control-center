import { useState, useEffect } from "react";
import { ReservationType } from "@/types/reservation";
import { toast } from "sonner";

// Sample data for development
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
    status: 'pending',
    pickupGPS: { lat: 48.8698, lng: 2.3075 },
    destinationGPS: { lat: 49.0097, lng: 2.5479 },
    flightStatus: 'on-time',
    placardText: "M. Dupont - Aéroport CDG"
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
    status: 'pending',
    pickupGPS: { lat: 48.8569, lng: 2.3570 },
    destinationGPS: { lat: 48.8448, lng: 2.3735 },
    placardText: "Mme Lefevre - Gare de Lyon"
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
    vehicleType: 'first-class',
    pickupGPS: { lat: 48.8683, lng: 2.3295 },
    destinationGPS: { lat: 48.8584, lng: 2.2945 },
    placardText: "M. Leroy - Tour Eiffel"
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
    pickupGPS: { lat: 48.8697, lng: 2.3311 },
    destinationGPS: { lat: 48.8606, lng: 2.3376 },
    placardText: "Mme Bernard - Louvre",
    route: [
      {lat: 48.869, lng: 2.332},
      {lat: 48.865, lng: 2.330},
      {lat: 48.861, lng: 2.335},
      {lat: 48.860, lng: 2.337}
    ]
  }
];

export const useReservations = () => {
  const [upcomingReservations, setUpcomingReservations] = useState<ReservationType[]>(initialUpcomingReservations);
  const [myReservations, setMyReservations] = useState<ReservationType[]>(initialMyReservations);
  const [completedReservations, setCompletedReservations] = useState<ReservationType[]>(initialCompletedReservations);
  const [activeTab, setActiveTab] = useState("current");
  const [showChat, setShowChat] = useState(false);
  const [currentDispatcher, setCurrentDispatcher] = useState("");
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<ReservationType | null>(null);

  // Accepter une réservation
  const handleAcceptReservation = (id: string) => {
    console.log("Accepting reservation with ID:", id);
    
    // Trouver la réservation dans la liste des réservations à venir
    const reservation = upcomingReservations.find(res => res.id === id);
    
    if (reservation) {
      // Mettre à jour le statut et déplacer vers mes réservations
      const updatedReservation: ReservationType = { ...reservation, status: 'accepted' };
      
      // Ajouter aux réservations acceptées
      setMyReservations(prev => [...prev, updatedReservation]);
      
      // Retirer de la liste des réservations à venir
      setUpcomingReservations(prev => prev.filter(res => res.id !== id));
      
      // Ajouter la réservation au localStorage pour le calendrier
      const calendarReservations = JSON.parse(localStorage.getItem('calendarReservations') || '[]');
      calendarReservations.push(updatedReservation);
      localStorage.setItem('calendarReservations', JSON.stringify(calendarReservations));
      
      toast.success(`Réservation pour ${reservation.clientName} acceptée`);
    } else {
      console.error("Reservation not found with ID:", id);
      toast.error("Erreur: Réservation introuvable");
    }
  };

  // Refuser une réservation
  const handleRejectReservation = (id: string) => {
    console.log("Rejecting reservation with ID:", id);
    
    // Simplement retirer de la liste des réservations à venir
    const reservation = upcomingReservations.find(res => res.id === id);
    
    if (reservation) {
      setUpcomingReservations(prev => prev.filter(res => res.id !== id));
      toast.info(`Réservation pour ${reservation.clientName} refusée`);
    } else {
      console.error("Reservation not found with ID:", id);
      toast.error("Erreur: Réservation introuvable");
    }
  };

  // Gérer le démarrage d'une course
  const handleStartRide = (id: string) => {
    setMyReservations(prev => prev.map(res => 
      res.id === id ? { ...res, status: 'started', actualPickupTime: new Date().toISOString() } : res
    ));
    
    // Mettre à jour les données dans localStorage pour le calendrier
    updateCalendarReservation(id, 'started');
  };

  // Gérer l'arrivée au point de prise en charge
  const handleArrived = (id: string) => {
    setMyReservations(prev => prev.map(res => 
      res.id === id ? { ...res, status: 'arrived', actualPickupTime: new Date().toISOString() } : res
    ));
    
    // Mettre à jour les données dans localStorage pour le calendrier
    updateCalendarReservation(id, 'arrived');
  };

  // Gérer le client à bord
  const handleClientBoarded = (id: string) => {
    setMyReservations(prev => prev.map(res => 
      res.id === id ? { ...res, status: 'onBoard' } : res
    ));
    
    // Mettre à jour les données dans localStorage pour le calendrier
    updateCalendarReservation(id, 'onBoard');
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

    // S'assurer que nous avons une heure de départ, sinon utiliser l'heure actuelle
    const actualPickupTime = reservationToComplete.actualPickupTime || new Date().toISOString();

    // Ajouter aux réservations terminées avec les données supplémentaires
    const completedReservation: ReservationType = { 
      ...reservationToComplete,
      status: 'completed',
      actualPickupTime: actualPickupTime,
      dropoffTime: new Date().toISOString(),
      distance: "12.5 km", // Ces données seraient calculées dans une vraie application
      duration: "35 min",
      rating,
      comment,
      route: simulatedRoute
    };
    
    setCompletedReservations(prev => [...prev, completedReservation]);
    
    // Mettre à jour les données dans localStorage pour le calendrier
    const calendarReservations = JSON.parse(localStorage.getItem('calendarReservations') || '[]');
    const updatedCalendarReservations = calendarReservations.filter((res: ReservationType) => res.id !== id);
    localStorage.setItem('calendarReservations', JSON.stringify(updatedCalendarReservations));
    
    toast.success(`Course pour ${reservationToComplete.clientName} terminée`);
  };
  
  // Mettre à jour une réservation dans le localStorage pour le calendrier
  const updateCalendarReservation = (id: string, newStatus: string) => {
    const calendarReservations = JSON.parse(localStorage.getItem('calendarReservations') || '[]');
    const updatedCalendarReservations = calendarReservations.map((res: ReservationType) => 
      res.id === id ? { ...res, status: newStatus } : res
    );
    localStorage.setItem('calendarReservations', JSON.stringify(updatedCalendarReservations));
  };
  
  // Ouvrir le chat avec un dispatcher
  const openChatWithDispatcher = (dispatcher: string) => {
    setCurrentDispatcher(dispatcher);
    setShowChat(true);
  };

  // Handle opening the order form dialog
  const handleShowOrderForm = (reservation: ReservationType) => {
    setSelectedReservation(reservation);
    setShowOrderForm(true);
  };

  // Load reservations from localStorage on initial load
  useEffect(() => {
    // Si pas de données dans le localStorage, initialiser avec les données par défaut
    if (!localStorage.getItem('calendarReservations')) {
      localStorage.setItem('calendarReservations', JSON.stringify(initialMyReservations));
    }
    
    const storedMyReservations = localStorage.getItem('myReservations');
    if (storedMyReservations) {
      setMyReservations(JSON.parse(storedMyReservations));
    }
  }, []);

  // Sauvegarder les réservations dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem('myReservations', JSON.stringify(myReservations));
  }, [myReservations]);

  return {
    upcomingReservations,
    myReservations,
    completedReservations,
    activeTab,
    setActiveTab,
    showChat,
    setShowChat,
    currentDispatcher,
    showOrderForm,
    setShowOrderForm,
    selectedReservation,
    handleAcceptReservation,
    handleRejectReservation,
    handleStartRide,
    handleArrived,
    handleClientBoarded,
    handleCompleteRide,
    openChatWithDispatcher,
    handleShowOrderForm
  };
};
