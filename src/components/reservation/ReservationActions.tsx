
import { useState, useEffect } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ReservationType } from "@/types/reservation";
import CircularTimer from "@/components/CircularTimer";
import { Car, CheckCircle, MessageCircle, PlayCircle, Star, User, X, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { parseISO, differenceInSeconds, addHours } from "date-fns";

type ReservationActionsProps = {
  reservation: ReservationType;
  type: 'upcoming' | 'current' | 'completed';
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  onStartRide?: (id: string) => void;
  onArrived?: (id: string) => void;
  onClientBoarded?: (id: string) => void;
  onComplete?: (id: string, rating: number, comment: string) => void;
  onChatWithDispatcher?: (dispatcher: string) => void;
  testTimerDate?: Date;
  fullscreenMode?: boolean;
};

const ReservationActions = ({
  reservation,
  type,
  onAccept,
  onReject,
  onStartRide,
  onArrived,
  onClientBoarded,
  onComplete,
  onChatWithDispatcher,
  testTimerDate,
  fullscreenMode = false
}: ReservationActionsProps) => {
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [canStartRide, setCanStartRide] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>("");

  // Testing mode: 10 seconds before ride, Production: 2 hours before ride
  const TESTING_MODE = true;
  const ALLOWED_TIME_BEFORE_START = TESTING_MODE ? 10 : 7200; // 10 seconds or 2 hours in seconds

  useEffect(() => {
    if (type === 'current' && reservation.status === 'accepted') {
      const checkTimer = () => {
        const now = new Date();
        const rideStartTime = parseISO(reservation.date);
        const allowedStartTime = new Date(rideStartTime.getTime() - ALLOWED_TIME_BEFORE_START * 1000);
        const secondsUntilAllowed = differenceInSeconds(allowedStartTime, now);

        if (secondsUntilAllowed <= 0) {
          setCanStartRide(true);
          setTimeRemaining("");
        } else {
          setCanStartRide(false);
          const hours = Math.floor(secondsUntilAllowed / 3600);
          const minutes = Math.floor((secondsUntilAllowed % 3600) / 60);
          const seconds = secondsUntilAllowed % 60;
          
          if (TESTING_MODE) {
            setTimeRemaining(`${seconds}s`);
          } else {
            setTimeRemaining(`${hours}h ${minutes}m`);
          }
        }
      };

      checkTimer();
      const interval = setInterval(checkTimer, 1000);

      return () => clearInterval(interval);
    }
  }, [type, reservation.status, reservation.date, ALLOWED_TIME_BEFORE_START, TESTING_MODE]);

  const handleRatingClick = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const handleSubmit = () => {
    if (rating) {
      onComplete?.(reservation.id, rating, comment);
      setOpen(false);
    }
  };

  // Increase button sizes in fullscreen mode
  const getButtonClass = (defaultClass: string) => {
    return cn(
      defaultClass,
      fullscreenMode ? "text-base py-3" : ""
    );
  };

  if (type === 'upcoming') {
    return (
      <div className={cn("flex justify-end gap-2", fullscreenMode && "flex-col mt-6")}>
        {onAccept && (
          <Button 
            className={getButtonClass("w-1/2")}
            onClick={() => onAccept(reservation.id)}
            style={{ backgroundColor: "#22c55e" }} // Green color for Accept button
          >
            <CheckCircle className="mr-1 h-4 w-4" /> Accepter
          </Button>
        )}
        {onReject && (
          <Button 
            variant="destructive"
            onClick={() => onReject(reservation.id)}
            className={getButtonClass("w-1/2")}
          >
            <X className="mr-1 h-4 w-4" /> Refuser
          </Button>
        )}
      </div>
    );
  }

  if (type === 'current') {
    const showStartButton = reservation.status === 'accepted';
    const showArrivedButton = reservation.status === 'started';
    const showOnBoardButton = reservation.status === 'arrived';
    const showCompleteButton = reservation.status === 'onBoard';

    return (
      <div className={cn("space-y-3", fullscreenMode && "mt-6")}>
        <div className={cn("flex gap-2", fullscreenMode && "flex-col")}>
          {onChatWithDispatcher && reservation.dispatcher && (
            <Button 
              variant="outline" 
              onClick={() => onChatWithDispatcher(reservation.dispatcher)}
              className={getButtonClass(fullscreenMode ? "w-full" : "")}
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Contacter le dispatcher
            </Button>
          )}
        </div>

        <div className={cn("flex gap-2", fullscreenMode && "flex-col")}>
          {showStartButton && onStartRide && (
            <div className={cn("flex flex-col gap-2", fullscreenMode && "w-full")}>
              <Button 
                onClick={() => onStartRide(reservation.id)}
                variant="default"
                className={getButtonClass(fullscreenMode ? "w-full" : "")}
                disabled={!canStartRide}
              >
                <PlayCircle className="mr-2 h-4 w-4" />
                Démarrer la course
              </Button>
              {!canStartRide && timeRemaining && (
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Disponible dans: {timeRemaining}</span>
                </div>
              )}
            </div>
          )}

          {showArrivedButton && onArrived && (
            <Button 
              onClick={() => onArrived(reservation.id)}
              variant="default"
              className={getButtonClass(fullscreenMode ? "w-full" : "")}
            >
              <Car className="mr-2 h-4 w-4" />
              Arrivé au point de RDV
            </Button>
          )}

          {showOnBoardButton && onClientBoarded && (
            <Button 
              onClick={() => onClientBoarded(reservation.id)}
              variant="default"
              className={getButtonClass(fullscreenMode ? "w-full" : "")}
            >
              <User className="mr-2 h-4 w-4" />
              Client à bord
            </Button>
          )}

          {showCompleteButton && onComplete && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="default" className={getButtonClass(fullscreenMode ? "w-full" : "")}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Terminer la course
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Terminer la course ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Êtes-vous sûr de vouloir terminer cette course ? Veuillez donner une évaluation et un commentaire.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="py-4">
                  <div className="flex items-center justify-center space-x-2">
                    {[1, 2, 3, 4, 5].map((index) => (
                      <Star
                        key={index}
                        className={cn(
                          "h-6 w-6 cursor-pointer",
                          index <= (rating || 0) ? "text-yellow-500" : "text-gray-300"
                        )}
                        onClick={() => handleRatingClick(index)}
                      />
                    ))}
                  </div>
                  <textarea
                    className="w-full mt-4 p-2 border rounded"
                    placeholder="Ajouter un commentaire..."
                    value={comment}
                    onChange={handleCommentChange}
                  />
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction onClick={handleSubmit}>Confirmer</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          {showStartButton && testTimerDate && (
            <div className="flex justify-end items-center">
              <span className="text-xs text-muted-foreground mr-2">Auto-accept dans:</span>
              <CircularTimer 
                targetTime={testTimerDate}
                size={22}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default ReservationActions;
