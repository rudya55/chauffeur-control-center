
import { Star } from "lucide-react";

interface ReservationRatingProps {
  rating?: number;
  comment?: string;
}

const ReservationRating = ({ rating, comment }: ReservationRatingProps) => {
  if (!rating && !comment) {
    return null;
  }
  
  return (
    <div className="mt-2">
      {rating && (
        <div className="flex items-center">
          <Star className="mr-1 h-4 w-4 text-yellow-500" />
          <span>{rating} étoiles</span>
        </div>
      )}
      
      {comment && (
        <div className="mt-2">
          <p className="text-sm italic">{comment}</p>
        </div>
      )}
    </div>
  );
};

export default ReservationRating;
