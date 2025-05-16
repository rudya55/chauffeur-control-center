
import PageHeader from "@/components/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useReservations } from "@/hooks/use-reservations";
import ReservationList from "@/components/reservation/ReservationList";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import OrderFormDialog from "@/components/OrderFormDialog";

const Reservations = () => {
  const { 
    upcomingReservations, 
    myReservations, 
    completedReservations, 
    handleShowOrderForm,
    showOrderForm,
    setShowOrderForm,
    selectedReservation
  } = useReservations();

  return (
    <div className="p-4 sm:p-6">
      <PageHeader title="reservations" />
      
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="upcoming">Nouvelles réservations ({upcomingReservations.length})</TabsTrigger>
          <TabsTrigger value="current">Mes réservations ({myReservations.length})</TabsTrigger>
          <TabsTrigger value="completed">Terminées ({completedReservations.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming">
          <ReservationList 
            reservations={upcomingReservations} 
            type="upcoming" 
            emptyMessage="Aucune nouvelle réservation"
          />
        </TabsContent>
        
        <TabsContent value="current">
          <ReservationList 
            reservations={myReservations} 
            type="current" 
            emptyMessage="Aucune réservation active"
            onShowOrderForm={handleShowOrderForm}
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
      
      {selectedReservation && (
        <OrderFormDialog 
          open={showOrderForm}
          onOpenChange={setShowOrderForm}
          reservation={selectedReservation}
        />
      )}
    </div>
  );
};

export default Reservations;
