
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileText, FilePlus, CheckCircle } from "lucide-react";

interface ReservationTabHeaderProps {
  upcomingCount: number;
  currentCount: number;
  completedCount?: number;
}

const ReservationTabHeader = ({ upcomingCount, currentCount, completedCount }: ReservationTabHeaderProps) => {
  return (
    <TabsList className="w-full">
      <TabsTrigger value="upcoming" className="flex-1">
        <div className="flex items-center justify-center gap-2">
          <FilePlus className="h-4 w-4" />
          <span>Nouvelles</span>
          {upcomingCount > 0 && (
            <Badge variant="destructive" className="bg-red-600 text-white">
              {upcomingCount}
            </Badge>
          )}
        </div>
      </TabsTrigger>
      <TabsTrigger value="current" className="flex-1">
        <div className="flex items-center justify-center gap-2">
          <FileText className="h-4 w-4" />
          <span>Mes Réservations</span>
          {currentCount > 0 && (
            <Badge variant="destructive" className="bg-red-600 text-white">
              {currentCount}
            </Badge>
          )}
        </div>
      </TabsTrigger>
      <TabsTrigger value="completed" className="flex-1">
        <div className="flex items-center justify-center gap-2">
          <CheckCircle className="h-4 w-4" />
          <span>Terminées</span>
          {completedCount && completedCount > 0 && (
            <Badge variant="destructive" className="bg-red-600 text-white">
              {completedCount}
            </Badge>
          )}
        </div>
      </TabsTrigger>
    </TabsList>
  );
};

export default ReservationTabHeader;
