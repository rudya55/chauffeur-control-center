
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock3, Navigation } from "lucide-react";

type ReservationStatusProps = {
  status?: 'pending' | 'accepted' | 'started' | 'arrived' | 'onBoard' | 'completed';
};

const ReservationStatus = ({ status }: ReservationStatusProps) => {
  if (status === 'pending') {
    return (
      <Badge variant="secondary" className="bg-primary text-white">
        <Clock3 className="mr-2 h-4 w-4" />
        En attente
      </Badge>
    );
  }
  
  if (status === 'accepted') {
    return (
      <Badge variant="outline">
        <CheckCircle className="mr-2 h-4 w-4" />
        Acceptée
      </Badge>
    );
  }
  
  if (status === 'started') {
    return (
      <Badge variant="outline">
        <Navigation className="mr-2 h-4 w-4" />
        Course démarrée
      </Badge>
    );
  }
  
  if (status === 'arrived') {
    return (
      <Badge variant="outline">
        <CheckCircle className="mr-2 h-4 w-4" />
        Arrivé
      </Badge>
    );
  }
  
  if (status === 'onBoard') {
    return (
      <Badge variant="outline">
        <CheckCircle className="mr-2 h-4 w-4" />
        Client à bord
      </Badge>
    );
  }
  
  if (status === 'completed') {
    return (
      <Badge>
        <CheckCircle className="mr-2 h-4 w-4" />
        Terminée
      </Badge>
    );
  }
  
  return null;
};

export default ReservationStatus;
