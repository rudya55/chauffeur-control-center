
import { useState, useEffect } from "react";
import { ReservationType } from "@/types/reservation";
import { initialUpcomingReservations, initialMyReservations, initialCompletedReservations } from "@/data/mockReservations";

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
    // Trouver la réservation dans la liste des réservations à venir
    const reservation = upcomingReservations.find(res => res.id === id);
    
    if (reservation) {
      // Mettre à jour le statut et déplacer vers mes réservations
      const updatedReservation: ReservationType = { ...reservation, status: 'accepted' };
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
    const completedReservation: ReservationType = { 
      ...reservationToComplete,
      status: 'completed',
      dropoffTime: new Date().toISOString(),
      distance: "12.5 km", // Ces données seraient calculées dans une vraie application
      duration: "35 min",
      rating,
      comment,
      route: simulatedRoute
    };
    
    setCompletedReservations(prev => [...prev, completedReservation]);
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
    const storedMyReservations = localStorage.getItem('myReservations');
    
    if (storedMyReservations) {
      setMyReservations(JSON.parse(storedMyReservations));
    }
  }, []);

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
