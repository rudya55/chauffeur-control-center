
import { ReservationType } from "@/types/reservation";
import ReservationCard from "@/components/ReservationCard";

interface ReservationListProps {
  reservations: ReservationType[];
  type: 'upcoming' | 'current' | 'completed';
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  onStartRide?: (id: string) => void;
  onArrived?: (id: string) => void;
  onClientBoarded?: (id: string) => void;
  onComplete?: (id: string, rating: number, comment: string) => void;
  onChatWithDispatcher?: (dispatcher: string) => void;
  onShowOrderForm?: (reservation: ReservationType) => void;
  emptyMessage: string;
}

const ReservationList = ({ 
  reservations, 
  type, 
  onAccept, 
  onReject, 
  onStartRide, 
  onArrived, 
  onClientBoarded, 
  onComplete, 
  onChatWithDispatcher, 
  onShowOrderForm,
  emptyMessage 
}: ReservationListProps) => {
  if (reservations.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <>
      {reservations.map(reservation => (
        <ReservationCard 
          key={reservation.id} 
          reservation={reservation} 
          type={type}
          onAccept={onAccept}
          onReject={onReject}
          onStartRide={onStartRide}
          onArrived={onArrived}
          onClientBoarded={onClientBoarded}
          onComplete={onComplete}
          onChatWithDispatcher={onChatWithDispatcher}
          onShowOrderForm={onShowOrderForm}
        />
      ))}
    </>
  );
};

export default ReservationList;
