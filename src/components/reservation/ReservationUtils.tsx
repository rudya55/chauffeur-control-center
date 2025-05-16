
import { Car, Truck, Bus, Star } from "lucide-react";

// Helper function to render the appropriate vehicle icon based on vehicle type
export const renderVehicleIcon = (vehicleType?: string) => {
  switch (vehicleType) {
    case 'berline':
      return <Car className="h-4 w-4 text-primary" />;
    case 'van':
      return <Truck className="h-4 w-4 text-primary" />;
    case 'mini-bus':
      return <Bus className="h-4 w-4 text-primary" />;
    case 'first-class':
      return <Star className="h-4 w-4 text-primary" />;
    case 'standard':
    default:
      return <Car className="h-4 w-4 text-primary" />;
  }
};
