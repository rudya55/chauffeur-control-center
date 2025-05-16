
// Type definitions for reservation data
export type VehicleType = 'standard' | 'berline' | 'van' | 'mini-bus' | 'first-class';
export type PaymentType = 'cash' | 'card' | 'transfer' | 'paypal';

export type ReservationType = {
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
  vehicleType?: VehicleType;
  paymentType?: PaymentType;
  rating?: number;
  comment?: string;
  route?: {lat: number, lng: number}[];
  pickupGPS?: {lat: number, lng: number};
  destinationGPS?: {lat: number, lng: number};
  flightStatus?: 'on-time' | 'delayed' | 'landed' | 'boarding' | 'cancelled';
  placardText?: string;
};
