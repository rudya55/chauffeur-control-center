import React from "react";
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isValid, parseISO, startOfWeek, endOfWeek } from "date-fns";
import { fr } from "date-fns/locale";
import { ReservationType } from "@/types/reservation";

type AgendaMonthProps = {
  selectedDate: Date;
  reservations: ReservationType[];
  onSelect: (reservation: ReservationType) => void;
};

const AgendaMonth: React.FC<AgendaMonthProps> = ({ selectedDate, reservations, onSelect }) => {
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const calendarStart = startOfWeek(monthStart, { locale: fr });
  const calendarEnd = endOfWeek(monthEnd, { locale: fr });
  const allDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const weeks: Date[][] = [];
  for (let i = 0; i < allDays.length; i += 7) {
    weeks.push(allDays.slice(i, i + 7));
  }

  const getDayReservations = (day: Date) => {
    const dayKey = format(day, "yyyy-MM-dd");
    return reservations.filter((r) => {
      const d = parseISO(r.date);
      return isValid(d) && format(d, "yyyy-MM-dd") === dayKey;
    });
  };

  const getEventClasses = (status?: string) => {
    switch (status) {
      case "started":
        return "bg-accent/60 text-accent-foreground";
      case "arrived":
        return "bg-secondary/50 text-secondary-foreground";
      case "onBoard":
        return "bg-primary/40 text-primary-foreground";
      case "accepted":
        return "bg-ring/30 text-foreground";
      case "completed":
        return "bg-foreground/20 text-foreground";
      default:
        return "bg-muted/60 text-muted-foreground";
    }
  };

  const todayKey = format(new Date(), "yyyy-MM-dd");

  return (
    <div className="border rounded-lg overflow-hidden bg-card">
      {/* Day headers */}
      <div className="grid grid-cols-7 border-b bg-card/80">
        {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day, i) => (
          <div key={i} className="px-2 py-2 text-center text-sm font-semibold text-foreground border-r last:border-r-0">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-rows-auto">
        {weeks.map((week, wIdx) => (
          <div key={wIdx} className="grid grid-cols-7 border-b last:border-b-0">
            {week.map((day) => {
              const dayKey = format(day, "yyyy-MM-dd");
              const dayReservations = getDayReservations(day);
              const isToday = dayKey === todayKey;
              const isCurrentMonth = format(day, "MM") === format(selectedDate, "MM");

              return (
                <div
                  key={dayKey}
                  className={`relative border-r last:border-r-0 p-1 min-h-[100px] ${
                    !isCurrentMonth ? "bg-muted/20" : ""
                  }`}
                >
                  {/* Day number */}
                  <div className={`text-xs font-semibold mb-1 ${isToday ? "bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center" : ""}`}>
                    {format(day, "d")}
                  </div>

                  {/* Events */}
                  <div className="space-y-0.5">
                    {dayReservations.slice(0, 3).map((res) => {
                      const d = parseISO(res.date);
                      return (
                        <button
                          key={res.id}
                          onClick={() => onSelect(res)}
                          className={`w-full text-left px-1 py-0.5 rounded text-[10px] truncate ${getEventClasses(res.status)}`}
                        >
                          {format(d, "HH:mm")} {res.clientName}
                        </button>
                      );
                    })}
                    {dayReservations.length > 3 && (
                      <div className="text-[9px] text-muted-foreground pl-1">
                        +{dayReservations.length - 3} autre{dayReservations.length - 3 > 1 ? "s" : ""}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgendaMonth;
