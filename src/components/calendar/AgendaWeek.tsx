import React from "react";
import { eachDayOfInterval, endOfWeek, format, isValid, parseISO, startOfWeek } from "date-fns";
import { fr } from "date-fns/locale";
import { ReservationType } from "@/types/reservation";

const HOUR_HEIGHT = 48; // px per hour

type AgendaWeekProps = {
  selectedDate: Date;
  reservations: ReservationType[];
  onSelect: (reservation: ReservationType) => void;
};

const AgendaWeek: React.FC<AgendaWeekProps> = ({ selectedDate, reservations, onSelect }) => {
  const weekStart = startOfWeek(selectedDate, { locale: fr });
  const weekEnd = endOfWeek(selectedDate, { locale: fr });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const getTop = (d: Date) => {
    const h = d.getHours();
    const m = d.getMinutes();
    return (h + m / 60) * HOUR_HEIGHT;
  };

  const getEventClasses = (status?: string) => {
    switch (status) {
      case "started":
        return "bg-accent/40 border-accent";
      case "arrived":
        return "bg-secondary/30 border-secondary";
      case "onBoard":
        return "bg-primary/20 border-primary";
      case "accepted":
        return "bg-ring/10 border-ring";
      case "completed":
        return "bg-foreground/10 border-foreground/30";
      default:
        return "bg-muted/50 border-muted";
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="flex">
        {/* Time gutter */}
        <div className="w-14 border-r bg-card/70">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="h-12 flex items-start justify-end pr-2 text-xs text-muted-foreground">
              <span className="translate-y-[-6px]">{String(i).padStart(2, "0")}h</span>
            </div>
          ))}
        </div>

        {/* Columns for each day */}
        <div className="flex-1 grid grid-cols-7">
          {days.map((day) => {
            const dayKey = format(day, "yyyy-MM-dd");
            const dayReservations = reservations.filter((r) => {
              const d = parseISO(r.date);
              return isValid(d) && format(d, "yyyy-MM-dd") === dayKey;
            });

            return (
              <div key={dayKey} className="relative border-l" style={{ height: `${24 * HOUR_HEIGHT}px` }}>
                {/* Header */}
                <div className="sticky top-0 z-10 bg-card/80 backdrop-blur px-2 py-1 border-b">
                  <div className="text-xs font-medium">{format(day, "EEE d", { locale: fr })}</div>
                </div>

                {/* Hour lines */}
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} className="absolute left-0 right-0 border-t" style={{ top: `${i * HOUR_HEIGHT}px` }} />
                ))}

                {/* Events */}
                {dayReservations.map((res) => {
                  const d = parseISO(res.date);
                  const top = getTop(d);
                  return (
                    <button
                      key={res.id}
                      onClick={() => onSelect(res)}
                      className={`absolute left-1 right-1 border rounded-md p-1.5 text-left shadow-sm hover:shadow-md transition ${getEventClasses(
                        res.status
                      )}`}
                      style={{ top, height: 44 }}
                      aria-label={`${res.clientName} ${format(d, "HH:mm")}`}
                    >
                      <div className="text-[11px] font-medium truncate">{format(d, "HH:mm")} • {res.clientName}</div>
                      <div className="text-[10px] text-muted-foreground truncate">{res.pickupAddress} → {res.destination}</div>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AgendaWeek;
