
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, MapPin, Phone, Plane, Star, Navigation, Clock, Users, Luggage } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

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
  luggage?: number;
  status?: 'pending' | 'accepted' | 'started' | 'arrived' | 'onBoard' | 'completed';
  actualPickupTime?: string;
  dropoffTime?: string;
  distance?: string;
  duration?: string;
  amount?: string;
  rating?: number;
  comment?: string;
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
}

const ReservationCard = ({ 
  reservation, 
  type,
  onAccept,
  onReject,
  onStartRide,
  onArrived,
  onClientBoarded,
  onComplete
}: ReservationCardProps) => {
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showNavigationOptions, setShowNavigationOptions] = useState(false);
  const [timeUntilRide, setTimeUntilRide] = useState<string>("");
  const [canStartNow, setCanStartNow] = useState(false);

  const formattedDate = new Date(reservation.date).toLocaleString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });

  useEffect(() => {
    // Update the timer for accepted reservations
    if (reservation.status === 'accepted') {
      const rideTime = new Date(reservation.date).getTime();
      const twoHoursBeforeMs = rideTime - (2 * 60 * 60 * 1000);
      
      const updateTimer = () => {
        const now = new Date().getTime();
        const canStartTime = Math.max(twoHoursBeforeMs - now, 0);
        
        if (now >= twoHoursBeforeMs) {
          setCanStartNow(true);
          setTimeUntilRide("Disponible maintenant");
        } else {
          setCanStartNow(false);
          
          // Calculate remaining time
          const hours = Math.floor(canStartTime / (1000 * 60 * 60));
          const minutes = Math.floor((canStartTime % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((canStartTime % (1000 * 60)) / 1000);
          
          setTimeUntilRide(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        }
      };
      
      updateTimer(); // Initial call
      const interval = setInterval(updateTimer, 1000);
      
      return () => clearInterval(interval);
    }
  }, [reservation.date, reservation.status]);

  const handleShowPassenger = (name: string) => {
    alert(`Affichage pancarte pour: ${name}`);
  };

  const handleCheckFlight = (flight: string) => {
    if (!flight) return;
    alert(`Vérification du vol: ${flight}`);
  };

  const handleNavigationChoice = (app: string, address: string) => {
    alert(`Navigation vers ${address} avec ${app}`);
    setShowNavigationOptions(false);
  };

  const handleStartNavigation = (address: string) => {
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
    // Vérification de la contrainte de 2 heures
    const rideTime = new Date(reservation.date).getTime();
    const now = new Date().getTime();
    const twoHoursInMs = 2 * 60 * 60 * 1000;
    
    return now >= (rideTime - twoHoursInMs);
  };

  return (
    <>
      <Card className="mb-4">
        <CardContent className="pt-6">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 
                className="text-lg font-semibold cursor-pointer hover:text-primary"
                onClick={() => handleShowPassenger(reservation.clientName)}
              >
                {reservation.clientName}
              </h3>
              <div className="text-sm text-gray-500">
                {formattedDate}
              </div>
            </div>
            <Badge>{reservation.dispatcher}</Badge>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-1 text-primary shrink-0" />
              <div className="w-full">
                <div className="text-sm font-medium">Prise en charge:</div>
                <div 
                  className="text-sm w-full overflow-ellipsis cursor-pointer hover:text-primary"
                  onClick={type === 'current' && reservation.status === 'started' ? () => handleStartNavigation(reservation.pickupAddress) : undefined}
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
                  className="text-sm w-full overflow-ellipsis cursor-pointer hover:text-primary"
                  onClick={type === 'current' && (reservation.status === 'arrived' || reservation.status === 'onBoard') ? () => handleStartNavigation(reservation.destination) : undefined}
                >
                  {reservation.destination}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {type !== 'upcoming' && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <a href={`tel:${reservation.phone}`} className="text-sm hover:text-primary">
                  {reservation.phone}
                </a>
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
                  {timeUntilRide && (
                    <div className={`text-center py-2 rounded-md ${canStartNow ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      <Clock className="inline-block mr-1 h-4 w-4" />
                      {canStartNow ? 'Disponible maintenant' : `Attente: ${timeUntilRide}`}
                    </div>
                  )}
                  <Button 
                    variant="default" 
                    className="w-full bg-primary"
                    onClick={() => onStartRide?.(reservation.id)}
                    disabled={!canStartRide()}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    {canStartRide() 
                      ? "Démarrer la course" 
                      : "Disponible 2h avant le départ"}
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
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showNavigationOptions} onOpenChange={setShowNavigationOptions}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Choisir une application de navigation</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Button onClick={() => handleNavigationChoice("Google Maps", reservation.status === 'started' ? reservation.pickupAddress : reservation.destination)} className="flex items-center justify-center">
              <Navigation className="mr-2 h-4 w-4" />
              Google Maps
            </Button>
            <Button onClick={() => handleNavigationChoice("Waze", reservation.status === 'started' ? reservation.pickupAddress : reservation.destination)} className="flex items-center justify-center">
              <Navigation className="mr-2 h-4 w-4" />
              Waze
            </Button>
            <Button onClick={() => handleNavigationChoice("Plans", reservation.status === 'started' ? reservation.pickupAddress : reservation.destination)} className="flex items-center justify-center">
              <Navigation className="mr-2 h-4 w-4" />
              Apple Plans
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
    </>
  );
};

export default ReservationCard;
