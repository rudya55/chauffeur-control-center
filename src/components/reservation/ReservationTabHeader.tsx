
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
    <TabsList className="w-full bg-card h-auto p-2">
      <TabsTrigger value="upcoming" className="flex-1 min-h-[3rem] py-2">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
          <FilePlus className="h-4 w-4" />
          <span className="text-xs sm:text-sm">Nouvelles</span>
          {upcomingCount > 0 && (
            <Badge variant="destructive" className="bg-red-600 text-white text-xs">
              {upcomingCount}
            </Badge>
          )}
        </div>
      </TabsTrigger>
      <TabsTrigger value="current" className="flex-1 min-h-[3rem] py-2">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
          <FileText className="h-4 w-4" />
          <span className="text-xs sm:text-sm">En cours</span>
          {currentCount > 0 && (
            <Badge variant="destructive" className="bg-red-600 text-white text-xs">
              {currentCount}
            </Badge>
          )}
        </div>
      </TabsTrigger>
      <TabsTrigger value="completed" className="flex-1 min-h-[3rem] py-2">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
          <CheckCircle className="h-4 w-4" />
          <span className="text-xs sm:text-sm">Terminées</span>
          {completedCount && completedCount > 0 && (
            <Badge variant="destructive" className="bg-red-600 text-white text-xs">
              {completedCount}
            </Badge>
          )}
        </div>
      </TabsTrigger>
    </TabsList>
  );
};

export default ReservationTabHeader;
