
import { useState } from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { DayContentProps } from "react-day-picker";

interface Event {
  id: string;
  title: string;
  client: string;
  pickupAddress: string;
  destination: string;
  date: Date;
  time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
}

const Calendar = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<"day" | "week" | "month">("day");

  // Sample events
  const events: Event[] = [
    {
      id: "1",
      title: "Transfert aéroport",
      client: "Marie Dubois",
      pickupAddress: "Gare de Lyon, Paris",
      destination: "45 Avenue des Champs-Élysées, Paris",
      date: new Date(2025, 4, 16, 10, 15),
      time: "10:15",
      status: "confirmed"
    },
    {
      id: "2",
      title: "Visite touristique",
      client: "Pierre Martin",
      pickupAddress: "Hôtel Ritz, Paris",
      destination: "Tour Eiffel, Paris",
      date: new Date(2025, 4, 17, 14, 30),
      time: "14:30",
      status: "confirmed"
    },
    {
      id: "3",
      title: "Transfer d'affaires",
      client: "Sophie Laurent",
      pickupAddress: "La Défense, Paris",
      destination: "Aéroport Orly, Paris",
      date: new Date(2025, 4, 15, 18, 45),
      time: "18:45",
      status: "completed"
    },
    {
      id: "4",
      title: "Course nocturne",
      client: "Jean Moreau",
      pickupAddress: "Opéra Garnier, Paris",
      destination: "Saint-Germain-des-Prés, Paris",
      date: new Date(2025, 4, 16, 22, 0),
      time: "22:00",
      status: "pending"
    },
  ];

  // Filter events for the selected date
  const getEventsForDay = (day: Date) => {
    return events.filter(event => 
      event.date.getFullYear() === day.getFullYear() && 
      event.date.getMonth() === day.getMonth() && 
      event.date.getDate() === day.getDate()
    );
  };

  const getEventsForWeek = (date: Date) => {
    const curr = new Date(date);
    const first = curr.getDate() - curr.getDay() + (curr.getDay() === 0 ? -6 : 1); // First day of the week (Monday)
    const firstDay = new Date(curr.setDate(first));
    
    const weekEvents: Record<string, Event[]> = {};
    for (let i = 0; i < 7; i++) {
      const day = new Date(firstDay);
      day.setDate(firstDay.getDate() + i);
      weekEvents[format(day, 'yyyy-MM-dd')] = getEventsForDay(day);
    }
    
    return weekEvents;
  };

  const getEventsForMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // Create a date for the 1st of the month
    const firstDay = new Date(year, month, 1);
    // Create a date for the last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    const monthEvents: Record<string, Event[]> = {};
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const day = new Date(year, month, i);
      monthEvents[format(day, 'yyyy-MM-dd')] = getEventsForDay(day);
    }
    
    return monthEvents;
  };

  const getStatusColor = (status: Event['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-l-4 border-green-500';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-l-4 border-blue-500';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-l-4 border-red-500';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderDayView = () => {
    const dayEvents = getEventsForDay(date);
    return (
      <div className="space-y-4">
        <div className="text-xl font-bold">
          {format(date, 'EEEE d MMMM yyyy', { locale: fr })}
        </div>
        {dayEvents.length > 0 ? (
          <div className="space-y-3">
            {dayEvents.map((event) => (
              <Card key={event.id} className={cn("overflow-hidden", getStatusColor(event.status))}>
                <CardHeader className="p-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base">{event.title}</CardTitle>
                    <span className="text-sm font-medium">{event.time}</span>
                  </div>
                </CardHeader>
                <CardContent className="p-3 pt-0 space-y-1">
                  <div className="text-sm">
                    <span className="font-medium">Client:</span> {event.client}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Départ:</span> {event.pickupAddress}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Destination:</span> {event.destination}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500">
            Aucune course prévue pour aujourd'hui
          </div>
        )}
      </div>
    );
  };

  const renderWeekView = () => {
    const weekEvents = getEventsForWeek(date);
    const days = Object.keys(weekEvents).sort();

    return (
      <div className="space-y-6">
        {days.map((dayKey) => {
          const events = weekEvents[dayKey];
          const dayDate = new Date(dayKey);
          
          return (
            <div key={dayKey} className="space-y-3">
              <div className={cn(
                "text-lg font-medium p-2 rounded",
                format(new Date(), 'yyyy-MM-dd') === dayKey ? "bg-primary/10" : ""
              )}>
                {format(dayDate, 'EEEE d MMMM', { locale: fr })}
              </div>
              {events.length > 0 ? (
                <div className="space-y-2 pl-2">
                  {events.map((event) => (
                    <Card key={event.id} className={cn("overflow-hidden", getStatusColor(event.status))}>
                      <CardHeader className="p-3">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-base">{event.title}</CardTitle>
                          <span className="text-sm font-medium">{event.time}</span>
                        </div>
                      </CardHeader>
                      <CardContent className="p-3 pt-0">
                        <div className="text-sm">
                          <span className="font-medium">Client:</span> {event.client}
                        </div>
                        <div className="text-sm line-clamp-1">
                          <span className="font-medium">Départ:</span> {event.pickupAddress}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="py-3 pl-2 text-gray-500">Aucune course</div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderMonthView = () => {
    return (
      <div className="space-y-4">
        <CalendarComponent
          mode="single"
          selected={date}
          onSelect={(newDate) => newDate && setDate(newDate)}
          className="border rounded-lg pointer-events-auto"
          components={{
            DayContent: (props: DayContentProps) => {
              // Fix: access the date through the props.date instead of props.day
              const dayEvents = getEventsForDay(props.date);
              return (
                <div className="flex flex-col items-center justify-center h-full">
                  <span>{format(props.date, 'd')}</span>
                  {dayEvents.length > 0 && (
                    <div className="w-full flex justify-center gap-1 mt-1">
                      {dayEvents.slice(0, 3).map((event, i) => (
                        <div 
                          key={i} 
                          className={cn(
                            "w-2 h-2 rounded-full",
                            event.status === 'confirmed' ? "bg-green-500" :
                            event.status === 'pending' ? "bg-yellow-500" :
                            event.status === 'completed' ? "bg-blue-500" : "bg-red-500"
                          )}
                        />
                      ))}
                      {dayEvents.length > 3 && (
                        <span className="text-xs">+{dayEvents.length - 3}</span>
                      )}
                    </div>
                  )}
                </div>
              );
            }
          }}
        />
        
        <div className="space-y-3">
          <h3 className="font-medium">
            Courses du {format(date, 'd MMMM yyyy', { locale: fr })}
          </h3>
          
          {getEventsForDay(date).length > 0 ? (
            <div className="space-y-2">
              {getEventsForDay(date).map((event) => (
                <Card key={event.id} className={cn("overflow-hidden", getStatusColor(event.status))}>
                  <CardHeader className="p-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base">{event.title}</CardTitle>
                      <span className="text-sm font-medium">{event.time}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <div className="text-sm">
                      <span className="font-medium">Client:</span> {event.client}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Départ:</span> {event.pickupAddress}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="py-4 text-center text-gray-500">
              Aucune course prévue pour ce jour
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Calendrier des courses</h1>
        <Tabs defaultValue="day" value={view} onValueChange={(v) => setView(v as "day" | "week" | "month")}>
          <TabsList>
            <TabsTrigger value="day">Jour</TabsTrigger>
            <TabsTrigger value="week">Semaine</TabsTrigger>
            <TabsTrigger value="month">Mois</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-4">
        {view === "day" && renderDayView()}
        {view === "week" && renderWeekView()}
        {view === "month" && renderMonthView()}
      </div>
    </div>
  );
};

export default Calendar;
