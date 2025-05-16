
import { Card, CardContent } from "@/components/ui/card";
import { ReservationType } from "@/types/reservation";
import ReservationStatus from "@/components/reservation/ReservationStatus";
import ReservationDetails from "@/components/reservation/ReservationDetails";
import ReservationActions from "@/components/reservation/ReservationActions";
import ReservationDispatcher from "@/components/reservation/ReservationDispatcher";
import ReservationRating from "@/components/reservation/ReservationRating";
import { format } from "date-fns";

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

  // Format timestamps for completed reservations
  const formatTimestamp = (timestamp: string | undefined) => {
    if (!timestamp) return "--";
    return format(new Date(timestamp), 'HH:mm');
  };

  // Create a date 10 seconds in the future for the test timer
  const testTimerDate = new Date();
  testTimerDate.setSeconds(testTimerDate.getSeconds() + 10);

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        {/* Header with dispatcher info and date/status */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-gray-500">{formattedDate}</p>
            {type === 'completed' && reservation.actualPickupTime && reservation.dropoffTime && (
              <div className="text-xs text-gray-500 mt-1">
                <span>Départ: {formatTimestamp(reservation.actualPickupTime)}</span>
                <span className="mx-2">•</span>
                <span>Arrivée: {formatTimestamp(reservation.dropoffTime)}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {type === 'current' && (
              <ReservationDispatcher 
                reservation={reservation}
                showAsHeader={true}
                onShowOrderForm={onShowOrderForm}
              />
            )}
            <ReservationStatus status={reservation.status} />
          </div>
        </div>

        {/* Détails de la réservation */}
        <ReservationDetails 
          pickupAddress={reservation.pickupAddress}
          destination={reservation.destination}
          flightNumber={reservation.flightNumber}
          clientName={type === 'upcoming' || type === 'completed' ? undefined : reservation.clientName}
          amount={reservation.amount}
          driverAmount={reservation.driverAmount}
          commission={reservation.commission}
          paymentType={reservation.paymentType}
          flightStatus={reservation.flightStatus}
          placardText={reservation.clientName}
          pickupGPS={reservation.pickupGPS}
          destinationGPS={reservation.destinationGPS}
          dispatcherLogo={reservation.dispatcherLogo}
          passengers={reservation.passengers}
          luggage={reservation.luggage}
          status={reservation.status}
          vehicleType={reservation.vehicleType}
          showAddressLabels={true}
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
            testTimerDate={testTimerDate}
            onChatWithDispatcher={onChatWithDispatcher}
          />
          
          {type === 'completed' && (
            <ReservationRating 
              rating={reservation.rating} 
              comment={reservation.comment}
              distance={reservation.distance}
              duration={reservation.duration}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReservationCard;
