
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock3, Navigation, PhoneCall, MessageCircle, AlertCircle, Star, FileText } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

// Type de réservation
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
  onShowOrderForm?: (reservation: ReservationType) => void;
}

const ReservationCard: React.FC<ReservationCardProps> = ({ reservation, type, onAccept, onReject, onStartRide, onArrived, onClientBoarded, onComplete, onChatWithDispatcher, onShowOrderForm }) => {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  // Formater la date et l'heure
  const formattedDate = new Date(reservation.date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Gestion de la soumission de l'évaluation
  const handleSubmitRating = () => {
    if (onComplete) {
      onComplete(reservation.id, rating, comment);
      setOpen(false);
    }
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        {/* En-tête avec le nom du client et le statut */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">{reservation.clientName}</h2>
            <p className="text-sm text-gray-500">{formattedDate}</p>
          </div>
          {reservation.status === 'pending' && (
            <Badge variant="secondary">
              <Clock3 className="mr-2 h-4 w-4" />
              En attente
            </Badge>
          )}
          {reservation.status === 'accepted' && (
            <Badge variant="outline">
              <CheckCircle className="mr-2 h-4 w-4" />
              Acceptée
            </Badge>
          )}
           {reservation.status === 'started' && (
            <Badge variant="outline">
              <Navigation className="mr-2 h-4 w-4" />
              Course démarrée
            </Badge>
          )}
          {reservation.status === 'arrived' && (
            <Badge variant="outline">
              <CheckCircle className="mr-2 h-4 w-4" />
              Arrivé
            </Badge>
          )}
          {reservation.status === 'onBoard' && (
            <Badge variant="outline">
              <CheckCircle className="mr-2 h-4 w-4" />
              Client à bord
            </Badge>
          )}
          {reservation.status === 'completed' && (
            <Badge>
              <CheckCircle className="mr-2 h-4 w-4" />
              Terminée
            </Badge>
          )}
        </div>

        {/* Détails de la réservation */}
        <div className="space-y-2">
          <div className="flex items-center">
            <Navigation className="mr-2 h-4 w-4 text-gray-500" />
            <span className="text-sm">
              {reservation.pickupAddress} <span className="font-bold">→</span> {reservation.destination}
            </span>
          </div>
          <div className="flex items-center">
            <PhoneCall className="mr-2 h-4 w-4 text-gray-500" />
            <a href={`tel:${reservation.phone}`} className="text-sm underline">
              {reservation.phone}
            </a>
          </div>
          {reservation.flightNumber && (
            <div className="flex items-center">
              <FileText className="mr-2 h-4 w-4 text-gray-500" />
              <span className="text-sm">Vol {reservation.flightNumber}</span>
            </div>
          )}
        </div>

        {/* Actions spécifiques selon le type de réservation */}
        <div className="mt-4">
          {type === 'upcoming' && reservation.status === 'pending' && (
            <div className="flex justify-between">
              <Button variant="secondary" size="sm" onClick={() => onAccept && onAccept(reservation.id)}>
                Accepter
              </Button>
              <Button variant="destructive" size="sm" onClick={() => onReject && onReject(reservation.id)}>
                Refuser
              </Button>
            </div>
          )}

          {type === 'current' && reservation.status === 'accepted' && (
            <div className="flex justify-end gap-2">
              <Button variant="secondary" size="sm" onClick={() => onStartRide && onStartRide(reservation.id)}>
                Démarrer la course
              </Button>
            </div>
          )}

          {type === 'current' && reservation.status === 'started' && (
            <div className="flex justify-end gap-2">
              <Button variant="secondary" size="sm" onClick={() => onArrived && onArrived(reservation.id)}>
                Je suis arrivé
              </Button>
            </div>
          )}

          {type === 'current' && reservation.status === 'arrived' && (
            <div className="flex justify-end gap-2">
              <Button variant="secondary" size="sm" onClick={() => onClientBoarded && onClientBoarded(reservation.id)}>
                Client à bord
              </Button>
            </div>
          )}

          {type === 'current' && reservation.status === 'onBoard' && (
            <div className="flex justify-end gap-2">
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
          )}

          {type === 'completed' && reservation.rating && (
            <div className="flex items-center mt-2">
              <Star className="mr-1 h-4 w-4 text-yellow-500" />
              <span>{reservation.rating} étoiles</span>
            </div>
          )}

          {type === 'completed' && reservation.comment && (
            <div className="mt-2">
              <p className="text-sm italic">{reservation.comment}</p>
            </div>
          )}
        </div>

        {/* Infos du dispatcher et Bon de commande */}
        {type === 'current' && (
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium">De: {reservation.dispatcherLogo} {reservation.dispatcher}</span>
            </div>
            <Button 
              variant="subtle" 
              size="xs" 
              onClick={() => onShowOrderForm && onShowOrderForm(reservation)}
              className="text-xs font-normal"
            >
              Bon de commande
            </Button>
          </div>
        )}

        {/* Bouton de contact avec le dispatcher */}
        {type === 'current' && (
          <Button variant="ghost" size="sm" onClick={() => onChatWithDispatcher && onChatWithDispatcher(reservation.dispatcher)}>
            <MessageCircle className="mr-2 h-4 w-4" />
            Contacter {reservation.dispatcher}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ReservationCard;
