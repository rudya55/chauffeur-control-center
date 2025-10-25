import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';
import { supabase } from '@/integrations/supabase/client';

/**
 * Service de notifications push et locales pour l'app mobile
 * Gère l'enregistrement FCM, la sauvegarde des tokens et l'écoute des changements de réservations
 */

// Initialiser les notifications push (FCM)
export const initializePushNotifications = async () => {
  if (!Capacitor.isNativePlatform()) {
    console.log('Push notifications only available on native platforms');
    return;
  }

  try {
    // Demander permission
    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== 'granted') {
      console.warn('Push notification permission not granted');
      return;
    }

    // Enregistrer l'appareil pour recevoir push notifications
    await PushNotifications.register();

    // Écouter l'événement de registration (obtention du token FCM)
    PushNotifications.addListener('registration', async (token) => {
      console.log('Push registration success, token:', token.value);
      await saveTokenToDatabase(token.value);
    });

    // Écouter les erreurs d'enregistrement
    PushNotifications.addListener('registrationError', (error) => {
      console.error('Error on push registration:', error);
    });

    // Écouter les notifications reçues quand l'app est au premier plan
    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Push notification received (foreground):', notification);
      // Afficher une notification locale pour être visible même en foreground
      LocalNotifications.schedule({
        notifications: [
          {
            title: notification.title || 'Nouvelle notification',
            body: notification.body || '',
            id: Date.now(),
            schedule: { at: new Date(Date.now() + 100) },
            sound: undefined,
            attachments: undefined,
            actionTypeId: '',
            extra: notification.data,
          },
        ],
      });
    });

    // Écouter les clics sur les notifications
    PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
      console.log('Push notification action performed:', notification);
      // Gérer la navigation selon notification.data si nécessaire
    });

  } catch (error) {
    console.error('Error initializing push notifications:', error);
  }
};

// Sauvegarder le token FCM dans Supabase
const saveTokenToDatabase = async (token: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.warn('No authenticated user, cannot save FCM token');
      return;
    }

    // Upsert: met à jour le token si l'utilisateur existe déjà, sinon crée
    // Note: Cast temporaire en attendant la régénération des types après migration
    const { error } = await (supabase as any)
      .from('fcm_tokens')
      .upsert(
        { user_id: user.id, token },
        { onConflict: 'user_id' }
      );

    if (error) {
      console.error('Error saving FCM token to database:', error);
    } else {
      console.log('FCM token saved successfully');
    }
  } catch (error) {
    console.error('Error saving FCM token:', error);
  }
};

// Initialiser les notifications locales
export const initializeLocalNotifications = async () => {
  if (!Capacitor.isNativePlatform()) {
    console.log('Local notifications only available on native platforms');
    return;
  }

  try {
    // Demander permission pour les notifications locales
    let permStatus = await LocalNotifications.checkPermissions();

    if (permStatus.display === 'prompt') {
      permStatus = await LocalNotifications.requestPermissions();
    }

    if (permStatus.display !== 'granted') {
      console.warn('Local notification permission not granted');
      return;
    }

    // Écouter les clics sur les notifications locales
    LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
      console.log('Local notification action performed:', notification);
      // Gérer navigation si nécessaire
    });

  } catch (error) {
    console.error('Error initializing local notifications:', error);
  }
};

// Écouter les nouvelles réservations en temps réel et afficher une notification
export const listenForNewReservations = () => {
  if (!Capacitor.isNativePlatform()) {
    console.log('Realtime notifications only available on native platforms');
    return;
  }

  const channel = supabase
    .channel('new-reservations')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'reservations',
      },
      (payload) => {
        console.log('New reservation detected:', payload);
        const reservation = payload.new as any;

        // Afficher notification locale
        LocalNotifications.schedule({
          notifications: [
            {
              title: 'Nouvelle réservation',
              body: `${reservation.client_name} - ${reservation.pickup_address} → ${reservation.destination}`,
              id: Date.now(),
              schedule: { at: new Date(Date.now() + 100) },
              sound: undefined,
              attachments: undefined,
              actionTypeId: '',
              extra: { reservationId: reservation.id },
            },
          ],
        });
      }
    )
    .subscribe();

  return channel;
};

// Fonction principale d'initialisation (à appeler au démarrage de l'app)
export const initializeNotifications = async () => {
  console.log('Initializing notifications...');
  await initializePushNotifications();
  await initializeLocalNotifications();
  listenForNewReservations();
  console.log('Notifications initialized');
};
