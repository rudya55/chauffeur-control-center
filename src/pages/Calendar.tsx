
import PageHeader from "@/components/PageHeader";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
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
