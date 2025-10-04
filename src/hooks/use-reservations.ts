import { useState, useEffect } from "react";
import { ReservationType } from "@/types/reservation";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const useReservations = () => {
  const [upcomingReservations, setUpcomingReservations] = useState<ReservationType[]>([]);
  const [myReservations, setMyReservations] = useState<ReservationType[]>([]);
  const [completedReservations, setCompletedReservations] = useState<ReservationType[]>([]);
  const [activeTab, setActiveTab] = useState("current");
  const [showChat, setShowChat] = useState(false);
  const [currentDispatcher, setCurrentDispatcher] = useState("");
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<ReservationType | null>(null);

  // Fetch reservations from database
  useEffect(() => {
    const fetchReservations = async () => {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching reservations:', error);
        toast.error('Erreur lors du chargement des réservations');
        return;
      }

      if (data) {
        // Map database columns to TypeScript type
        const mappedData: ReservationType[] = data.map(r => ({
          id: r.id,
          clientName: r.client_name,
          pickupAddress: r.pickup_address,
          destination: r.destination,
          date: r.date,
          phone: r.phone,
          flightNumber: r.flight_number || undefined,
          dispatcher: r.dispatcher,
          dispatcherLogo: r.dispatcher_logo || undefined,
          passengers: r.passengers,
          luggage: r.luggage,
          amount: r.amount.toString(),
          driverAmount: r.driver_amount.toString(),
          commission: r.commission.toString(),
          vehicleType: r.vehicle_type as 'standard' | 'berline' | 'first-class',
          paymentType: r.payment_type as 'card' | 'cash',
          status: r.status as ReservationType['status'],
          actualPickupTime: r.actual_pickup_time || undefined,
          dropoffTime: r.dropoff_time || undefined,
          distance: r.distance || undefined,
          duration: r.duration || undefined,
          rating: r.rating || undefined,
          comment: r.comment || undefined,
          route: r.route as ReservationType['route'] || undefined
        }));

        const upcoming = mappedData.filter(r => r.status === 'pending');
        const active = mappedData.filter(r => r.status === 'accepted' || r.status === 'started' || r.status === 'arrived' || r.status === 'onBoard');
        const completed = mappedData.filter(r => r.status === 'completed');

        setUpcomingReservations(upcoming);
        setMyReservations(active);
        setCompletedReservations(completed);
      }
    };

    fetchReservations();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('reservations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reservations'
        },
        () => {
          fetchReservations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Accepter une réservation
  const handleAcceptReservation = async (id: string) => {
    const { error } = await supabase
      .from('reservations')
      .update({ status: 'accepted' })
      .eq('id', id);

    if (error) {
      console.error('Error accepting reservation:', error);
      toast.error('Erreur lors de l\'acceptation');
    } else {
      toast.success("Réservation acceptée");
    }
  };

  // Refuser une réservation
  const handleRejectReservation = async (id: string) => {
    const { error } = await supabase
      .from('reservations')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error rejecting reservation:', error);
      toast.error('Erreur lors du refus');
    } else {
      toast.info("Réservation refusée");
    }
  };

  // Gérer le démarrage d'une course
  const handleStartRide = async (id: string) => {
    const { error } = await supabase
      .from('reservations')
      .update({ 
        status: 'started',
        actual_pickup_time: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('Error starting ride:', error);
      toast.error('Erreur lors du démarrage');
    } else {
      toast.success("Course démarrée");
    }
  };

  // Gérer l'arrivée au point de prise en charge
  const handleArrived = async (id: string) => {
    const { error } = await supabase
      .from('reservations')
      .update({ 
        status: 'arrived',
        actual_pickup_time: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating arrival:', error);
      toast.error('Erreur lors de la mise à jour');
    } else {
      toast.success("Arrivé à destination");
    }
  };

  // Gérer le client à bord
  const handleClientBoarded = async (id: string) => {
    const { error } = await supabase
      .from('reservations')
      .update({ status: 'onBoard' })
      .eq('id', id);

    if (error) {
      console.error('Error updating boarding:', error);
      toast.error('Erreur lors de la mise à jour');
    } else {
      toast.success("Client à bord");
    }
  };

  // Gérer la fin d'une course
  const handleCompleteRide = async (id: string, rating: number, comment: string) => {
    const simulatedRoute = [
      {lat: 48.870, lng: 2.330},
      {lat: 48.865, lng: 2.334},
      {lat: 48.862, lng: 2.338},
      {lat: 48.858, lng: 2.340}
    ];

    const { error } = await supabase
      .from('reservations')
      .update({
        status: 'completed',
        dropoff_time: new Date().toISOString(),
        rating,
        comment,
        distance: "12.5 km",
        duration: "35 min",
        route: simulatedRoute
      })
      .eq('id', id);

    if (error) {
      console.error('Error completing ride:', error);
      toast.error('Erreur lors de la finalisation');
    } else {
      toast.success("Course terminée avec succès");
    }
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
