
import { Navigation, PhoneCall, FileText } from "lucide-react";

type ReservationDetailsProps = {
  pickupAddress: string;
  destination: string;
  phone: string;
  flightNumber?: string;
};

const ReservationDetails = ({ pickupAddress, destination, phone, flightNumber }: ReservationDetailsProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center">
        <Navigation className="mr-2 h-4 w-4 text-gray-500" />
        <span className="text-sm">
          {pickupAddress} <span className="font-bold">→</span> {destination}
        </span>
      </div>
      <div className="flex items-center">
        <PhoneCall className="mr-2 h-4 w-4 text-gray-500" />
        <a href={`tel:${phone}`} className="text-sm underline">
          {phone}
        </a>
      </div>
      {flightNumber && (
        <div className="flex items-center">
          <FileText className="mr-2 h-4 w-4 text-gray-500" />
          <span className="text-sm">Vol {flightNumber}</span>
        </div>
      )}
    </div>
  );
};

export default ReservationDetails;
