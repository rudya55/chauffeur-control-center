
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NotificationBellProps {
  className?: string;
}

const NotificationBell = ({ className = "" }: NotificationBellProps) => {
  const navigate = useNavigate();
  type NotificationItem = { id: number; message: string; route: string; time: string };
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  
  const handleNotificationClick = (route: string, notificationId: number) => {
    // Supprimer la notification cliquée
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    // Naviguer vers la page
    navigate(route);
  };
  
  const clearAll = () => {
    setNotifications([]);
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`rounded-full p-0 border-0 relative hover:bg-transparent ${className}`}
        >
          <Bell className="h-5 w-5" />
          {notifications.length > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 min-w-4 h-4 flex items-center justify-center p-0 text-[10px]"
            >
              {notifications.length}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-2 py-1.5 border-b">
          <span className="text-sm font-semibold">Notifications</span>
          {notifications.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAll} className="h-6 text-xs">
              Tout effacer
            </Button>
          )}
        </div>
        {notifications.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            Aucune notification
          </div>
        ) : (
          notifications.map((notif) => (
            <DropdownMenuItem
              key={notif.id}
              onClick={() => handleNotificationClick(notif.route, notif.id)}
              className="flex flex-col items-start gap-1 cursor-pointer p-3"
            >
              <span className="text-sm font-medium">{notif.message}</span>
              <span className="text-xs text-muted-foreground">{notif.time}</span>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell;
