
import { Button } from "@/components/ui/button";
import { ReservationType } from "@/types/reservation";

interface ReservationDispatcherProps {
  reservation: ReservationType;
  onChatWithDispatcher?: (dispatcher: string) => void;
  onShowOrderForm?: (reservation: ReservationType) => void;
  showAsHeader?: boolean;
}

const ReservationDispatcher = ({ 
  reservation, 
  onChatWithDispatcher, 
  onShowOrderForm,
  showAsHeader = false 
}: ReservationDispatcherProps) => {
  if (showAsHeader) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center bg-slate-50 rounded-md px-3 py-1">
          <span className="text-xl mr-2">{reservation.dispatcherLogo}</span>
          <span className="font-medium text-sm">{reservation.dispatcher}</span>
        </div>
        {/* Removed the button from here as it's now in the Reservations page */}
      </div>
    );
  }

  // The bottom section is no longer needed as we moved everything to the header
  return null;
};

export default ReservationDispatcher;
