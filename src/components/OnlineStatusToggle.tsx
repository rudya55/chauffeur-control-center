
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';

interface OnlineStatusToggleProps {
  className?: string;
}

const OnlineStatusToggle = ({ className }: OnlineStatusToggleProps) => {
  const [isOnline, setIsOnline] = useState(false);

  const handleToggle = (checked: boolean) => {
    setIsOnline(checked);
  };

  return (
    <div className={cn("flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm", className)}>
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium">Status</span>
        <span className={cn(
          "text-lg font-semibold",
          isOnline ? "text-secondary" : "text-destructive"
        )}>
          {isOnline ? 'En ligne' : 'Hors ligne'}
        </span>
      </div>
      <div className="flex-1"></div>
      <Switch 
        checked={isOnline} 
        onCheckedChange={handleToggle}
        className={cn(
          isOnline ? "bg-secondary" : "bg-destructive"
        )}
      />
    </div>
  );
};

export default OnlineStatusToggle;
