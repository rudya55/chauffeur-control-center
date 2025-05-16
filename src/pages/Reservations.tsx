
import { useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useReservations } from "@/hooks/use-reservations";
import ReservationHeader from "@/components/reservation/ReservationHeader";
import ReservationTabHeader from "@/components/reservation/ReservationTabHeader";
import ReservationList from "@/components/reservation/ReservationList";
import { ChatDialog } from "@/components/ChatDialog";
import OrderFormDialog from "@/components/OrderFormDialog";

const Reservations = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const {
    upcomingReservations,
    myReservations,
    completedReservations,
    activeTab,
    setActiveTab,
    showChat,
    setShowChat,
    currentDispatcher,
    showOrderForm,
    setShowOrderForm,
    selectedReservation,
    handleAcceptReservation,
    handleRejectReservation,
    handleStartRide,
    handleArrived,
    handleClientBoarded,
    handleCompleteRide,
    openChatWithDispatcher,
    handleShowOrderForm
  } = useReservations();

  return (
    <div className="space-y-4 p-4">
      <ReservationHeader 
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      
      <Tabs defaultValue="upcoming" className="w-full" onValueChange={setActiveTab} value={activeTab}>
        <ReservationTabHeader 
          upcomingCount={upcomingReservations.length}
          currentCount={myReservations.length}
        />
        
        <TabsContent value="upcoming" className="mt-4">
          <ReservationList 
            reservations={upcomingReservations}
            type="upcoming"
            onAccept={handleAcceptReservation}
            onReject={handleRejectReservation}
            emptyMessage="Aucune réservation à venir"
          />
        </TabsContent>
        
        <TabsContent value="current" className="mt-4">
          <ReservationList 
            reservations={myReservations}
            type="current"
            onStartRide={handleStartRide}
            onArrived={handleArrived}
            onClientBoarded={handleClientBoarded}
            onComplete={handleCompleteRide}
            onChatWithDispatcher={openChatWithDispatcher}
            onShowOrderForm={handleShowOrderForm}
            emptyMessage="Aucune réservation en cours"
          />
        </TabsContent>
        
        <TabsContent value="completed" className="mt-4">
          <ReservationList 
            reservations={completedReservations}
            type="completed"
            emptyMessage="Aucune réservation terminée"
          />
        </TabsContent>
      </Tabs>

      {/* Dialog de chat avec traduction */}
      <ChatDialog 
        open={showChat} 
        onOpenChange={setShowChat} 
        dispatcher={currentDispatcher}
      />

      {/* Order Form Dialog */}
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
