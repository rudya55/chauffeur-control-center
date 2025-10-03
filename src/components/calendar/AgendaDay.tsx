import React, { useEffect, useMemo, useRef } from "react";
import { parseISO, isValid, format } from "date-fns";
import { ReservationType } from "@/types/reservation";

type AgendaDayProps = {
  date: Date;
  reservations: ReservationType[];
  onSelect: (reservation: ReservationType) => void;
};

const HOUR_HEIGHT = 48; // px per hour

const getEventClassesDay = (status?: string) => {
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


const AgendaDay: React.FC<AgendaDayProps> = ({ date, reservations, onSelect }) => {
  const dayString = format(date, "yyyy-MM-dd");
  const dayReservations = reservations.filter((r) => {
    const d = parseISO(r.date);
    return isValid(d) && format(d, "yyyy-MM-dd") === dayString;
  });

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
    <div className="w-full border rounded-lg overflow-hidden bg-card">
      <div className="flex">
        {/* Time gutter */}
        <div className="w-14 border-r bg-card/70">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="h-12 flex items-start justify-end pr-2 text-xs text-muted-foreground">
              <span className="translate-y-[-6px]">{String(i).padStart(2, "0")}h</span>
            </div>
          ))}
        </div>

        {/* Scrollable Grid */}
        <ScrollableDayGrid
          reservations={dayReservations}
          getTop={getTop}
          onSelect={onSelect}
          showNow
        />
      </div>
    </div>
  );
};

// Internal component with its own scroll/now logic
const ScrollableDayGrid: React.FC<{
  reservations: ReservationType[];
  getTop: (d: Date) => number;
  onSelect: (reservation: ReservationType) => void;
  showNow?: boolean;
}> = ({ reservations, getTop, onSelect, showNow = true }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentHeight = 24 * HOUR_HEIGHT;

  useEffect(() => {
    if (!scrollRef.current) return;
    // Auto-scroll near current time
    const now = new Date();
    const top = getTop(now) - 120;
    scrollRef.current.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  }, []);

  const nowTop = useMemo(() => getTop(new Date()), [getTop]);

  return (
    <div ref={scrollRef} className="relative flex-1 overflow-auto max-h-[70vh]">
      <div className="relative" style={{ height: `${contentHeight}px` }}>
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className="absolute left-0 right-0 border-t" style={{ top: `${i * HOUR_HEIGHT}px` }} />
        ))}

        {showNow && (
          <div
            className="absolute left-0 right-0 h-[2px] bg-destructive"
            style={{ top: `${nowTop}px` }}
            aria-hidden
          />
        )}

        {/* Events */}
        {reservations.map((res) => {
          const d = parseISO(res.date);
          const top = getTop(d);
          return (
            <button
              key={res.id}
              onClick={() => onSelect(res)}
              className={`absolute left-2 right-2 border rounded-md p-2 text-left shadow-sm hover:shadow-md transition ${getEventClassesDay(
                res.status
              )}`}
              style={{ top, height: 44 }}
              aria-label={`${res.clientName} ${format(d, "HH:mm")}`}
            >
              <div className="text-xs font-medium">{format(d, "HH:mm")} • {res.clientName}</div>
              <div className="text-[11px] text-muted-foreground truncate">{res.pickupAddress} → {res.destination}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AgendaDay;

