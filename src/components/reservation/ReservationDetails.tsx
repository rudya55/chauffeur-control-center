
import { useState } from "react";
import { Navigation, FileText, MapPin, User, Plane, Users, Luggage } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogAction } from "@/components/ui/alert-dialog";
import Map from "@/components/Map";

type ReservationDetailsProps = {
  pickupAddress: string;
  destination: string;
  phone?: string;
  flightNumber?: string;
  clientName?: string;
  amount?: string;
  driverAmount?: string;
  commission?: string;
  paymentType?: 'cash' | 'card' | 'transfer' | 'paypal';
  flightStatus?: 'on-time' | 'delayed' | 'landed' | 'boarding' | 'cancelled';
  placardText?: string;
  pickupGPS?: {lat: number, lng: number};
  destinationGPS?: {lat: number, lng: number};
  dispatcherLogo?: string;
  passengers?: number;
  luggage?: number;
  status?: string;
  showAddressLabels?: boolean;
};

const ReservationDetails = ({ 
  pickupAddress, 
  destination, 
  phone, 
  flightNumber, 
  clientName, 
  amount,
  driverAmount,
  commission,
  paymentType,
  flightStatus = 'on-time',
  placardText,
  pickupGPS,
  destinationGPS,
  dispatcherLogo,
  passengers,
  luggage,
  status,
  showAddressLabels = true
}: ReservationDetailsProps) => {
  const [showPickupMap, setShowPickupMap] = useState(false);
  const [showDestinationMap, setShowDestinationMap] = useState(false);
  const [showPlacard, setShowPlacard] = useState(false);
  const [showFlightInfo, setShowFlightInfo] = useState(false);
  const [showGPSOptions, setShowGPSOptions] = useState(false);
  const [currentAddress, setCurrentAddress] = useState("");
  const [isPickupAddress, setIsPickupAddress] = useState(false);
  
  // Simulated GPS app options for navigation
  const gpsApps = [
    { name: "Google Maps", icon: "🗺️", url: (address: string, lat?: number, lng?: number) => `https://www.google.com/maps/search/?api=1&query=${lat && lng ? `${lat},${lng}` : encodeURIComponent(address)}` },
    { name: "Waze", icon: "📱", url: (address: string, lat?: number, lng?: number) => `https://waze.com/ul?q=${encodeURIComponent(address)}&ll=${lat && lng ? `${lat},${lng}` : ""}&navigate=yes` },
    { name: "Apple Plans", icon: "🍏", url: (address: string, lat?: number, lng?: number) => `https://maps.apple.com/?q=${encodeURIComponent(address)}${lat && lng ? `&ll=${lat},${lng}` : ""}` },
  ];

  // Handler for opening GPS selection dialog
  const handleAddressClick = (address: string, isPickup: boolean) => {
    setCurrentAddress(address);
    setIsPickupAddress(isPickup);
    setShowGPSOptions(true);
  };

  // Handler for navigating to address with selected app
  const handleNavigateWithApp = (appIndex: number) => {
    const app = gpsApps[appIndex];
    const geoData = isPickupAddress ? pickupGPS : destinationGPS;
    const url = app.url(currentAddress, geoData?.lat, geoData?.lng);
    
    window.open(url, '_blank');
    setShowGPSOptions(false);
  };

  // Show different price information based on status and payment type
  const renderPriceInfo = () => {
    if (!amount) return null;
    
    if (status === 'pending') {
      return null; // No price info for pending reservations
    }

    if (paymentType === 'cash' || paymentType === 'card') {
      return (
        <div className="mt-3 p-3 bg-slate-50 rounded-md">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Montant client:</span>
            <span className="font-semibold">{amount} €</span>
          </div>
          
          {commission && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Commission:</span>
              <span className="text-red-500">{commission} €</span>
            </div>
          )}
          
          {driverAmount && (
            <div className="flex justify-between border-t pt-2 mt-2">
              <span className="text-sm font-medium">Net chauffeur:</span>
              <span className="font-bold text-primary">{driverAmount} €</span>
            </div>
          )}
        </div>
      );
    }
    
    if (paymentType === 'transfer' || paymentType === 'paypal') {
      return (
        <div className="mt-3 p-3 bg-slate-50 rounded-md">
          <div className="flex justify-between border-t pt-2 mt-2">
            <span className="text-sm font-medium">Net chauffeur:</span>
            <span className="font-bold text-primary">{driverAmount} €</span>
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="space-y-2">
      {/* Pickup address with map option */}
      <div className="flex items-center">
        <MapPin className="mr-2 h-4 w-4 text-primary" />
        <span className="text-sm font-medium mr-1">Départ:</span>
        <button 
          className="text-sm underline hover:text-primary"
          onClick={() => handleAddressClick(pickupAddress, true)}
        >
          {pickupAddress}
        </button>
      </div>
      
      {/* Destination with map option */}
      <div className="flex items-center">
        <MapPin className="mr-2 h-4 w-4 text-primary" />
        <span className="text-sm font-medium mr-1">Destination:</span>
        <button 
          className="text-sm underline hover:text-primary"
          onClick={() => handleAddressClick(destination, false)}
        >
          {destination}
        </button>
      </div>
      
      {/* Client name with placard option */}
      {clientName && status !== 'completed' && (
        <div className="flex items-center">
          <User className="mr-2 h-4 w-4 text-primary" />
          <button 
            className="text-sm underline hover:text-primary"
            onClick={() => setShowPlacard(true)}
          >
            {clientName}
          </button>
          <span className="text-xs ml-2 bg-primary/10 text-primary px-2 py-1 rounded">
            Pancarte
          </span>
        </div>
      )}
      
      {/* Passengers and luggage info */}
      <div className="flex items-center space-x-4">
        {passengers !== undefined && (
          <div className="flex items-center">
            <Users className="mr-1 h-4 w-4 text-primary" />
            <span className="text-sm">{passengers}</span>
          </div>
        )}
        
        {luggage !== undefined && (
          <div className="flex items-center">
            <Luggage className="mr-1 h-4 w-4 text-primary" />
            <span className="text-sm">{luggage}</span>
          </div>
        )}
      </div>
      
      {/* Flight number with status */}
      {flightNumber && (
        <div className="flex items-center">
          <Plane className="mr-2 h-4 w-4 text-primary" />
          <button 
            className="text-sm underline hover:text-primary"
            onClick={() => setShowFlightInfo(true)}
          >
            Vol {flightNumber}
          </button>
          <span 
            className={`text-xs ml-2 px-2 py-1 rounded ${
              flightStatus === 'on-time' ? 'bg-green-100 text-green-800' :
              flightStatus === 'delayed' ? 'bg-amber-100 text-amber-800' :
              flightStatus === 'landed' ? 'bg-blue-100 text-blue-800' :
              flightStatus === 'boarding' ? 'bg-purple-100 text-purple-800' :
              'bg-red-100 text-red-800'
            }`}
          >
            {
              flightStatus === 'on-time' ? 'À l\'heure' :
              flightStatus === 'delayed' ? 'Retardé' :
              flightStatus === 'landed' ? 'Atterri' :
              flightStatus === 'boarding' ? 'Embarquement' :
              'Annulé'
            }
          </span>
        </div>
      )}
      
      {/* Price information */}
      {renderPriceInfo()}

      {/* Completed ride details with distance and route map */}
      {status === 'completed' && (
        <div className="mt-3">
          <button 
            className="flex items-center w-full justify-between p-3 bg-slate-50 rounded-md hover:bg-slate-100"
            onClick={() => setShowPickupMap(true)}
          >
            <div className="flex items-center">
              <Navigation className="mr-2 h-4 w-4 text-primary" />
              <span>Voir l'itinéraire</span>
            </div>
            <span className="font-medium text-primary">{destination}</span>
          </button>
        </div>
      )}

      {/* Pickup map dialog */}
      <Dialog open={showPickupMap} onOpenChange={setShowPickupMap}>
        <DialogContent className="sm:max-w-[600px] h-[400px]">
          <DialogHeader>
            <DialogTitle>Itinéraire de la course</DialogTitle>
          </DialogHeader>
          <div className="h-[300px] w-full">
            <Map 
              center={pickupGPS || { lat: 48.8566, lng: 2.3522 }}
              zoom={13}
              route={status === 'completed' ? [
                {lat: 48.870, lng: 2.330}, // Point de départ
                {lat: 48.865, lng: 2.334},
                {lat: 48.862, lng: 2.338},
                {lat: 48.858, lng: 2.340} // Destination
              ] : undefined}
            />
          </div>
          {status === 'completed' && (
            <div className="flex justify-between items-center pt-2">
              <div>
                <p className="text-sm font-medium">Distance: 12.5 km</p>
                <p className="text-sm text-gray-500">Durée: 35 min</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Destination map dialog */}
      <Dialog open={showDestinationMap} onOpenChange={setShowDestinationMap}>
        <DialogContent className="sm:max-w-[600px] h-[400px]">
          <DialogHeader>
            <DialogTitle>Destination: {destination}</DialogTitle>
          </DialogHeader>
          <div className="h-[300px] w-full">
            <Map 
              center={destinationGPS || { lat: 48.8566, lng: 2.3522 }}
              zoom={15}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Placard dialog */}
      <Dialog open={showPlacard} onOpenChange={setShowPlacard}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Pancarte</DialogTitle>
          </DialogHeader>
          <div className="bg-primary text-white p-8 rounded-lg text-center">
            {dispatcherLogo && <div className="text-3xl mb-3">{dispatcherLogo}</div>}
            <h2 className="text-2xl font-bold">{clientName}</h2>
          </div>
        </DialogContent>
      </Dialog>

      {/* Flight info dialog */}
      <Dialog open={showFlightInfo} onOpenChange={setShowFlightInfo}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Informations de vol: {flightNumber}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-between bg-muted p-3 rounded-lg">
              <span>Statut:</span>
              <span className="font-semibold">
                {
                  flightStatus === 'on-time' ? 'À l\'heure' :
                  flightStatus === 'delayed' ? 'Retardé' :
                  flightStatus === 'landed' ? 'Atterri' :
                  flightStatus === 'boarding' ? 'Embarquement' :
                  'Annulé'
                }
              </span>
            </div>
            
            {/* Simulated flight info */}
            <div className="flex justify-between bg-muted p-3 rounded-lg">
              <span>Heure prévue:</span>
              <span className="font-semibold">14:30</span>
            </div>
            
            <div className="flex justify-between bg-muted p-3 rounded-lg">
              <span>Terminal:</span>
              <span className="font-semibold">2E</span>
            </div>
            
            <div className="flex justify-between bg-muted p-3 rounded-lg">
              <span>Porte:</span>
              <span className="font-semibold">K45</span>
            </div>
            
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => window.open(`https://www.google.com/search?q=${flightNumber}+flight+status`, '_blank')}
            >
              Vérifier sur le web
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* GPS options dialog */}
      <AlertDialog open={showGPSOptions} onOpenChange={setShowGPSOptions}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Choisir l'application GPS</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="py-4 space-y-2">
            {gpsApps.map((app, index) => (
              <button
                key={app.name}
                className="flex items-center w-full p-3 rounded-lg border hover:bg-gray-50"
                onClick={() => handleNavigateWithApp(index)}
              >
                <span className="text-xl mr-2">{app.icon}</span>
                <span>{app.name}</span>
              </button>
            ))}
          </div>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowGPSOptions(false)}>
              Annuler
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ReservationDetails;
