import { useState, useEffect } from "react";
import { format, parseISO, isValid, startOfWeek, endOfWeek, eachDayOfInterval, startOfDay, endOfDay } from "date-fns";
import { fr } from "date-fns/locale";
import PageHeader from "@/components/PageHeader";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReservationType } from "@/types/reservation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ReservationDetails from "@/components/reservation/ReservationDetails";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import AgendaDay from "@/components/calendar/AgendaDay";
import AgendaWeek from "@/components/calendar/AgendaWeek";

const Calendar = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [reservations, setReservations] = useState<ReservationType[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedReservation, setSelectedReservation] = useState<ReservationType | null>(null);
  const [showReservationDetails, setShowReservationDetails] = useState(false);
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("month");
  
  // Charger les réservations du localStorage
  useEffect(() => {
    const loadReservations = () => {
      const storedReservations = localStorage.getItem('calendarReservations');
      if (storedReservations) {
        setReservations(JSON.parse(storedReservations));
      }
    };

    // Charger au montage
    loadReservations();

    // Écouter les changements du localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'calendarReservations') {
        loadReservations();
      }
    };

    // Événement custom pour MAJ immédiate dans le même onglet
    const handleCustomUpdate = () => loadReservations();

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('calendarReservationsUpdated', handleCustomUpdate as EventListener);
    
    // Vérifier les changements toutes les secondes (fallback)
    const interval = setInterval(loadReservations, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('calendarReservationsUpdated', handleCustomUpdate as EventListener);
      clearInterval(interval);
    };
  }, []);

  // Fonction pour obtenir les réservations selon le mode d'affichage
  const getReservationsForView = () => {
    if (!selectedDate) return [];
    
    let startDate, endDate;
    
    if (viewMode === "day") {
      startDate = startOfDay(selectedDate);
      endDate = endOfDay(selectedDate);
    } else if (viewMode === "week") {
      startDate = startOfWeek(selectedDate, { locale: fr });
      endDate = endOfWeek(selectedDate, { locale: fr });
    } else {
      return getDailyReservations();
    }
    
    return reservations.filter(reservation => {
      const reservationDate = parseISO(reservation.date);
      return isValid(reservationDate) && 
        reservationDate >= startDate && 
        reservationDate <= endDate;
    });
  };

  const getDailyReservations = () => {
    if (!selectedDate) return [];
    
    const selectedDateString = format(selectedDate, 'yyyy-MM-dd');
    return reservations.filter(reservation => {
      const reservationDate = parseISO(reservation.date);
      return isValid(reservationDate) && format(reservationDate, 'yyyy-MM-dd') === selectedDateString;
    });
  };

  const viewReservations = getReservationsForView();

  const getDaysWithReservations = () => {
    const daysWithReservations: Record<string, string> = {};
    
    reservations.forEach(reservation => {
      const reservationDate = parseISO(reservation.date);
      if (isValid(reservationDate)) {
        const dateString = format(reservationDate, 'yyyy-MM-dd');
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

  const renderDayContent = (day: Date) => {
    const dateString = format(day, 'yyyy-MM-dd');
    
    const dayReservations = reservations.filter(res => {
      const resDate = parseISO(res.date);
      return isValid(resDate) && format(resDate, 'yyyy-MM-dd') === dateString;
    });

    if (dayReservations.length === 0) return null;

    const getDotColor = (status?: string) => {
      if (status === 'started') return "bg-amber-500";
      if (status === 'arrived') return "bg-purple-500";
      if (status === 'onBoard') return "bg-teal-500";
      if (status === 'accepted') return "bg-blue-500";
      if (status === 'completed') return "bg-green-500";
      return "bg-gray-400";
    };

    return (
      <div className="absolute bottom-0.5 left-0 right-0 flex justify-center">
        <div className="flex items-center gap-0.5">
          {dayReservations.slice(0, 3).map((reservation, index) => (
            <span 
              key={`${reservation.id}-${index}`} 
              className={`h-1.5 w-1.5 rounded-full ${getDotColor(reservation.status)}`}
            ></span>
          ))}
          {dayReservations.length > 3 && (
            <span className="text-[9px] font-bold ml-0.5">+{dayReservations.length - 3}</span>
          )}
        </div>
      </div>
    );
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300';
      case 'started':
        return 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300';
      case 'arrived':
        return 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:text-purple-300';
      case 'onBoard':
        return 'bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-900/30 dark:text-teal-300';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getDayStyle = (date: Date): React.CSSProperties => {
    const dateString = format(date, 'yyyy-MM-dd');
    const status = daysWithReservations[dateString];
    
    if (!status) return {};

    switch (status) {
      case 'accepted':
        return { backgroundColor: 'rgba(59, 130, 246, 0.2)' };
      case 'started':
        return { backgroundColor: 'rgba(245, 158, 11, 0.2)' };
      case 'arrived':
        return { backgroundColor: 'rgba(168, 85, 247, 0.2)' };
      case 'onBoard':
        return { backgroundColor: 'rgba(20, 184, 166, 0.2)' };
      case 'completed':
        return { backgroundColor: 'rgba(34, 197, 94, 0.2)' };
      default:
        return {};
    }
  };

  const handleOpenReservationDetails = (reservation: ReservationType) => {
    setSelectedReservation(reservation);
    setShowReservationDetails(true);
  };

  const getViewTitle = () => {
    if (!selectedDate) return "Sélectionnez une date";
    
    if (viewMode === "day") {
      return `Réservations du ${format(selectedDate, 'dd MMMM yyyy', { locale: fr })}`;
    } else if (viewMode === "week") {
      const weekStart = startOfWeek(selectedDate, { locale: fr });
      const weekEnd = endOfWeek(selectedDate, { locale: fr });
      return `Semaine du ${format(weekStart, 'dd')} au ${format(weekEnd, 'dd MMMM yyyy', { locale: fr })}`;
    } else {
      return `Réservations du ${format(selectedDate, 'dd MMMM yyyy', { locale: fr })}`;
    }
  };

  const getViewModeColor = (mode: string) => {
    switch (mode) {
      case 'day':
        return 'data-[state=on]:bg-blue-500 data-[state=on]:text-white';
      case 'week':
        return 'data-[state=on]:bg-purple-500 data-[state=on]:text-white';
      case 'month':
        return 'data-[state=on]:bg-green-500 data-[state=on]:text-white';
      default:
        return '';
    }
  };

  return (
    <div className="p-4 sm:p-6 animate-fade-in">
      <PageHeader title="planning" />
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-4">
          Calendrier
          <ToggleGroup 
            type="single" 
            value={viewMode} 
            onValueChange={(value) => value && setViewMode(value as "day" | "week" | "month")}
            className="border rounded-lg"
          >
            <ToggleGroupItem 
              value="day" 
              aria-label="Vue jour"
              className="data-[state=on]:bg-blue-500 data-[state=on]:text-white transition-all"
            >
              Jour
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="week" 
              aria-label="Vue semaine"
              className="data-[state=on]:bg-purple-500 data-[state=on]:text-white transition-all"
            >
              Semaine
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="month" 
              aria-label="Vue mois"
              className="data-[state=on]:bg-green-500 data-[state=on]:text-white transition-all"
            >
              Mois
            </ToggleGroupItem>
          </ToggleGroup>
        </h2>
      </div>
      
      <div className="flex flex-col gap-6">
        <Card className="hover-scale border-t-4 border-t-indigo-500">
          <CardHeader className="pb-2 bg-gradient-to-r from-indigo-50 to-white dark:from-indigo-950/20 dark:to-background">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center text-xl">
                <CalendarIcon className="mr-2 h-5 w-5 text-indigo-600" />
                Calendrier
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <CalendarComponent
              mode="single"
              selected={selectedDate || undefined}
              onSelect={(day) => setSelectedDate(day)}
              className="rounded-md border"
              locale={fr}
              showOutsideDays={viewMode === "month"}
              modifiers={{
                booked: (date) => Boolean(daysWithReservations[format(date, 'yyyy-MM-dd')]),
                hidden: (date) => {
                  if (!selectedDate) return false;
                  if (viewMode === 'day') {
                    return format(date, 'yyyy-MM-dd') !== format(selectedDate, 'yyyy-MM-dd');
                  }
                  if (viewMode === 'week') {
                    const start = startOfWeek(selectedDate, { locale: fr });
                    const end = endOfWeek(selectedDate, { locale: fr });
                    return date < start || date > end;
                  }
                  return false; // month: show all
                },
              }}
              modifiersStyles={{
                booked: { textDecoration: 'none' },
              }}
              components={{
                DayContent: ({ date }) => (
                  <div className="relative w-full h-full flex items-center justify-center transition-all" style={getDayStyle(date)}>
                    <div>{format(date, 'd')}</div>
                    {renderDayContent(date)}
                  </div>
                )
              }}
            />
          </CardContent>
        </Card>
        
        <Card className="hover-scale border-t-4 border-t-pink-500">
          <CardHeader className="pb-2 bg-gradient-to-r from-pink-50 to-white dark:from-pink-950/20 dark:to-background">
            <CardTitle className="text-xl">
              {getViewTitle()}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            {!selectedDate ? (
              <div className="text-center py-8 text-muted-foreground">
                Veuillez sélectionner une date pour voir les réservations
              </div>
            ) : (
              <div className="space-y-6">
                {viewMode === "day" && (
                  <AgendaDay
                    date={selectedDate}
                    reservations={reservations}
                    onSelect={handleOpenReservationDetails}
                  />
                )}

                {viewMode === "week" && (
                  <AgendaWeek
                    selectedDate={selectedDate}
                    reservations={reservations}
                    onSelect={handleOpenReservationDetails}
                  />
                )}

                {viewMode === "month" && viewReservations.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Aucune réservation pour cette date
                  </div>
                ) : viewMode === "month" ? (
                  <div className="space-y-4">
                    {viewReservations.map((reservation) => (
                      <div 
                        key={reservation.id}
                        className={cn(
                          "p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-lg hover-scale",
                          getStatusColor(reservation.status)
                        )}
                        onClick={() => handleOpenReservationDetails(reservation)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium text-lg">{reservation.clientName}</p>
                            <p className="text-sm">
                              {format(parseISO(reservation.date), 'dd/MM/yyyy HH:mm')}
                            </p>
                          </div>
                          <Badge variant="outline" className={cn(
                            "border-2 font-semibold", 
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
                ) : null}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

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
