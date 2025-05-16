
import { useState } from "react";
import { Navigation, PhoneCall, FileText, MapPin, User, Plane } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Map from "@/components/Map";

type ReservationDetailsProps = {
  pickupAddress: string;
  destination: string;
  phone: string;
  flightNumber?: string;
  clientName: string;
  amount?: string;
  flightStatus?: 'on-time' | 'delayed' | 'landed' | 'boarding' | 'cancelled';
  placardText?: string;
  pickupGPS?: {lat: number, lng: number};
  destinationGPS?: {lat: number, lng: number};
};

const ReservationDetails = ({ 
  pickupAddress, 
  destination, 
  phone, 
  flightNumber, 
  clientName, 
  amount, 
  flightStatus = 'on-time',
  placardText,
  pickupGPS,
  destinationGPS
}: ReservationDetailsProps) => {
  const [showPickupMap, setShowPickupMap] = useState(false);
  const [showDestinationMap, setShowDestinationMap] = useState(false);
  const [showPlacard, setShowPlacard] = useState(false);
  const [showFlightInfo, setShowFlightInfo] = useState(false);

  // Handler for navigating to address
  const handleNavigateTo = (address: string, isPickup: boolean) => {
    // Check if we can use the native map app
    if (navigator.geolocation && 'share' in navigator) {
      try {
        // Try to use the Web Share API with geo coordinates if available
        const geoData = isPickup ? pickupGPS : destinationGPS;
        if (geoData) {
          navigator.share({
            title: isPickup ? 'Navigation vers le point de départ' : 'Navigation vers la destination',
            text: address,
            url: `https://www.google.com/maps/search/?api=1&query=${geoData.lat},${geoData.lng}`
          });
        } else {
          // Fallback to using the address
          navigator.share({
            title: isPickup ? 'Navigation vers le point de départ' : 'Navigation vers la destination',
            text: address,
            url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
          });
        }
      } catch (error) {
        // Fallback if share API is not available or fails
        window.open(
          `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
          '_blank'
        );
      }
    } else {
      // Fallback for browsers that don't support the Share API
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
        '_blank'
      );
    }
  };

  return (
    <div className="space-y-2">
      {/* Pickup address with map option */}
      <div className="flex items-center">
        <MapPin className="mr-2 h-4 w-4 text-primary" />
        <button 
          className="text-sm underline hover:text-primary"
          onClick={() => setShowPickupMap(true)}
        >
          {pickupAddress}
        </button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="ml-2 px-2"
          onClick={() => handleNavigateTo(pickupAddress, true)}
        >
          <Navigation className="h-4 w-4 text-primary" />
        </Button>
      </div>
      
      {/* Destination with map option */}
      <div className="flex items-center">
        <MapPin className="mr-2 h-4 w-4 text-primary" />
        <button 
          className="text-sm underline hover:text-primary"
          onClick={() => setShowDestinationMap(true)}
        >
          {destination}
        </button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="ml-2 px-2"
          onClick={() => handleNavigateTo(destination, false)}
        >
          <Navigation className="h-4 w-4 text-primary" />
        </Button>
      </div>
      
      {/* Client name with placard option */}
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
      
      {/* Phone number */}
      <div className="flex items-center">
        <PhoneCall className="mr-2 h-4 w-4 text-primary" />
        <a href={`tel:${phone}`} className="text-sm underline">
          {phone}
        </a>
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
      
      {/* Amount */}
      {amount && (
        <div className="flex items-center mt-3">
          <span className="font-semibold text-primary text-lg">
            {amount} €
          </span>
        </div>
      )}

      {/* Pickup map dialog */}
      <Dialog open={showPickupMap} onOpenChange={setShowPickupMap}>
        <DialogContent className="sm:max-w-[600px] h-[400px]">
          <DialogHeader>
            <DialogTitle>Point de départ: {pickupAddress}</DialogTitle>
          </DialogHeader>
          <div className="h-[300px] w-full">
            <Map 
              center={pickupGPS || { lat: 48.8566, lng: 2.3522 }}
              zoom={15}
            />
          </div>
          <div className="flex justify-end">
            <Button 
              onClick={() => handleNavigateTo(pickupAddress, true)}
              className="flex items-center gap-2"
            >
              <Navigation size={16} />
              Y aller
            </Button>
          </div>
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
          <div className="flex justify-end">
            <Button 
              onClick={() => handleNavigateTo(destination, false)}
              className="flex items-center gap-2"
            >
              <Navigation size={16} />
              Y aller
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Placard dialog */}
      <Dialog open={showPlacard} onOpenChange={setShowPlacard}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Pancarte pour {clientName}</DialogTitle>
          </DialogHeader>
          <div className="bg-primary text-white p-8 rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-4">{placardText || clientName}</h2>
            <p className="text-lg">Votre chauffeur vous attend</p>
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
    </div>
  );
};

export default ReservationDetails;
