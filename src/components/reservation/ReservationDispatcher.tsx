
import { Button } from "@/components/ui/button";
import { ReservationType } from "@/types/reservation";
import { FileText } from "lucide-react";

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
        {onShowOrderForm && (
          <Button 
            variant="destructive"
            size="xs"
            className="flex items-center gap-1"
            onClick={() => onShowOrderForm(reservation)}
          >
            <FileText className="w-3 h-3" />
            Bon Commande
          </Button>
        )}
      </div>
    );
  }

  // The bottom section is no longer needed as we moved everything to the header
  return null;
};

export default ReservationDispatcher;
