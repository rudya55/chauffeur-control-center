
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ReservationType } from "@/types/reservation";
import { Check, X, MessageCircle, Car, Van, Bus, Star } from "lucide-react";
import { toast } from "sonner";
import CircularTimer from "@/components/CircularTimer";

interface ReservationActionsProps {
  reservation: ReservationType;
  type: 'upcoming' | 'current' | 'completed';
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  onStartRide?: (id: string) => void;
  onArrived?: (id: string) => void;
  onClientBoarded?: (id: string) => void;
  onComplete?: (id: string, rating: number, comment: string) => void;
  testTimerDate?: Date;
  canStartRide?: () => boolean;
  onChatWithDispatcher?: (dispatcher: string) => void;
}

const ReservationActions = ({ 
  reservation, 
  type, 
  onAccept, 
  onReject, 
  onStartRide, 
  onArrived, 
  onClientBoarded, 
  onComplete,
  testTimerDate,
  canStartRide,
  onChatWithDispatcher
}: ReservationActionsProps) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [showTimer, setShowTimer] = useState(true);

  // Timer notification when completed
  const handleTimerComplete = () => {
    toast.info("Le temps d'attente est terminé");
  };

  if (type === 'upcoming' && reservation.status === 'pending') {
    return (
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center">
          {renderVehicleIcon(reservation.vehicleType)}
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="border-primary text-primary hover:bg-primary hover:text-white"
            onClick={() => onAccept && onAccept(reservation.id)}
          >
            <Check className="mr-2 h-4 w-4" />
            Accepter
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="border-destructive text-destructive hover:bg-destructive hover:text-white"
            onClick={() => onReject && onReject(reservation.id)}
          >
            <X className="mr-2 h-4 w-4" />
            Refuser
          </Button>
        </div>
      </div>
    );
  }

  if (type === 'current' && reservation.status === 'accepted') {
    return (
      <div className="flex justify-between items-center gap-2 mt-4">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onChatWithDispatcher && onChatWithDispatcher(reservation.dispatcher)}
            className="p-2"
          >
            <MessageCircle className="h-4 w-4" />
          </Button>
          {renderVehicleIcon(reservation.vehicleType)}
        </div>
        
        <div className="flex items-center gap-2">
          {showTimer && testTimerDate && (
            <CircularTimer 
              targetTime={testTimerDate} 
              durationInSeconds={10}
              onTimeReached={handleTimerComplete}
            />
          )}
          <Button 
            variant="default" 
            size="sm" 
            onClick={() => onStartRide && onStartRide(reservation.id)}
          >
            Démarrer
          </Button>
        </div>
      </div>
    );
  }

  if (type === 'current' && reservation.status === 'started') {
    return (
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onChatWithDispatcher && onChatWithDispatcher(reservation.dispatcher)}
            className="p-2"
          >
            <MessageCircle className="h-4 w-4" />
          </Button>
          {renderVehicleIcon(reservation.vehicleType)}
        </div>
        
        <Button 
          variant="default" 
          size="sm" 
          onClick={() => onArrived && onArrived(reservation.id)}
        >
          Je suis arrivé
        </Button>
      </div>
    );
  }

  if (type === 'current' && reservation.status === 'arrived') {
    return (
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onChatWithDispatcher && onChatWithDispatcher(reservation.dispatcher)}
            className="p-2"
          >
            <MessageCircle className="h-4 w-4" />
          </Button>
          {renderVehicleIcon(reservation.vehicleType)}
        </div>
        
        <Button 
          variant="default" 
          size="sm" 
          onClick={() => onClientBoarded && onClientBoarded(reservation.id)}
        >
          Client à bord
        </Button>
      </div>
    );
  }

  if (type === 'current' && reservation.status === 'onBoard') {
    return (
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onChatWithDispatcher && onChatWithDispatcher(reservation.dispatcher)}
            className="p-2"
          >
            <MessageCircle className="h-4 w-4" />
          </Button>
          {renderVehicleIcon(reservation.vehicleType)}
        </div>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="default" size="sm">
              Terminer la course
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Évaluer la course</AlertDialogTitle>
              <AlertDialogDescription>
                Comment s'est déroulée cette course ?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex flex-col space-y-4 py-2">
              <div className="flex justify-center">
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="text-2xl focus:outline-none"
                    >
                      <span className={`${rating >= star ? 'text-yellow-500' : 'text-gray-300'}`}>
                        ★
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="comment" className="block text-sm font-medium mb-1">Commentaire :</label>
                <textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="border rounded w-full px-3 py-2 min-h-[80px]"
                  placeholder="Votre commentaire (optionnel)"
                />
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={() => onComplete && onComplete(reservation.id, rating, comment)}>
                Soumettre
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  return null;
};

// Helper function to render the appropriate vehicle icon based on vehicle type
const renderVehicleIcon = (vehicleType?: string) => {
  switch (vehicleType) {
    case 'berline':
      return <Car className="h-4 w-4 text-primary" />;
    case 'van':
      return <Van className="h-4 w-4 text-primary" />;
    case 'mini-bus':
      return <Bus className="h-4 w-4 text-primary" />;
    case 'first-class':
      return <Star className="h-4 w-4 text-primary" />;
    case 'standard':
    default:
      return <Car className="h-4 w-4 text-primary" />;
  }
};

export default ReservationActions;
