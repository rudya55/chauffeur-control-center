
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
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
      <div className="flex items-center justify-end mb-2">
        <div className="flex items-center bg-slate-50 rounded-md px-3 py-1">
          <span className="text-xl mr-2">{reservation.dispatcherLogo}</span>
          <span className="font-medium text-sm">{reservation.dispatcher}</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mt-4 p-3 bg-slate-50 rounded-md">
        <div className="flex items-center">
          <span className="text-2xl mr-2">{reservation.dispatcherLogo}</span>
          <span className="font-medium">{reservation.dispatcher}</span>
        </div>
        <Button 
          variant="subtle" 
          size="sm" 
          onClick={() => onShowOrderForm && onShowOrderForm(reservation)}
          className="text-xs"
        >
          Bon de commande
        </Button>
      </div>
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => onChatWithDispatcher && onChatWithDispatcher(reservation.dispatcher)}
        className="mt-2 w-full"
      >
        <MessageCircle className="mr-2 h-4 w-4" />
        Contacter {reservation.dispatcher}
      </Button>
    </>
  );
};

export default ReservationDispatcher;
