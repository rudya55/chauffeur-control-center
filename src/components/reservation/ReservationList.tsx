
import { ReservationType } from "@/types/reservation";
import ReservationCard from "@/components/ReservationCard";
import { useMobile } from "@/hooks/use-mobile";

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
  onReservationClick?: (reservation: ReservationType) => void;
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
  onReservationClick,
  emptyMessage 
}: ReservationListProps) => {
  const isMobile = useMobile();

  const handleCardClick = (reservation: ReservationType) => {
    if (isMobile && onReservationClick) {
      onReservationClick(reservation);
    }
  };

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
        <div 
          key={reservation.id}
          onClick={() => handleCardClick(reservation)} 
          className={isMobile ? "cursor-pointer" : ""}
        >
          <ReservationCard 
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
        </div>
      ))}
    </>
  );
};

export default ReservationList;
