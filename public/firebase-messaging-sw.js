// Service Worker pour Firebase Cloud Messaging
// Ce fichier gère les notifications push en arrière-plan

importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Important: ne commitez PAS vos clés Firebase dans ce fichier.
// Ce service worker tente d'utiliser une configuration injectée au moment du build
// via la variable globale `__FIREBASE_CONFIG__` (remplacée par CI) ou par injection
// manuelle. Si aucune config n'est fournie, le SW n'initialisera pas Firebase
// et les messages en arrière-plan seront désactivés.

let firebaseConfig = (typeof __FIREBASE_CONFIG__ !== 'undefined') ? __FIREBASE_CONFIG__ : null;

if (!firebaseConfig) {
  // Si vous souhaitez activer les notifications en background, injectez la config
  // Firebase (JSON) dans la constante __FIREBASE_CONFIG__ lors du build (CI) ou
  // copiez manuellement un fichier `firebase-messaging-sw.js` avec la config.
  console.warn('[firebase-messaging-sw] Aucune configuration Firebase fournie. Background messaging désactivé.');
} else {
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();

  // Gérer les notifications en arrière-plan
  messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    
    const notificationTitle = payload.notification?.title || 'Nouvelle course disponible';
    const notificationOptions = {
      body: payload.notification?.body || 'Une nouvelle réservation vous attend',
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      vibrate: [200, 100, 200],
      tag: 'nouvelle-course',
      requireInteraction: true,
      data: {
        url: payload.data?.url || '/reservations'
      }
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  });

  // Gérer le clic sur la notification
  self.addEventListener('notificationclick', (event) => {
    console.log('[Service Worker] Notification click received.');
    
    event.notification.close();
    
    const urlToOpen = event.notification.data?.url || '/reservations';
    
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((windowClients) => {
          for (let client of windowClients) {
            if (client.url.includes(self.location.origin) && 'focus' in client) {
              client.focus();
              client.navigate(urlToOpen);
              return;
            }
          }
          if (clients.openWindow) {
            return clients.openWindow(urlToOpen);
          }
        })
    );
  });

}

// Gérer les notifications en arrière-plan
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification.title || 'Nouvelle course disponible';
  const notificationOptions = {
    body: payload.notification.body || 'Une nouvelle réservation vous attend',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    vibrate: [200, 100, 200],
    tag: 'nouvelle-course',
    requireInteraction: true,
    data: {
      url: payload.data?.url || '/reservations'
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Gérer le clic sur la notification
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification click received.');
  
  event.notification.close();
  
  const urlToOpen = event.notification.data?.url || '/reservations';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        // Chercher si une fenêtre de l'app est déjà ouverte
        for (let client of windowClients) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.focus();
            client.navigate(urlToOpen);
            return;
          }
        }
        // Sinon ouvrir une nouvelle fenêtre
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});
