
import React, { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [currentView, setCurrentView] = useState<"day" | "week" | "month">("month");
  
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  // Obtenir le premier jour du mois
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const dayOfWeek = firstDayOfMonth.getDay();
  
  // Ajuster pour que la semaine commence le lundi (0 = lundi, 6 = dimanche)
  const startDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  
  // Obtenir le nombre de jours dans le mois
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  
  // Créer un tableau des jours du mois
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  
  // Noms des jours de la semaine
  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  
  // Fonction pour obtenir la vue du jour courant
  const renderDayView = () => {
    const today = new Date();
    
    return (
      <div className="bg-white rounded-lg p-4">
        <h3 className="text-lg font-medium mb-4">{format(today, 'EEEE d MMMM', { locale: fr })}</h3>
        <div className="grid grid-cols-1 gap-2">
          {Array.from({ length: 12 }).map((_, index) => {
            const hour = 8 + index;
            return (
              <div key={`hour-${hour}`} className="border rounded-md p-2 flex">
                <div className="w-16 text-muted-foreground">{`${hour}:00`}</div>
                <div className="flex-1 min-h-[40px] hover:bg-muted/50 transition-colors"></div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  // Fonction pour obtenir la vue de la semaine courante
  const renderWeekView = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Ajustement pour commencer par lundi
    
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - diff);
    
    const weekDates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      return date;
    });
    
    return (
      <div className="bg-white rounded-lg p-4">
        <div className="grid grid-cols-7 gap-1">
          {weekDates.map((date, index) => (
            <div key={`weekday-${index}`} className="text-center">
              <div className="text-sm font-medium text-muted-foreground">
                {format(date, 'EEE', { locale: fr })}
              </div>
              <div className={cn(
                "text-sm py-1 my-1 rounded-full w-8 h-8 flex items-center justify-center mx-auto",
                new Date().toDateString() === date.toDateString() ? "bg-primary text-primary-foreground" : ""
              )}>
                {format(date, 'd')}
              </div>
            </div>
          ))}
          
          {/* Heures de la journée */}
          {Array.from({ length: 6 }).map((_, hourIndex) => (
            <React.Fragment key={`hour-row-${hourIndex}`}>
              {weekDates.map((date, dayIndex) => (
                <div 
                  key={`cell-${dayIndex}-${hourIndex}`} 
                  className="border min-h-[60px] hover:bg-muted/50 transition-colors"
                >
                  {hourIndex === 0 && dayIndex === 0 && (
                    <div className="p-2 text-xs bg-blue-100 rounded m-1">
                      Réunion 9h-10h
                    </div>
                  )}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };
  
  // Fonction pour obtenir la vue du mois courant
  const renderMonthView = () => {
    return (
      <div className="grid grid-cols-7 gap-1">
        {/* Jours de la semaine */}
        {weekDays.map((day) => (
          <div key={day} className="text-center py-2 text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}
        
        {/* Espaces vides pour l'alignement du premier jour */}
        {Array.from({ length: startDay }).map((_, index) => (
          <div key={`empty-${index}`} className="p-2 h-12 border border-transparent"></div>
        ))}
        
        {/* Jours du mois */}
        {days.map((day) => {
          const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
          const isToday = new Date().toDateString() === date.toDateString();
          
          return (
            <div 
              key={day} 
              className={cn(
                "p-1 border border-border h-12 hover:bg-muted/50 transition-colors",
                isToday && "bg-primary/10 font-bold"
              )}
            >
              <div className="flex flex-col h-full">
                <span className="text-sm">{day}</span>
                {/* Espace pour les événements potentiels */}
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  
  return (
    <div className="p-4 sm:p-6">
      <PageHeader title="planning" />
      
      <div className="bg-white rounded-lg shadow p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">
            {format(currentMonth, 'MMMM yyyy', { locale: fr })}
          </h2>
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Tabs 
          defaultValue="month" 
          value={currentView}
          onValueChange={(value) => setCurrentView(value as "day" | "week" | "month")}
          className="mb-6"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger 
              value="day" 
              className="bg-blue-500 data-[state=active]:bg-blue-700 text-white data-[state=active]:text-white"
            >
              Jour
            </TabsTrigger>
            <TabsTrigger 
              value="week" 
              className="bg-green-500 data-[state=active]:bg-green-700 text-white data-[state=active]:text-white"
            >
              Semaine
            </TabsTrigger>
            <TabsTrigger 
              value="month" 
              className="bg-violet-500 data-[state=active]:bg-violet-700 text-white data-[state=active]:text-white"
            >
              Mois
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="day" className="mt-4">
            {renderDayView()}
          </TabsContent>
          
          <TabsContent value="week" className="mt-4">
            {renderWeekView()}
          </TabsContent>
          
          <TabsContent value="month" className="mt-4">
            {renderMonthView()}
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="mt-6 bg-white rounded-lg shadow p-4 md:p-6">
        <div className="flex items-center mb-4 text-primary">
          <CalendarIcon className="mr-2 h-5 w-5" />
          <h3 className="text-lg font-medium">Réservations du jour</h3>
        </div>
        <p className="text-muted-foreground">
          Aucune réservation pour aujourd'hui. Cliquez sur une date pour voir ou ajouter des réservations.
        </p>
      </div>
    </div>
  );
};

export default Calendar;
