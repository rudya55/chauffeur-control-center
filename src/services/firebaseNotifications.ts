import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { messaging } from '@/integrations/firebase/config';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

/**
 * Demander la permission pour les notifications et enregistrer le token FCM
 */
export const requestNotificationPermission = async (userId: string) => {
  try {
    // Vérifier si les notifications sont supportées
    if (!('Notification' in window)) {
      console.log('Notifications non supportées par ce navigateur');
      toast.error('Votre navigateur ne supporte pas les notifications');
      return false;
    }

    if (!messaging) {
      console.log('Firebase Messaging non initialisé');
      toast.error('Service de notifications non disponible');
      return false;
    }

    // Demander la permission
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      console.log('✅ Permission de notification accordée');
      
      // Obtenir le token FCM
      const token = await getToken(messaging, { 
        vapidKey: VAPID_KEY 
      });
      
      if (!token) {
        console.error('Impossible d\'obtenir le token FCM');
        toast.error('Erreur lors de l\'activation des notifications');
        return false;
      }
      
      console.log('📱 FCM Token obtenu:', token.substring(0, 20) + '...');
      
      // Enregistrer le token dans le profil de l'utilisateur
      const { error } = await supabase
        .from('profiles')
        .update({ fcm_token: token })
        .eq('id', userId);
      
      if (error) {
        console.error('❌ Erreur enregistrement token:', error);
        toast.error('Erreur lors de l\'enregistrement du token');
        return false;
      }
      
      console.log('✅ Token FCM enregistré dans la base de données');
      toast.success('Notifications activées avec succès');
      
      // Écouter les messages en premier plan
      setupForegroundMessageListener();
      
      return true;
    } else if (permission === 'denied') {
      console.log('❌ Permission de notification refusée');
      toast.error('Vous avez refusé les notifications. Activez-les dans les paramètres de votre navigateur.');
      return false;
    } else {
      console.log('⚠️ Permission de notification par défaut');
      return false;
    }
  } catch (error) {
    console.error('❌ Erreur demande permission:', error);
    toast.error('Erreur lors de l\'activation des notifications');
    return false;
  }
};

/**
 * Configurer l'écoute des messages en premier plan
 */
export const setupForegroundMessageListener = () => {
  if (!messaging) return;
  
  onMessage(messaging, (payload) => {
    console.log('📬 Notification reçue en premier plan:', payload);
    
    const title = payload.notification?.title || 'Nouvelle notification';
    const body = payload.notification?.body || '';
    
    // Afficher toast
    toast.info(title, {
      description: body,
      duration: 5000,
    });
    
    // Afficher notification système si permission accordée
    if (Notification.permission === 'granted') {
      const notification = new Notification(title, {
        body: body,
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        tag: payload.data?.reservationId || 'notification',
        data: payload.data,
      });
      
      // Gérer le clic sur la notification
      notification.onclick = (event) => {
        event.preventDefault();
        window.focus();
        
        // Naviguer vers la page des réservations si disponible
        if (payload.data?.reservationId) {
          window.location.href = `/reservations`;
        }
      };
    }
    
    // Jouer un son de notification
    playNotificationSound();
  });
};

/**
 * Jouer un son de notification
 */
const playNotificationSound = () => {
  try {
    const audio = new Audio('/notification-sound.mp3');
    audio.volume = 0.5;
    audio.play().catch(e => console.log('Son de notification non disponible:', e));
  } catch (e) {
    console.log('Impossible de jouer le son:', e);
  }
};

/**
 * Vérifier si les notifications sont activées
 */
export const checkNotificationPermission = (): boolean => {
  if (!('Notification' in window)) {
    return false;
  }
  return Notification.permission === 'granted';
};

/**
 * Obtenir le token FCM actuel (sans demander de permission)
 */
export const getCurrentFCMToken = async (): Promise<string | null> => {
  try {
    if (!messaging) return null;
    if (Notification.permission !== 'granted') return null;
    
    const token = await getToken(messaging, { vapidKey: VAPID_KEY });
    return token || null;
  } catch (error) {
    console.error('Erreur lors de la récupération du token:', error);
    return null;
  }
};
