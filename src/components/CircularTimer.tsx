
import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface CircularTimerProps {
  targetTime: Date;
  onTimeReached?: () => void;
  durationInSeconds?: number;
  size?: number;
}

const CircularTimer = ({ 
  targetTime, 
  onTimeReached, 
  durationInSeconds = 10,
  size = 16
}: CircularTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<string>("00:00:00");
  const [progress, setProgress] = useState(100);
  const [timerCompleted, setTimerCompleted] = useState(false);

  useEffect(() => {
    // Guard clause to ensure targetTime is defined
    if (!targetTime || !(targetTime instanceof Date)) {
      console.error("CircularTimer: targetTime is undefined or not a Date object");
      return;
    }
    
    const targetTimeMs = targetTime.getTime();
    const totalDurationMs = durationInSeconds * 1000;
    const startTimeMs = targetTimeMs - totalDurationMs;
    
    const updateTimer = () => {
      const now = new Date().getTime();
      const timeLeftMs = Math.max(targetTimeMs - now, 0);
      
      // Calculate progress percentage
      const elapsedMs = now - startTimeMs;
      const progressValue = Math.max(100 - (elapsedMs / totalDurationMs * 100), 0);
      setProgress(progressValue);
      
      if (timeLeftMs <= 0) {
        setTimeLeft("00:00:00");
        setTimerCompleted(true);
        if (onTimeReached) {
          onTimeReached();
        }
        return;
      }
      
      // Convert to hours, minutes, seconds - no milliseconds
      const hours = Math.floor(timeLeftMs / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeftMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeftMs % (1000 * 60)) / 1000);
      
      // Format time as HH:MM:SS
      const timeString = 
        hours.toString().padStart(2, '0') + ':' +
        minutes.toString().padStart(2, '0') + ':' +
        seconds.toString().padStart(2, '0');
      
      setTimeLeft(timeString);
    };
    
    updateTimer(); // Initial call
    const interval = setInterval(updateTimer, 1000);
    
    return () => clearInterval(interval);
  }, [targetTime, onTimeReached, durationInSeconds]);

  // Size calculation for the component
  const width = size;
  const height = size;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`relative w-${width} h-${height}`} style={{ width: `${width}px`, height: `${height}px` }}>
        {/* Circular progress background */}
        <div className="absolute inset-0 rounded-full bg-gray-100 border border-gray-200"></div>
        
        {/* Progress circle */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          <circle 
            cx="50" 
            cy="50" 
            r="45" 
            fill="none" 
            strokeWidth="8" 
            stroke="#f3f4f6" 
          />
          <circle 
            cx="50" 
            cy="50" 
            r="45" 
            fill="none" 
            strokeWidth="8" 
            stroke="#3b82f6" 
            strokeLinecap="round" 
            strokeDasharray={`${2 * Math.PI * 45}`} 
            strokeDashoffset={`${(100 - progress) / 100 * (2 * Math.PI * 45)}`} 
            transform="rotate(-90 50 50)" 
          />
        </svg>
        
        {/* Center clock icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Clock className={`h-${Math.max(width/4, 4)} w-${Math.max(width/4, 4)} text-primary`} style={{ width: `${Math.max(width/4, 4)}px`, height: `${Math.max(width/4, 4)}px` }} />
        </div>
      </div>
      
      <div className="text-sm font-medium text-primary mt-1">
        {timeLeft}
      </div>
    </div>
  );
};

export default CircularTimer;
