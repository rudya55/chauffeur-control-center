
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ReservationType } from "@/types/reservation";
import { Check, X, MessageCircle } from "lucide-react";
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

  // Gestion de la soumission de l'évaluation
  const handleSubmitRating = () => {
    if (onComplete) {
      onComplete(reservation.id, rating, comment);
    }
  };

  // Handle start ride after timer ends
  const handleStartRide = () => {
    if (onStartRide) {
      onStartRide(reservation.id);
    }
  };

  if (type === 'upcoming' && reservation.status === 'pending') {
    return (
      <div className="flex justify-between mt-4">
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
    );
  }

  if (type === 'current' && reservation.status === 'accepted') {
    return (
      <div className="flex justify-between items-center gap-3 mt-4">
        <div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onChatWithDispatcher && onChatWithDispatcher(reservation.dispatcher)}
            className="p-2"
          >
            <MessageCircle className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          {testTimerDate && (
            <CircularTimer 
              targetTime={testTimerDate} 
              durationInSeconds={10}
              onTimeReached={handleStartRide}
            />
          )}
          <Button 
            variant="default" 
            size="sm" 
            onClick={handleStartRide}
          >
            Démarrer la course
          </Button>
        </div>
      </div>
    );
  }

  if (type === 'current' && reservation.status === 'started') {
    return (
      <div className="flex justify-between items-center mt-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onChatWithDispatcher && onChatWithDispatcher(reservation.dispatcher)}
          className="p-2"
        >
          <MessageCircle className="h-4 w-4" />
        </Button>
        
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
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onChatWithDispatcher && onChatWithDispatcher(reservation.dispatcher)}
          className="p-2"
        >
          <MessageCircle className="h-4 w-4" />
        </Button>
        
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
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onChatWithDispatcher && onChatWithDispatcher(reservation.dispatcher)}
          className="p-2"
        >
          <MessageCircle className="h-4 w-4" />
        </Button>
        
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
                Comment s'est déroulée la course avec {reservation.clientName} ?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex items-center space-x-2">
              <label htmlFor="rating">Note :</label>
              <select
                id="rating"
                value={rating}
                onChange={(e) => setRating(parseInt(e.target.value))}
                className="border rounded px-2 py-1"
              >
                <option value="5">5 Étoiles</option>
                <option value="4">4 Étoiles</option>
                <option value="3">3 Étoiles</option>
                <option value="2">2 Étoiles</option>
                <option value="1">1 Étoile</option>
              </select>
            </div>
            <div className="mt-2">
              <label htmlFor="comment">Commentaire :</label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="border rounded w-full px-2 py-1"
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={handleSubmitRating}>
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

export default ReservationActions;
