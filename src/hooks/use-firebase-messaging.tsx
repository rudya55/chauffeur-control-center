import { useEffect, useState } from 'react';
import { onMessage } from 'firebase/messaging';
import { messaging } from '@/integrations/firebase/config';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { requestNotificationPermission } from '@/services/firebaseNotifications2';

export const useFirebaseMessaging = (userId: string | undefined) => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if (!messaging || !userId) return;

    // Utiliser la méthode centralisée qui vérifie les préférences du profil
    (async () => {
      try {
        const granted = await requestNotificationPermission(userId);
        setNotificationPermission(granted ? 'granted' : Notification.permission);
        if (granted) {
          // requestNotificationPermission enregistre déjà le token et démarre l'écoute en premier plan
          // onMessage listener ci-dessous reste pour affichage local
        }
      } catch (error) {
        console.error('Erreur lors de la demande de permission centralisée:', error);
      }
    })();

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
