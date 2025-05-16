
import PageHeader from "@/components/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useReservations } from "@/hooks/use-reservations";
import ReservationList from "@/components/reservation/ReservationList";

const Reservations = () => {
  const { upcomingReservations, myReservations, completedReservations } = useReservations();

  return (
    <div className="p-4 sm:p-6">
      <PageHeader title="reservations" />
      
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="upcoming">En attente ({upcomingReservations.length})</TabsTrigger>
          <TabsTrigger value="current">Actives ({myReservations.length})</TabsTrigger>
          <TabsTrigger value="completed">Terminées ({completedReservations.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming">
          <ReservationList 
            reservations={upcomingReservations} 
            type="upcoming" 
            emptyMessage="Aucune réservation en attente"
          />
        </TabsContent>
        
        <TabsContent value="current">
          <ReservationList 
            reservations={myReservations} 
            type="current" 
            emptyMessage="Aucune réservation active"
          />
        </TabsContent>
        
        <TabsContent value="completed">
          <ReservationList 
            reservations={completedReservations} 
            type="completed"
            emptyMessage="Aucune réservation terminée" 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reservations;
