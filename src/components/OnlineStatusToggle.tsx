
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
    <div className={cn("flex items-center px-6 py-2 bg-white rounded-full shadow-md", className)}>
      <CarTaxiFront size={18} className={cn(
        "mr-2",
        isOnline ? "text-green-600" : "text-gray-500"
      )} />
      <span className={cn(
        "text-lg font-medium",
        isOnline ? "text-green-600" : "text-gray-500"
      )}>
        {isOnline ? 'En ligne' : 'Hors ligne'}
      </span>
      <div className="flex-1"></div>
      <Switch 
        checked={isOnline} 
        onCheckedChange={handleToggle}
        className={cn(
          isOnline ? "bg-green-600" : "bg-gray-400"
        )}
      />
    </div>
  );
};

export default OnlineStatusToggle;
