
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface NotificationBellProps {
  className?: string;
}

const NotificationBell = ({ className = "" }: NotificationBellProps) => {
  const [count, setCount] = useState(3);
  
  const handleClick = () => {
    // Reset counter on click
    setCount(0);
  };
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      className={`rounded-full p-0 border-0 relative hover:bg-transparent ${className}`}
    >
      <Bell className="h-5 w-5" />
      {count > 0 && (
        <Badge 
          variant="destructive" 
          className="absolute -top-1 -right-1 min-w-4 h-4 flex items-center justify-center p-0 text-[10px]"
        >
          {count}
        </Badge>
      )}
      <span className="sr-only">Notifications</span>
    </Button>
  );
};

export default NotificationBell;
