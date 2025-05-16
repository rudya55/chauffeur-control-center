
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
    <div className="mt-4 bg-slate-50 p-3 rounded-md">
      {rating && (
        <div className="flex items-center">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${i < (rating || 0) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
            />
          ))}
          <span className="ml-2 text-sm font-medium">{rating}/5</span>
        </div>
      )}
      
      {comment && (
        <div className="mt-2">
          <p className="text-sm italic text-gray-700">"{comment}"</p>
        </div>
      )}
    </div>
  );
};

export default ReservationRating;
