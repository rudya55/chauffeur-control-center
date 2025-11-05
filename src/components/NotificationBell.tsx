import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

interface NotificationBellProps {
  className?: string;
}

interface Notification {
  id: string;
  message: string;
  route: string;
  time: string;
  reservationId?: string;
}

const NotificationBell = ({ className = "" }: NotificationBellProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  useEffect(() => {
    if (!user) return;
    
    // Écouter les nouvelles réservations en temps réel
    const channel = supabase
      .channel('new-reservations-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'reservations',
        },
        (payload) => {
          const reservation = payload.new as any;
          console.log('📬 Nouvelle réservation détectée:', reservation);
          
          // Ajouter une notification
          const newNotification: Notification = {
            id: reservation.id,
            message: `Nouvelle réservation: ${reservation.client_name}`,
            route: "/reservations",
            time: "À l'instant",
            reservationId: reservation.id,
          };
          
          setNotifications(prev => [newNotification, ...prev]);
          
          // Afficher un toast
          toast.success('Nouvelle réservation !', {
            description: `${reservation.client_name} - ${reservation.pickup_address}`,
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'reservations',
        },
        (payload) => {
          const reservation = payload.new as any;
          const oldReservation = payload.old as any;
          
          // Notifier uniquement si le statut change
          if (reservation.status !== oldReservation.status) {
            console.log('📝 Réservation mise à jour:', reservation);
            
            let message = '';
            switch (reservation.status) {
              case 'accepted':
                message = `Course acceptée: ${reservation.client_name}`;
                break;
              case 'in_progress':
                message = `Course en cours: ${reservation.client_name}`;
                break;
              case 'completed':
                message = `Course terminée: ${reservation.client_name}`;
                break;
              case 'cancelled':
                message = `Course annulée: ${reservation.client_name}`;
                break;
              default:
                message = `Mise à jour: ${reservation.client_name}`;
            }
            
            const newNotification: Notification = {
              id: `${reservation.id}-${Date.now()}`,
              message: message,
              route: "/reservations",
              time: "À l'instant",
              reservationId: reservation.id,
            };
            
            setNotifications(prev => [newNotification, ...prev]);
          }
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleNotificationClick = (route: string, notificationId: string) => {
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
