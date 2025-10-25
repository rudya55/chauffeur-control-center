import { useEffect, useState } from 'react';
import { messaging, getToken, onMessage } from '@/integrations/firebase/config';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const useFirebaseMessaging = (userId: string | undefined) => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if (!messaging || !userId) return;

    const requestPermission = async () => {
      try {
        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);

        if (permission === 'granted') {
          const token = await getToken(messaging, {
            vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
          });

          if (token) {
            console.log('FCM Token:', token);
            setFcmToken(token);

            // Stocker le token dans Supabase
            await supabase
              .from('profiles')
              .update({ fcm_token: token })
              .eq('id', userId);

            toast.success('Notifications activées avec succès');
          }
        } else {
          toast.error('Permission de notification refusée');
        }
      } catch (error) {
        console.error('Erreur lors de la demande de permission:', error);
        toast.error('Erreur lors de l\'activation des notifications');
      }
    };

    requestPermission();

    // Écouter les messages en temps réel quand l'app est ouverte
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Message reçu:', payload);
      
      toast.info(payload.notification?.title || 'Nouvelle notification', {
        description: payload.notification?.body,
      });

      // Jouer un son de notification
      const audio = new Audio('/notification-sound.mp3');
      audio.play().catch(e => console.log('Son non disponible:', e));
    });

    return () => {
      unsubscribe();
    };
  }, [userId]);

  return { fcmToken, notificationPermission };
};
