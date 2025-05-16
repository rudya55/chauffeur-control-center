
import { useState, useEffect } from "react";
import { format, parseISO, isValid } from "date-fns";
import { fr } from "date-fns/locale";
import PageHeader from "@/components/PageHeader";
import { Calendar as CalendarIcon, CircleDot } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReservationType } from "@/types/reservation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ReservationDetails from "@/components/reservation/ReservationDetails";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const Calendar = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [reservations, setReservations] = useState<ReservationType[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedReservation, setSelectedReservation] = useState<ReservationType | null>(null);
  const [showReservationDetails, setShowReservationDetails] = useState(false);
  
  // Charger les réservations du localStorage
  useEffect(() => {
    const storedReservations = localStorage.getItem('calendarReservations');
    if (storedReservations) {
      setReservations(JSON.parse(storedReservations));
    }
  }, []);

  // Réservations du jour sélectionné
  const getDailyReservations = () => {
    if (!selectedDate) return [];
    
    const selectedDateString = format(selectedDate, 'yyyy-MM-dd');
    return reservations.filter(reservation => {
      const reservationDate = parseISO(reservation.date);
      return isValid(reservationDate) && format(reservationDate, 'yyyy-MM-dd') === selectedDateString;
    });
  };

  const dailyReservations = getDailyReservations();

  // Fonction pour obtenir toutes les dates avec des réservations
  const getDaysWithReservations = () => {
    const daysWithReservations: Record<string, string> = {};
    
    reservations.forEach(reservation => {
      const reservationDate = parseISO(reservation.date);
      if (isValid(reservationDate)) {
        const dateString = format(reservationDate, 'yyyy-MM-dd');
        // Stocker le statut de la réservation la plus prioritaire pour cette date
        // Priorité: started > arrived > onBoard > accepted > completed
        const currentStatus = daysWithReservations[dateString];
        const newStatus = reservation.status || 'pending';
        
        if (!currentStatus) {
          daysWithReservations[dateString] = newStatus;
        } else {
          if (newStatus === 'started') {
            daysWithReservations[dateString] = 'started';
          } else if (newStatus === 'arrived' && currentStatus !== 'started') {
            daysWithReservations[dateString] = 'arrived';
          } else if (newStatus === 'onBoard' && currentStatus !== 'started' && currentStatus !== 'arrived') {
            daysWithReservations[dateString] = 'onBoard';
          } else if (newStatus === 'accepted' && !['started', 'arrived', 'onBoard'].includes(currentStatus)) {
            daysWithReservations[dateString] = 'accepted';
          }
        }
      }
    });
    
    return daysWithReservations;
  };

  const daysWithReservations = getDaysWithReservations();

  // Rendu personnalisé pour les jours avec des réservations
  const renderDayContent = (day: Date) => {
    const dateString = format(day, 'yyyy-MM-dd');
    const status = daysWithReservations[dateString];

    if (!status) return null;

    // Nombre de réservations pour cette date
    const count = reservations.filter(res => {
      const resDate = parseISO(res.date);
      return isValid(resDate) && format(resDate, 'yyyy-MM-dd') === dateString;
    }).length;

    // Couleurs en fonction du statut
    let dotColor = "bg-gray-400";
    if (status === 'started') dotColor = "bg-amber-500";
    else if (status === 'arrived') dotColor = "bg-purple-500";
    else if (status === 'onBoard') dotColor = "bg-teal-500";
    else if (status === 'accepted') dotColor = "bg-blue-500";
    else if (status === 'completed') dotColor = "bg-green-500";

    return (
      <div className="absolute bottom-0.5 left-0 right-0 flex justify-center">
        <div className="flex items-center gap-0.5">
          <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`}></span>
          {count > 1 && <span className="text-[10px] font-medium">{count}</span>}
        </div>
      </div>
    );
  };

  // Couleur en fonction du statut
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'started':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'arrived':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'onBoard':
        return 'bg-teal-100 text-teal-800 border-teal-300';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Fonction pour styliser les jours dans le calendrier
  const getDayStyle = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    const status = daysWithReservations[dateString];
    
    if (!status) return {};

    // Styles pour les différents statuts
    switch (status) {
      case 'accepted':
        return { backgroundColor: 'rgba(59, 130, 246, 0.15)' };
      case 'started':
        return { backgroundColor: 'rgba(245, 158, 11, 0.15)' };
      case 'arrived':
        return { backgroundColor: 'rgba(168, 85, 247, 0.15)' };
      case 'onBoard':
        return { backgroundColor: 'rgba(20, 184, 166, 0.15)' };
      case 'completed':
        return { backgroundColor: 'rgba(34, 197, 94, 0.15)' };
      default:
        return {};
    }
  };

  // Ouvrir le dialogue des détails de réservation
  const handleOpenReservationDetails = (reservation: ReservationType) => {
    setSelectedReservation(reservation);
    setShowReservationDetails(true);
  };

  return (
    <div className="p-4 sm:p-6">
      <PageHeader title="planning" />
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Calendrier */}
        <Card className="md:col-span-7">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <CalendarIcon className="mr-2 h-5 w-5" />
              Calendrier
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <CalendarComponent
              mode="single"
              selected={selectedDate || undefined}
              onSelect={(day) => setSelectedDate(day)}
              className="rounded-md border"
              locale={fr}
              modifiers={{
                booked: (date) => Boolean(daysWithReservations[format(date, 'yyyy-MM-dd')])
              }}
              modifiersStyles={{
                booked: (date) => getDayStyle(date)
              }}
              components={{
                DayContent: ({ date, ...props }) => (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <div {...props} />
                    {renderDayContent(date)}
                  </div>
                )
              }}
            />
          </CardContent>
        </Card>
        
        {/* Liste des réservations du jour */}
        <Card className="md:col-span-5">
          <CardHeader className="pb-2">
            <CardTitle>
              {selectedDate 
                ? `Réservations du ${format(selectedDate, 'dd MMMM yyyy', { locale: fr })}`
                : "Sélectionnez une date"
              }
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            {!selectedDate ? (
              <div className="text-center py-8 text-muted-foreground">
                Veuillez sélectionner une date pour voir les réservations
              </div>
            ) : dailyReservations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Aucune réservation pour cette date
              </div>
            ) : (
              <div className="space-y-4">
                {dailyReservations.map((reservation) => (
                  <div 
                    key={reservation.id}
                    className={cn(
                      "p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md",
                      getStatusColor(reservation.status)
                    )}
                    onClick={() => handleOpenReservationDetails(reservation)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">{reservation.clientName}</p>
                        <p className="text-sm">
                          {format(parseISO(reservation.date), 'HH:mm')}
                        </p>
                      </div>
                      <Badge variant="outline" className={cn(
                        "border", 
                        reservation.status === 'accepted' && "bg-blue-500 text-white border-blue-600",
                        reservation.status === 'started' && "bg-amber-500 text-white border-amber-600",
                        reservation.status === 'arrived' && "bg-purple-500 text-white border-purple-600",
                        reservation.status === 'onBoard' && "bg-teal-500 text-white border-teal-600",
                        reservation.status === 'completed' && "bg-green-500 text-white border-green-600",
                      )}>
                        {reservation.status === 'accepted' && "Acceptée"}
                        {reservation.status === 'started' && "En route"}
                        {reservation.status === 'arrived' && "Arrivé"}
                        {reservation.status === 'onBoard' && "Client à bord"}
                        {reservation.status === 'completed' && "Terminée"}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p className="flex items-center">
                        <span className="font-medium mr-1">De:</span> {reservation.pickupAddress}
                      </p>
                      <p className="flex items-center">
                        <span className="font-medium mr-1">À:</span> {reservation.destination}
                      </p>
                      {reservation.dispatcher && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Via {reservation.dispatcher} {reservation.dispatcherLogo}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialogue des détails de réservation */}
      <Dialog 
        open={showReservationDetails} 
        onOpenChange={setShowReservationDetails}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails de la réservation</DialogTitle>
          </DialogHeader>
          
          {selectedReservation && (
            <div className="py-4">
              <ReservationDetails 
                pickupAddress={selectedReservation.pickupAddress}
                destination={selectedReservation.destination}
                flightNumber={selectedReservation.flightNumber}
                clientName={selectedReservation.clientName}
                amount={selectedReservation.amount}
                driverAmount={selectedReservation.driverAmount}
                commission={selectedReservation.commission}
                paymentType={selectedReservation.paymentType}
                flightStatus={selectedReservation.flightStatus}
                placardText={selectedReservation.placardText}
                pickupGPS={selectedReservation.pickupGPS}
                destinationGPS={selectedReservation.destinationGPS}
                dispatcherLogo={selectedReservation.dispatcherLogo}
                passengers={selectedReservation.passengers}
                luggage={selectedReservation.luggage}
                status={selectedReservation.status}
                vehicleType={selectedReservation.vehicleType}
                showAddressLabels={true}
              />
              
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Statut:</span> {
                    selectedReservation.status === 'accepted' && "Acceptée" ||
                    selectedReservation.status === 'started' && "En route" ||
                    selectedReservation.status === 'arrived' && "Arrivé" ||
                    selectedReservation.status === 'onBoard' && "Client à bord" ||
                    selectedReservation.status === 'completed' && "Terminée" ||
                    "En attente"
                  }
                </p>
                
                <p className="text-sm text-muted-foreground mt-1">
                  <span className="font-medium text-foreground">Date et heure:</span> {
                    format(parseISO(selectedReservation.date), 'dd MMMM yyyy à HH:mm', { locale: fr })
                  }
                </p>
                
                {selectedReservation.status === 'completed' && selectedReservation.rating && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">Évaluation:</p>
                    <div className="flex items-center">
                      <span className="text-amber-500 mr-1">
                        {'★'.repeat(selectedReservation.rating)}
                        {'☆'.repeat(5 - selectedReservation.rating)}
                      </span>
                      <span className="text-sm ml-1">{selectedReservation.rating}/5</span>
                    </div>
                    {selectedReservation.comment && (
                      <p className="text-sm italic mt-1">"{selectedReservation.comment}"</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Calendar;
