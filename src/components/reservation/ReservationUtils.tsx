
import { Car, Truck, Bus, Star, CreditCard, Wallet, FileCheck, Banknote, Zap } from "lucide-react";

// Helper function to render the appropriate vehicle icon based on vehicle type
export const renderVehicleIcon = (vehicleType?: string) => {
  switch (vehicleType) {
    case 'berline':
      return <Car className="h-5 w-5 text-primary" />;
    case 'van':
      return <Truck className="h-5 w-5 text-primary" />;
    case 'mini-bus':
      return <Bus className="h-5 w-5 text-primary" />;
    case 'first-class':
      return <Star className="h-5 w-5 text-primary" />;
    case 'standard':
    default:
      return <Car className="h-5 w-5 text-primary" />;
  }
};

// Helper function to render payment type icon
export const renderPaymentTypeIcon = (paymentType?: string) => {
  switch (paymentType) {
    case 'card':
      return <CreditCard className="h-4 w-4 text-gray-500" />;
    case 'cash':
      return <Banknote className="h-4 w-4 text-gray-500" />;
    case 'transfer':
      return <FileCheck className="h-4 w-4 text-gray-500" />;
    case 'paypal':
      return <Wallet className="h-4 w-4 text-gray-500" />;
    case 'stripe':
      return <Zap className="h-4 w-4 text-gray-500" />;
    default:
      return <CreditCard className="h-4 w-4 text-gray-500" />;
  }
};
