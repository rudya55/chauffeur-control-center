
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useMobile } from "@/hooks/use-mobile";

type ReservationType = {
  id: string;
  clientName: string;
  pickupAddress: string;
  destination: string;
  date: string;
  phone: string;
  flightNumber?: string;
  dispatcher: string;
  dispatcherLogo?: string;
  passengers?: number;
  luggage?: number;
  status?: 'pending' | 'accepted' | 'started' | 'arrived' | 'onBoard' | 'completed';
  actualPickupTime?: string;
  dropoffTime?: string;
  distance?: string;
  duration?: string;
  amount?: string;
  driverAmount?: string;
  commission?: string;
  vehicleType?: string;
  paymentType?: string;
  rating?: number;
  comment?: string;
  route?: {lat: number, lng: number}[];
};

interface OrderFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reservation: ReservationType;
}

const OrderFormDialog = ({ open, onOpenChange, reservation }: OrderFormDialogProps) => {
  const isMobile = useMobile();
  
  // Example company info - in a real app this would come from user profile or settings
  const companyInfo = {
    name: "Transport VTC",
    address: "15 Avenue des Champs-Élysées, 75008 Paris",
    siret: "123 456 789 00012",
    email: "contact@transportvtc.com"
  };

  // Example driver info - in a real app this would come from the user profile
  const driverInfo = {
    name: "Jean Dupont",
    phone: "+33 6 12 34 56 78",
    vehicle: "Mercedes Classe E",
    licensePlate: "AB-123-CD"
  };

  const handlePrint = () => {
    window.print();
  };

  // Render company info section
  const renderCompanyInfo = () => (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell className="font-semibold">Nom société</TableCell>
          <TableCell>{companyInfo.name}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-semibold">Adresse</TableCell>
          <TableCell>{companyInfo.address}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-semibold">Numéro siret</TableCell>
          <TableCell>{companyInfo.siret}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-semibold">E-mail</TableCell>
          <TableCell>{companyInfo.email}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );

  // Render reservation info section
  const renderReservationInfo = () => (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell className="font-semibold">Date</TableCell>
          <TableCell>{new Date(reservation.date).toLocaleString('fr-FR')}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-semibold">Adresse de prise en charge</TableCell>
          <TableCell>{reservation.pickupAddress}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-semibold">Destination</TableCell>
          <TableCell>{reservation.destination}</TableCell>
        </TableRow>
        {reservation.flightNumber && (
          <TableRow>
            <TableCell className="font-semibold">Numéro de vol</TableCell>
            <TableCell>{reservation.flightNumber}</TableCell>
          </TableRow>
        )}
        <TableRow>
          <TableCell className="font-semibold">Passagers</TableCell>
          <TableCell>{reservation.passengers} personne(s)</TableCell>
        </TableRow>
        {reservation.luggage && (
          <TableRow>
            <TableCell className="font-semibold">Bagages</TableCell>
            <TableCell>{reservation.luggage}</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  // Render driver info section
  const renderDriverInfo = () => (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell className="font-semibold">👩‍✈️ Driver</TableCell>
          <TableCell>{driverInfo.name}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-semibold">Phone Number</TableCell>
          <TableCell>{driverInfo.phone}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-semibold">Véhicule</TableCell>
          <TableCell>{driverInfo.vehicle}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-semibold">Registration</TableCell>
          <TableCell>{driverInfo.licensePlate}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );

  // Render client info section
  const renderClientInfo = () => (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell className="font-semibold">Infos du client non prenon</TableCell>
          <TableCell>{reservation.clientName}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-semibold">Téléphone</TableCell>
          <TableCell>{reservation.phone}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl overflow-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">Information société</DialogTitle>
        </DialogHeader>
        
        <div className="bg-white rounded-md print:shadow-none" id="printable-content">
          {isMobile ? (
            // Mobile view with accordion dropdown menu
            <div className="space-y-2">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="company">
                  <AccordionTrigger className="font-bold">Information société</AccordionTrigger>
                  <AccordionContent>{renderCompanyInfo()}</AccordionContent>
                </AccordionItem>

                <div className="my-2 text-center text-sm px-4 py-2 bg-gray-50 rounded-md">
                  <p>« SERVICE DE TRANSPORT PUBLIC DE PERSONNES - BILLET COLLECTIF »</p>
                  <p className="text-xs my-1">------- (Arrêté du 14 février 1986 – Article.5) et ordre de mission (Arrêté du 6 janvier 1993 – Article 3) ------</p>
                  <p>« LOCATION DE VÉHICULE AVEC CHAUFFEUR »</p>
                </div>

                <AccordionItem value="reservation">
                  <AccordionTrigger className="font-bold">Les infos de la course</AccordionTrigger>
                  <AccordionContent>{renderReservationInfo()}</AccordionContent>
                </AccordionItem>

                <AccordionItem value="driver">
                  <AccordionTrigger className="font-bold">Informations du chauffeur</AccordionTrigger>
                  <AccordionContent>{renderDriverInfo()}</AccordionContent>
                </AccordionItem>

                <AccordionItem value="client">
                  <AccordionTrigger className="font-bold">Informations du client</AccordionTrigger>
                  <AccordionContent>{renderClientInfo()}</AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="mt-4 border-t pt-4">
                <h2 className="text-xl font-bold text-center">Prix de la course</h2>
                <p className="text-center text-2xl font-bold text-green-600">{reservation.driverAmount}€ NET chauffeur</p>
              </div>
            </div>
          ) : (
            // Desktop view
            <div className="p-4">
              <div className="mb-6">
                <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-2">Information société</h2>
                {renderCompanyInfo()}
              </div>

              <div className="my-4 text-center font-bold">
                <p>« SERVICE DE TRANSPORT PUBLIC DE PERSONNES - BILLET COLLECTIF »</p>
                <p className="text-sm my-1">------- (Arrêté du 14 février 1986 – Article.5) et ordre de mission (Arrêté du 6 janvier 1993 – Article 3) ------</p>
                <p>« LOCATION DE VÉHICULE AVEC CHAUFFEUR »</p>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-2">Les infos de la course</h2>
                {renderReservationInfo()}
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-2">Informations du chauffeur</h2>
                {renderDriverInfo()}
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-2">Informations du client</h2>
                {renderClientInfo()}
              </div>

              <div className="mt-8 border-t-2 border-gray-300 pt-4">
                <h2 className="text-xl font-bold text-center">Prix de la course</h2>
                <p className="text-center text-2xl font-bold text-green-600">{reservation.driverAmount}€ NET chauffeur</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-center mt-4">
          <Button onClick={handlePrint} className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Imprimer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderFormDialog;
