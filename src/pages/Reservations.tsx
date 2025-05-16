
import PageHeader from "@/components/PageHeader";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useReservations } from "@/hooks/use-reservations";
import ReservationList from "@/components/reservation/ReservationList";
import OrderFormDialog from "@/components/OrderFormDialog";
import ReservationTabHeader from "@/components/reservation/ReservationTabHeader";

const Reservations = () => {
  const { 
    upcomingReservations, 
    myReservations, 
    completedReservations,
    handleAcceptReservation,
    handleRejectReservation,
    handleStartRide,
    handleArrived,
    handleClientBoarded,
    handleCompleteRide,
    openChatWithDispatcher, 
    handleShowOrderForm,
    showOrderForm,
    setShowOrderForm,
    selectedReservation
  } = useReservations();

  return (
    <div className="p-4 sm:p-6">
      <PageHeader title="reservations" />
      
      <Tabs defaultValue="upcoming" className="w-full">
        <ReservationTabHeader
          upcomingCount={upcomingReservations.length}
          currentCount={myReservations.length}
          completedCount={completedReservations.length}
        />
        
        <TabsContent value="upcoming">
          <ReservationList 
            reservations={upcomingReservations} 
            type="upcoming" 
            emptyMessage="Aucune nouvelle réservation"
            onAccept={handleAcceptReservation}
            onReject={handleRejectReservation}
          />
        </TabsContent>
        
        <TabsContent value="current">
          <ReservationList 
            reservations={myReservations} 
            type="current" 
            emptyMessage="Aucune réservation active"
            onShowOrderForm={handleShowOrderForm}
            onStartRide={handleStartRide}
            onArrived={handleArrived}
            onClientBoarded={handleClientBoarded}
            onComplete={handleCompleteRide}
            onChatWithDispatcher={openChatWithDispatcher}
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
