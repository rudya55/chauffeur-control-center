
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Check, X, MapPin, Plane, Star, Navigation, Clock, Users, 
  Luggage, Flag, MessageSquare, CarFront, DollarSign, CreditCard, 
  Euro, Banknote, ArrowRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import Map from "@/components/Map";
import CircularTimer from "@/components/CircularTimer";

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

interface ReservationCardProps {
  reservation: ReservationType;
  type: 'upcoming' | 'current' | 'completed';
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  onStartRide?: (id: string) => void;
  onArrived?: (id: string) => void;
  onClientBoarded?: (id: string) => void;
  onComplete?: (id: string, rating: number, comment: string) => void;
  onChatWithDispatcher?: (dispatcher: string) => void;
  onShowOrderForm?: (reservation: ReservationType) => void; // New prop for order form
}

const ReservationCard = ({ 
  reservation, 
  type,
  onAccept,
  onReject,
  onStartRide,
  onArrived,
  onClientBoarded,
  onComplete,
  onChatWithDispatcher,
  onShowOrderForm
}: ReservationCardProps) => {
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showNavigationOptions, setShowNavigationOptions] = useState(false);
  const [canStartNow, setCanStartNow] = useState(false);
  const [navigationAddress, setNavigationAddress] = useState("");
  const [showPassengerDialog, setShowPassengerDialog] = useState(false);
  const [showFlightDialog, setShowFlightDialog] = useState(false);
  const [targetTime, setTargetTime] = useState<Date | null>(null);

  // Function to render payment type icon
  const renderPaymentIcon = (type?: PaymentType) => {
    switch(type) {
      case 'cash':
        return <Euro className="h-4 w-4 text-green-500" />;
      case 'card':
        return <CreditCard className="h-4 w-4 text-blue-500" />;
      case 'transfer':
        return <Banknote className="h-4 w-4 text-purple-500" />; 
      case 'paypal':
        return <DollarSign className="h-4 w-4 text-blue-600" />;
      default:
        return <DollarSign className="h-4 w-4 text-gray-500" />;
    }
  };

  // Function to get payment type text
  const getPaymentTypeText = (type?: PaymentType) => {
    switch(type) {
      case 'cash': return "Espèces";
      case 'card': return "Carte bleue";
      case 'transfer': return "Virement";
      case 'paypal': return "PayPal";
      default: return "Paiement";
    }
  };

  // Function to render vehicle type icon
  const renderVehicleIcon = (type?: VehicleType) => {
    return <CarFront className="h-4 w-4 text-gray-500" />;
  };

  const formattedDate = new Date(reservation.date).toLocaleString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });

  useEffect(() => {
    // Update the timer for accepted reservations - using 10 seconds for testing
    if (reservation.status === 'accepted') {
      const now = new Date();
      // Set target time 10 seconds from now
      const targetDate = new Date(now.getTime() + 10 * 1000);
      setTargetTime(targetDate);
      
      const updateAvailability = () => {
        const currentTime = new Date().getTime();
        if (currentTime >= targetDate.getTime()) {
          setCanStartNow(true);
        }
      };
      
      updateAvailability(); // Initial call
      const interval = setInterval(updateAvailability, 1000);
      
      return () => clearInterval(interval);
    }
  }, [reservation.status]);

  const handleShowPassenger = (name: string) => {
    if (!name) return;
    setShowPassengerDialog(true);
  };

  const handleCheckFlight = (flight: string) => {
    if (!flight) return;
    setShowFlightDialog(true);
  };

  const handleNavigationChoice = (app: string, address: string) => {
    toast({
      title: "Navigation lancée",
      description: `Vers ${address} avec ${app}`,
    });
    setShowNavigationOptions(false);
  };

  const handleStartNavigation = (address: string) => {
    setNavigationAddress(address);
    setShowNavigationOptions(true);
  };

  const handleCompleteRide = () => {
    setShowRatingDialog(true);
  };

  const handleSubmitRating = () => {
    onComplete?.(reservation.id, rating, comment);
    setShowRatingDialog(false);
  };

  const canStartRide = () => {
    // 10 seconds test instead of 2 hours
    const rideTime = new Date(reservation.date).getTime();
    const now = new Date().getTime();
    const testTimeInMs = 10 * 1000; // 10 seconds for testing
    
    return now >= (rideTime - testTimeInMs);
  };

  // Pour discuter avec le dispatcher
  const handleChatWithDispatcher = () => {
    onChatWithDispatcher?.(reservation.dispatcher);
  };

  // Handle when timer reaches completion
  const handleTimerComplete = () => {
    setCanStartNow(true);
  };

  return (
    <>
      <Card className="mb-4">
        <CardContent className="pt-6">
          {/* For upcoming reservations */}
          {type === 'upcoming' && (
            <>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="text-sm text-gray-500">
                    {formattedDate}
                  </div>
                </div>
                <Badge className="flex items-center gap-1">
                  <Flag className="h-3 w-3" />
                  {reservation.dispatcher}
                </Badge>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-1 text-primary shrink-0" />
                  <div className="text-sm">{reservation.pickupAddress}</div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-1 text-destructive shrink-0" />
                  <div className="text-sm">{reservation.destination}</div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {reservation.passengers && (
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-indigo-500" />
                      <span className="text-sm">{reservation.passengers}</span>
                    </div>
                  )}
                  
                  {reservation.luggage && (
                    <div className="flex items-center gap-1 ml-2">
                      <Luggage className="h-4 w-4 text-amber-500" />
                      <span className="text-sm">{reservation.luggage}</span>
                    </div>
                  )}
                </div>

                {/* Vehicle type and payment */}
                <div className="flex items-center gap-2">
                  {reservation.vehicleType && (
                    <div className="flex items-center gap-1">
                      {renderVehicleIcon(reservation.vehicleType)}
                      <span className="text-sm capitalize">
                        {reservation.vehicleType === 'first-class' ? 'First Class' : reservation.vehicleType}
                      </span>
                    </div>
                  )}
                  
                  {reservation.paymentType && (
                    <div className="flex items-center gap-1 ml-2">
                      {renderPaymentIcon(reservation.paymentType)}
                      <span className="text-sm">{getPaymentTypeText(reservation.paymentType)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center">
                <div className="text-lg font-bold text-emerald-600">
                  {reservation.driverAmount}€ <span className="text-xs text-gray-500">(NET)</span>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="bg-red-50 hover:bg-red-100 border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/30"
                    onClick={() => onReject?.(reservation.id)}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Refuser</span>
                  </Button>
                  <Button 
                    className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
                    onClick={() => onAccept?.(reservation.id)}
                  >
                    <Check className="h-4 w-4" />
                    <span className="sr-only">Accepter</span>
                  </Button>
                </div>
              </div>
            </>
          )}
          
          {/* For current and completed reservations */}
          {(type === 'current' || type === 'completed') && (
            <>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="text-sm text-gray-500">
                    {formattedDate}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="flex items-center gap-1">
                    <Flag className="h-3 w-3" />
                    {reservation.dispatcher}
                  </Badge>
                  
                  {/* Add "Bon de commande" button for accepted/active reservations */}
                  {type === 'current' && reservation.status !== 'pending' && onShowOrderForm && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-xs bg-red-50 hover:bg-red-100 border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/30"
                      style={{ backgroundColor: "#ea384c", color: "white", borderColor: "#ea384c" }}
                      onClick={() => onShowOrderForm(reservation)}
                    >
                      Bon de commande
                    </Button>
                  )}
                  
                  {/* Chat button - only show for current reservations */}
                  {type === 'current' && onChatWithDispatcher && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8" 
                      onClick={() => onChatWithDispatcher(reservation.dispatcher)}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-1 text-primary shrink-0" />
                  <div className="w-full">
                    <div className="text-sm font-medium">Prise en charge:</div>
                    <div 
                      className={`text-sm w-full overflow-ellipsis ${(type === 'current' && (reservation.status === 'accepted' || reservation.status === 'started')) ? 'cursor-pointer hover:text-primary' : ''}`}
                      onClick={(type === 'current' && (reservation.status === 'accepted' || reservation.status === 'started')) ? () => handleStartNavigation(reservation.pickupAddress) : undefined}
                    >
                      {reservation.pickupAddress}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-1 text-destructive shrink-0" />
                  <div className="w-full">
                    <div className="text-sm font-medium">Destination:</div>
                    <div 
                      className={`text-sm w-full overflow-ellipsis ${(type === 'current' && (reservation.status === 'accepted' || reservation.status === 'arrived' || reservation.status === 'onBoard' || reservation.status === 'started')) ? 'cursor-pointer hover:text-primary' : ''}`}
                      onClick={(type === 'current' && (reservation.status === 'accepted' || reservation.status === 'arrived' || reservation.status === 'onBoard' || reservation.status === 'started')) ? () => handleStartNavigation(reservation.destination) : undefined}
                    >
                      {reservation.destination}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {/* Combine passenger, luggage, vehicle and payment info on the same line */}
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Client name */}
                  {reservation.clientName && (
                    <div className="flex items-center gap-1 mr-3">
                      <Users className="h-4 w-4 text-indigo-500" />
                      <span 
                        className="text-sm cursor-pointer hover:text-primary"
                        onClick={() => handleShowPassenger(reservation.clientName)}
                      >
                        {reservation.clientName}
                      </span>
                    </div>
                  )}
                  
                  {/* Passengers and luggage combined */}
                  <div className="flex items-center gap-1 mr-3">
                    {reservation.passengers && (
                      <>
                        <Users className="h-4 w-4 text-indigo-500" />
                        <span className="text-sm">
                          {reservation.passengers} <span className="text-xs">pers.</span>
                        </span>
                      </>
                    )}
                    
                    {reservation.luggage && (
                      <>
                        <Luggage className="h-4 w-4 ml-2 text-amber-500" />
                        <span className="text-sm">
                          {reservation.luggage} <span className="text-xs">bag.</span>
                        </span>
                      </>
                    )}
                  </div>
                  
                  {/* Vehicle type */}
                  {reservation.vehicleType && (
                    <div className="flex items-center gap-1 mr-3">
                      <CarFront className="h-4 w-4 text-slate-500" />
                      <span className="text-sm capitalize">
                        {reservation.vehicleType === 'first-class' ? 'First Class' : reservation.vehicleType}
                      </span>
                    </div>
                  )}
                  
                  {/* Payment type */}
                  {reservation.paymentType && (
                    <div className="flex items-center gap-1">
                      {renderPaymentIcon(reservation.paymentType)}
                      <span className="text-sm">{getPaymentTypeText(reservation.paymentType)}</span>
                    </div>
                  )}
                </div>

                {/* Flight info if available */}
                {reservation.flightNumber && (
                  <div 
                    className="flex items-center gap-2 cursor-pointer hover:text-primary"
                    onClick={() => handleCheckFlight(reservation.flightNumber || '')}
                  >
                    <Plane className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{reservation.flightNumber}</span>
                  </div>
                )}
              </div>

              {type === 'current' && (
                <div className="mt-4 flex flex-col gap-2">
                  {reservation.status === 'accepted' && (
                    <>
                      {targetTime && (
                        <div className={`flex justify-center py-2 ${canStartNow ? 'text-green-800' : ''}`}>
                          <CircularTimer 
                            targetTime={targetTime} 
                            onTimeReached={handleTimerComplete} 
                            durationInSeconds={10}
                          />
                        </div>
                      )}
                      <Button 
                        variant="default" 
                        className="w-full bg-primary"
                        onClick={() => onStartRide?.(reservation.id)}
                        disabled={!canStartNow}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        Démarrer la course
                      </Button>
                    </>
                  )}
                  
                  {reservation.status === 'started' && (
                    <Button 
                      variant="default" 
                      className="w-full bg-blue-500 hover:bg-blue-600"
                      onClick={() => onArrived?.(reservation.id)}
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      Arrivé au point de prise en charge
                    </Button>
                  )}
                  
                  {reservation.status === 'arrived' && (
                    <Button 
                      variant="default" 
                      className="w-full bg-green-500 hover:bg-green-600"
                      onClick={() => onClientBoarded?.(reservation.id)}
                    >
                      <Users className="mr-2 h-4 w-4" />
                      Client à bord
                    </Button>
                  )}
                  
                  {reservation.status === 'onBoard' && (
                    <Button 
                      variant="default" 
                      className="w-full bg-red-500 hover:bg-red-600"
                      onClick={handleCompleteRide}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Terminer la course
                    </Button>
                  )}
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
                  
                  {reservation.rating && (
                    <div className="mt-3 flex items-center justify-center">
                      <div className="text-xs text-gray-500 mr-2">Évaluation:</div>
                      <div className="flex">
                        {Array(5).fill(0).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < (reservation.rating || 0) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {reservation.comment && (
                    <div className="mt-2 text-sm text-gray-600">
                      <p className="italic">"{reservation.comment}"</p>
                    </div>
                  )}
                  
                  {/* Carte avec l'itinéraire pour les courses terminées */}
                  {reservation.route && (
                    <div className="mt-3 h-40 rounded-md overflow-hidden">
                      <Map 
                        className="w-full h-full" 
                        center={reservation.route[0]}
                        zoom={14}
                        route={reservation.route}
                      />
                    </div>
                  )}
                </div>
              )}
              
              {/* Price at the bottom for current and completed */}
              <div className="mt-4 pt-3 border-t border-gray-200 text-center">
                <div className="text-lg font-bold text-emerald-600">
                  {reservation.driverAmount}€ <span className="text-xs text-gray-500">(NET)</span>
                </div>
                {(reservation.amount && reservation.commission) && (
                  <div className="text-sm text-gray-500">
                    {reservation.amount}€ client / {reservation.commission}€ commission
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Dialog d'options de navigation */}
      <Dialog open={showNavigationOptions} onOpenChange={setShowNavigationOptions}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Choisir une application de navigation</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Button onClick={() => handleNavigationChoice("Google Maps", navigationAddress)} className="flex items-center justify-center">
              <Navigation className="mr-2 h-4 w-4" />
              Google Maps
            </Button>
            <Button onClick={() => handleNavigationChoice("Waze", navigationAddress)} className="flex items-center justify-center">
              <Navigation className="mr-2 h-4 w-4" />
              Waze
            </Button>
            <Button onClick={() => handleNavigationChoice("Plans", navigationAddress)} className="flex items-center justify-center">
              <Navigation className="mr-2 h-4 w-4" />
              Apple Plans
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog notation client */}
      <Dialog open={showRatingDialog} onOpenChange={setShowRatingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Évaluer le client</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="flex justify-center mb-4">
              {Array(5).fill(0).map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-8 w-8 cursor-pointer ${i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                  onClick={() => setRating(i + 1)} 
                />
              ))}
            </div>
            <textarea 
              className="w-full p-2 border rounded-md" 
              rows={4}
              placeholder="Commentaire (optionnel)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button onClick={handleSubmitRating}>Soumettre</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog affichage pancarte passager */}
      <Dialog open={showPassengerDialog} onOpenChange={setShowPassengerDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Pancarte passager</DialogTitle>
          </DialogHeader>
          <div className="p-10 flex flex-col items-center justify-center bg-slate-100 rounded-lg">
            <div className="text-4xl mb-4">{reservation.dispatcherLogo}</div>
            <div className="text-3xl font-bold text-center">{reservation.clientName}</div>
            <div className="text-sm text-gray-500 mt-2 text-center">{reservation.dispatcher}</div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowPassengerDialog(false)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog suivi de vol */}
      <Dialog open={showFlightDialog} onOpenChange={setShowFlightDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              <div className="flex items-center">
                <Plane className="mr-2 h-5 w-5" />
                Suivi du vol {reservation.flightNumber}
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="p-4 space-y-4">
            <div className="flex justify-between p-2 bg-slate-50 rounded-md">
              <div className="font-medium">Statut</div>
              <div className="text-green-600">À l'heure</div>
            </div>
            <div className="flex justify-between p-2 bg-slate-50 rounded-md">
              <div className="font-medium">Départ prévu</div>
              <div>10:30</div>
            </div>
            <div className="flex justify-between p-2 bg-slate-50 rounded-md">
              <div className="font-medium">Arrivée prévue</div>
              <div>12:15</div>
            </div>
            <div className="flex justify-between p-2 bg-slate-50 rounded-md">
              <div className="font-medium">Terminal</div>
              <div>2E</div>
            </div>
            <div className="flex justify-between p-2 bg-slate-50 rounded-md">
              <div className="font-medium">Porte</div>
              <div>K45</div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowFlightDialog(false)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReservationCard;
