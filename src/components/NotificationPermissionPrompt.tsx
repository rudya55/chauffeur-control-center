import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { requestNotificationPermission, checkNotificationPermission } from '@/services/firebaseNotifications';

export const NotificationPermissionPrompt = () => {
  const { user } = useAuth();
  const [showPrompt, setShowPrompt] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Vérifier si on doit afficher le prompt
    const checkPermission = () => {
      if (!user) return;
      
      // Ne pas afficher si déjà accordée
      if (checkNotificationPermission()) {
        setShowPrompt(false);
        return;
      }
      
      // Ne pas afficher si l'utilisateur a déjà refusé (stocké dans localStorage)
      const dismissed = localStorage.getItem('notification-prompt-dismissed');
      if (dismissed === 'true') {
        setShowPrompt(false);
        return;
      }
      
      // Afficher le prompt après 3 secondes
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    };
    
    checkPermission();
  }, [user]);

  const handleEnable = async () => {
    if (!user) return;
    
    setIsLoading(true);
    const success = await requestNotificationPermission(user.id);
    setIsLoading(false);
    
    if (success) {
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('notification-prompt-dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md animate-in slide-in-from-bottom-5">
      <Card className="p-4 shadow-lg border-primary/20">
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <Bell className="h-5 w-5 text-primary" />
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-sm mb-1">
              Activez les notifications
            </h3>
            <p className="text-xs text-muted-foreground mb-3">
              Recevez des alertes instantanées pour vos nouvelles courses et mises à jour importantes
            </p>
            
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleEnable}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? 'Activation...' : 'Activer'}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleDismiss}
                disabled={isLoading}
              >
                Plus tard
              </Button>
            </div>
          </div>
          
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6"
            onClick={handleDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};
