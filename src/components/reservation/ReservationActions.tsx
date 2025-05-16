
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

  // Handle start ride after timer ends
  const handleStartRide = () => {
    if (onStartRide) {
      toast.success("Course démarrée");
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
      <div className="flex justify-between items-center gap-2 mt-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onChatWithDispatcher && onChatWithDispatcher(reservation.dispatcher)}
          className="p-2"
        >
          <MessageCircle className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="default" 
            size="sm" 
            onClick={handleStartRide}
          >
            Démarrer
          </Button>
          
          {testTimerDate && (
            <CircularTimer 
              targetTime={testTimerDate} 
              durationInSeconds={10}
              onTimeReached={handleStartRide}
              autoStart={true}
            />
          )}
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

export default ReservationActions;
