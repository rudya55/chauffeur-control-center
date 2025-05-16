
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">BON DE MISSION</DialogTitle>
        </DialogHeader>
        
        <div className="p-4 bg-white rounded-md print:shadow-none" id="printable-content">
          <div className="mb-6">
            <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-2">Information société</h2>
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
          </div>

          <div className="my-4 text-center font-bold">
            <p>« SERVICE DE TRANSPORT PUBLIC DE PERSONNES - BILLET COLLECTIF »</p>
            <p className="text-sm my-1">------- (Arrêté du 14 février 1986 – Article.5) et ordre de mission (Arrêté du 6 janvier 1993 – Article 3) ------</p>
            <p>« LOCATION DE VÉHICULE AVEC CHAUFFEUR »</p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-2">Informations de la course</h2>
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
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-2">Informations du chauffeur</h2>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-semibold">👩‍✈️ Nom du chauffeur</TableCell>
                  <TableCell>{driverInfo.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Téléphone</TableCell>
                  <TableCell>{driverInfo.phone}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Véhicule</TableCell>
                  <TableCell>{driverInfo.vehicle}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Plaque d'immatriculation</TableCell>
                  <TableCell>{driverInfo.licensePlate}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-2">Informations du client</h2>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-semibold">Nom et prénom</TableCell>
                  <TableCell>{reservation.clientName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Téléphone</TableCell>
                  <TableCell>{reservation.phone}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="mt-8 border-t-2 border-gray-300 pt-4">
            <h2 className="text-xl font-bold text-center">Prix de la course</h2>
            <p className="text-center text-2xl font-bold text-green-600">{reservation.driverAmount}€ NET chauffeur</p>
          </div>
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
