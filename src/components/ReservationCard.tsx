
import { Card, CardContent } from "@/components/ui/card";
import { ReservationType } from "@/types/reservation";
import ReservationStatus from "@/components/reservation/ReservationStatus";
import ReservationDetails from "@/components/reservation/ReservationDetails";
import ReservationActions from "@/components/reservation/ReservationActions";
import ReservationDispatcher from "@/components/reservation/ReservationDispatcher";
import ReservationRating from "@/components/reservation/ReservationRating";
import CircularTimer from "@/components/CircularTimer";

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

const ReservationCard: React.FC<ReservationCardProps> = ({ 
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
}) => {
  // Formater la date et l'heure
  const formattedDate = new Date(reservation.date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Create a date 10 seconds in the future for the test timer
  const testTimerDate = new Date();
  testTimerDate.setSeconds(testTimerDate.getSeconds() + 10);

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        {/* En-tête avec le nom du client et le statut */}
        <div className="flex items-start justify-between mb-4">
          <div>
            {type !== 'upcoming' && <h2 className="text-lg font-semibold">{reservation.clientName}</h2>}
            <p className="text-sm text-gray-500">{formattedDate}</p>
            
            {/* Test timer - for testing purposes */}
            {type === 'upcoming' && (
              <div className="mt-2">
                <CircularTimer 
                  targetTime={testTimerDate} 
                  durationInSeconds={10}
                />
              </div>
            )}
          </div>
          <ReservationStatus status={reservation.status} />
        </div>

        {/* Détails de la réservation */}
        <ReservationDetails 
          pickupAddress={reservation.pickupAddress}
          destination={reservation.destination}
          phone={reservation.phone}
          flightNumber={reservation.flightNumber}
          clientName={reservation.clientName}
          amount={reservation.amount}
          driverAmount={reservation.driverAmount}
          commission={reservation.commission}
          paymentType={reservation.paymentType}
          flightStatus={reservation.flightStatus}
          placardText={reservation.placardText}
          pickupGPS={reservation.pickupGPS}
          destinationGPS={reservation.destinationGPS}
          dispatcherLogo={reservation.dispatcherLogo}
          passengers={reservation.passengers}
          luggage={reservation.luggage}
          status={reservation.status}
        />

        {/* Actions spécifiques selon le type de réservation */}
        <div className="mt-4">
          <ReservationActions 
            reservation={reservation}
            type={type}
            onAccept={onAccept}
            onReject={onReject}
            onStartRide={onStartRide}
            onArrived={onArrived}
            onClientBoarded={onClientBoarded}
            onComplete={onComplete}
          />
          
          {type === 'completed' && (
            <ReservationRating 
              rating={reservation.rating} 
              comment={reservation.comment} 
            />
          )}
        </div>

        {/* Infos du dispatcher et Bon de commande */}
        {type === 'current' && (
          <ReservationDispatcher 
            reservation={reservation}
            onChatWithDispatcher={onChatWithDispatcher}
            onShowOrderForm={onShowOrderForm}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ReservationCard;
