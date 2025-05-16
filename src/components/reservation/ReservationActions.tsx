
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ReservationType } from "@/types/reservation";
import { Check, X } from "lucide-react";
import { toast } from "sonner";

interface ReservationActionsProps {
  reservation: ReservationType;
  type: 'upcoming' | 'current' | 'completed';
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  onStartRide?: (id: string) => void;
  onArrived?: (id: string) => void;
  onClientBoarded?: (id: string) => void;
  onComplete?: (id: string, rating: number, comment: string) => void;
}

const ReservationActions = ({ 
  reservation, 
  type, 
  onAccept, 
  onReject, 
  onStartRide, 
  onArrived, 
  onClientBoarded, 
  onComplete 
}: ReservationActionsProps) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  // Check if ride can be started (2 hours before scheduled time)
  const canStartRide = () => {
    const now = new Date();
    const rideTime = new Date(reservation.date);
    const twoHoursBefore = new Date(rideTime);
    twoHoursBefore.setHours(twoHoursBefore.getHours() - 2);
    
    return now >= twoHoursBefore;
  };

  // Gestion de la soumission de l'évaluation
  const handleSubmitRating = () => {
    if (onComplete) {
      onComplete(reservation.id, rating, comment);
    }
  };

  // Handle start ride with time check
  const handleStartRide = () => {
    if (!canStartRide()) {
      toast.error("Vous ne pouvez pas démarrer cette course plus de 2h avant l'heure prévue");
      return;
    }
    
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
      <div className="flex justify-end gap-2 mt-4">
        <Button 
          variant="default" 
          size="sm" 
          onClick={handleStartRide}
          disabled={!canStartRide()}
          className={canStartRide() ? "" : "opacity-50 cursor-not-allowed"}
        >
          Démarrer la course
        </Button>
        {!canStartRide() && (
          <div className="text-xs text-amber-600 italic mt-1">
            La course ne peut être démarrée que 2h avant l'heure prévue
          </div>
        )}
      </div>
    );
  }

  if (type === 'current' && reservation.status === 'started') {
    return (
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="default" size="sm" onClick={() => onArrived && onArrived(reservation.id)}>
          Je suis arrivé
        </Button>
      </div>
    );
  }

  if (type === 'current' && reservation.status === 'arrived') {
    return (
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="default" size="sm" onClick={() => onClientBoarded && onClientBoarded(reservation.id)}>
          Client à bord
        </Button>
      </div>
    );
  }

  if (type === 'current' && reservation.status === 'onBoard') {
    return (
      <div className="flex justify-end gap-2 mt-4">
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
