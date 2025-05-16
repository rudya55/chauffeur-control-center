
import { ReservationType } from "@/types/reservation";

export const initialUpcomingReservations: ReservationType[] = [
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

export const initialMyReservations: ReservationType[] = [
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

export const initialCompletedReservations: ReservationType[] = [
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
