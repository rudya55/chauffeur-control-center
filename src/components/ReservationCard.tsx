import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Check, X, MapPin, Plane, Star, Navigation, Clock, Users, 
  Luggage, Flag, MessageSquare, CarFront, DollarSign, CreditCard, 
  Euro, Virement, Paypal
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
  onChatWithDispatcher
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
        return <Virement className="h-4 w-4 text-purple-500" />;
      case 'paypal':
        return <Paypal className="h-4 w-4 text-blue-600" />;
      default:
        return <DollarSign className="h-4 w-4 text-gray-500" />;
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
              
              {/* Chat button - only show for current reservations */}
              {type === 'current' && onChatWithDispatcher && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={handleChatWithDispatcher}
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
            {/* Payment and price information */}
            {reservation.driverAmount && (
              <div className="flex items-center gap-2">
                {renderPaymentIcon(reservation.paymentType)}
                <span className="text-sm">
                  {reservation.paymentType === 'cash' && "Espèces"}
                  {reservation.paymentType === 'card' && "Carte bleue"}
                  {reservation.paymentType === 'transfer' && "Virement"}
                  {reservation.paymentType === 'paypal' && "PayPal"}
                  {!reservation.paymentType && "Paiement"} - 
                  {type === 'upcoming' ? (
                    <span className="font-medium"> {reservation.driverAmount}€ net chauffeur</span>
                  ) : (
                    reservation.paymentType === 'cash' || reservation.paymentType === 'card' ? (
                      <span> {reservation.amount}€ client / {reservation.commission}€ commission / <span className="font-medium">{reservation.driverAmount}€ net</span></span>
                    ) : (
                      <span className="font-medium"> {reservation.driverAmount}€ net chauffeur</span>
                    )
                  )}
                </span>
              </div>
            )}

            {/* Vehicle type */}
            {reservation.vehicleType && (
              <div className="flex items-center gap-2">
                <CarFront className="h-4 w-4 text-gray-500" />
                <span className="text-sm capitalize">
                  {reservation.vehicleType === 'first-class' ? 'First Class' : reservation.vehicleType}
                </span>
              </div>
            )}

            {reservation.flightNumber && (
              <div 
                className="flex items-center gap-2 cursor-pointer hover:text-primary"
                onClick={() => handleCheckFlight(reservation.flightNumber || '')}
              >
                <Plane className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{reservation.flightNumber}</span>
              </div>
            )}
            
            {/* Display client name on a separate line when it exists and not in upcoming tab */}
            {reservation.clientName && type !== 'upcoming' && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-500" />
                <span 
                  className="text-sm cursor-pointer hover:text-primary"
                  onClick={() => handleShowPassenger(reservation.clientName)}
                >
                  {reservation.clientName}
                </span>
              </div>
            )}

            {reservation.passengers && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{reservation.passengers} personne{reservation.passengers > 1 ? 's' : ''}</span>
              </div>
            )}
            
            {reservation.luggage && (
              <div className="flex items-center gap-2">
                <Luggage className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{reservation.luggage} bagage{reservation.luggage > 1 ? 's' : ''}</span>
              </div>
            )}
          </div>

          {type === 'upcoming' && (
            <div className="mt-4 flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1 bg-secondary/10 hover:bg-secondary/20 border-secondary/30"
                onClick={() => onAccept?.(reservation.id)}
              >
                <Check className="mr-2 h-4 w-4" />
                Accepter
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 bg-destructive/10 hover:bg-destructive/20 border-destructive/30"
                onClick={() => onReject?.(reservation.id)}
              >
                <X className="mr-2 h-4 w-4" />
                Refuser
              </Button>
            </div>
          )}

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
