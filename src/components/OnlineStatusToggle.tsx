
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { CarTaxiFront } from 'lucide-react';

interface OnlineStatusToggleProps {
  className?: string;
}

const OnlineStatusToggle = ({ className }: OnlineStatusToggleProps) => {
  const [isOnline, setIsOnline] = useState(false);

  const handleToggle = (checked: boolean) => {
    setIsOnline(checked);
  };

  return (
    <div className={cn("flex items-center gap-2 sm:gap-3 px-3 py-1.5 sm:px-6 sm:py-2 bg-white/95 dark:bg-card/95 backdrop-blur-sm rounded-full shadow-md", className)}>
      <CarTaxiFront size={16} className={cn(
        "sm:w-[18px] sm:h-[18px] flex-shrink-0",
        isOnline ? "text-green-600" : "text-gray-500"
      )} />
      <span className={cn(
        "text-sm sm:text-base md:text-lg font-medium whitespace-nowrap",
        isOnline ? "text-green-600" : "text-gray-500"
      )}>
        {isOnline ? 'En ligne' : 'Hors ligne'}
      </span>
      <Switch 
        checked={isOnline} 
        onCheckedChange={handleToggle}
        className={cn(
          "scale-90 sm:scale-100",
          isOnline ? "bg-green-600" : "bg-gray-400"
        )}
      />
    </div>
  );
};

export default OnlineStatusToggle;
