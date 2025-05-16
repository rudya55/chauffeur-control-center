
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface ReservationTabHeaderProps {
  upcomingCount: number;
  currentCount: number;
}

const ReservationTabHeader = ({ upcomingCount, currentCount }: ReservationTabHeaderProps) => {
  return (
    <TabsList className="w-full">
      <TabsTrigger value="upcoming" className="flex-1">
        À venir
        {upcomingCount > 0 && (
          <Badge variant="destructive" className="ml-2 bg-red-600 text-white">
            {upcomingCount}
          </Badge>
        )}
      </TabsTrigger>
      <TabsTrigger value="current" className="flex-1">
        Mes Réservations
        {currentCount > 0 && (
          <Badge variant="destructive" className="ml-2 bg-red-600 text-white">
            {currentCount}
          </Badge>
        )}
      </TabsTrigger>
      <TabsTrigger value="completed" className="flex-1">
        Terminées
      </TabsTrigger>
    </TabsList>
  );
};

export default ReservationTabHeader;
