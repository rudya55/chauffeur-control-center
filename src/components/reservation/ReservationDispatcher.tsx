
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { ReservationType } from "@/types/reservation";

interface ReservationDispatcherProps {
  reservation: ReservationType;
  onChatWithDispatcher?: (dispatcher: string) => void;
  onShowOrderForm?: (reservation: ReservationType) => void;
}

const ReservationDispatcher = ({ 
  reservation, 
  onChatWithDispatcher, 
  onShowOrderForm 
}: ReservationDispatcherProps) => {
  return (
    <>
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm">
          <span className="font-medium">De: {reservation.dispatcherLogo} {reservation.dispatcher}</span>
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
        className="mt-2"
      >
        <MessageCircle className="mr-2 h-4 w-4" />
        Contacter {reservation.dispatcher}
      </Button>
    </>
  );
};

export default ReservationDispatcher;
