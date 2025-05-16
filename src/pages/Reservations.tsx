
import PageHeader from "@/components/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useReservations } from "@/hooks/use-reservations";
import ReservationList from "@/components/reservation/ReservationList";

const Reservations = () => {
  const { pendingReservations, activeReservations, completedReservations } = useReservations();

  return (
    <div className="p-4 sm:p-6">
      <PageHeader title="reservations" />
      
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="pending">En attente ({pendingReservations.length})</TabsTrigger>
          <TabsTrigger value="active">Actives ({activeReservations.length})</TabsTrigger>
          <TabsTrigger value="completed">Terminées ({completedReservations.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending">
          <ReservationList reservations={pendingReservations} type="pending" />
        </TabsContent>
        
        <TabsContent value="active">
          <ReservationList reservations={activeReservations} type="active" />
        </TabsContent>
        
        <TabsContent value="completed">
          <ReservationList reservations={completedReservations} type="completed" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reservations;
