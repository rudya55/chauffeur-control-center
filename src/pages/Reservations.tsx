
import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useReservations } from "@/hooks/use-reservations";
import ReservationList from "@/components/reservation/ReservationList";
import OrderFormDialog from "@/components/OrderFormDialog";
import ReservationTabHeader from "@/components/reservation/ReservationTabHeader";
import { useMobile } from "@/hooks/use-mobile";
import { ReservationType } from "@/types/reservation";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import ReservationDetails from "@/components/reservation/ReservationDetails";
import ReservationActions from "@/components/reservation/ReservationActions";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { ChatDialog } from "@/components/ChatDialog";

const Reservations = () => {
  const isMobile = useMobile();
  const [selectedViewReservation, setSelectedViewReservation] = useState<ReservationType | null>(null);
  const [openFullscreenView, setOpenFullscreenView] = useState(false);
  const [openChatDialog, setOpenChatDialog] = useState(false);
  const [currentDispatcher, setCurrentDispatcher] = useState("");
  
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

  // Create a date 10 seconds in the future for the test timer
  const testTimerDate = new Date();
  testTimerDate.setSeconds(testTimerDate.getSeconds() + 10);

  const handleReservationClick = (reservation: ReservationType) => {
    if (isMobile) {
      setSelectedViewReservation(reservation);
      setOpenFullscreenView(true);
    }
  };

  const handleOpenChat = (dispatcher: string) => {
    setCurrentDispatcher(dispatcher);
    setOpenChatDialog(true);
  };

  const renderMobileReservationView = () => {
    if (!selectedViewReservation) return null;

    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Détails de la réservation</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setOpenFullscreenView(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <ReservationDetails 
          pickupAddress={selectedViewReservation.pickupAddress}
          destination={selectedViewReservation.destination}
          flightNumber={selectedViewReservation.flightNumber}
          clientName={selectedViewReservation.clientName}
          amount={selectedViewReservation.amount}
          driverAmount={selectedViewReservation.driverAmount}
          commission={selectedViewReservation.commission}
          paymentType={selectedViewReservation.paymentType}
          flightStatus={selectedViewReservation.flightStatus}
          placardText={selectedViewReservation.clientName}
          pickupGPS={selectedViewReservation.pickupGPS}
          destinationGPS={selectedViewReservation.destinationGPS}
          dispatcherLogo={selectedViewReservation.dispatcherLogo}
          passengers={selectedViewReservation.passengers}
          luggage={selectedViewReservation.luggage}
          status={selectedViewReservation.status}
          vehicleType={selectedViewReservation.vehicleType}
          showAddressLabels={true}
        />

        <div className="mt-4">
          <ReservationActions 
            reservation={selectedViewReservation}
            type={
              selectedViewReservation.status === 'completed' 
                ? 'completed' 
                : selectedViewReservation.status === 'pending' 
                  ? 'upcoming' 
                  : 'current'
            }
            onAccept={handleAcceptReservation}
            onReject={handleRejectReservation}
            onStartRide={handleStartRide}
            onArrived={handleArrived}
            onClientBoarded={handleClientBoarded}
            onComplete={handleCompleteRide}
            testTimerDate={testTimerDate}
            onChatWithDispatcher={handleOpenChat}
            fullscreenMode={true}
          />
        </div>
      </div>
    );
  };

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
            onReservationClick={handleReservationClick}
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
            onChatWithDispatcher={handleOpenChat}
            onReservationClick={handleReservationClick}
          />
        </TabsContent>
        
        <TabsContent value="completed">
          <ReservationList 
            reservations={completedReservations} 
            type="completed"
            emptyMessage="Aucune réservation terminée" 
            onReservationClick={handleReservationClick}
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

      <ChatDialog
        open={openChatDialog}
        onOpenChange={setOpenChatDialog}
        dispatcher={currentDispatcher}
      />

      {isMobile ? (
        <Drawer open={openFullscreenView} onOpenChange={setOpenFullscreenView}>
          <DrawerContent className="h-[85vh] max-h-[85vh] overflow-y-auto">
            {renderMobileReservationView()}
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={openFullscreenView} onOpenChange={setOpenFullscreenView}>
          <DialogContent className="max-w-2xl">
            {renderMobileReservationView()}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Reservations;
