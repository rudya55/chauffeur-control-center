// Service Worker pour Firebase Cloud Messaging
// Ce fichier gère les notifications push en arrière-plan

importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Configuration Firebase
firebase.initializeApp({
  apiKey: "AIzaSyDINevIQHW3nmiz1Z1nYlkbOeH3XYSsTyc",
  authDomain: "vtc-dispatch-admin.firebaseapp.com",
  projectId: "vtc-dispatch-admin",
  storageBucket: "vtc-dispatch-admin.firebasestorage.app",
  messagingSenderId: "900889515127",
  appId: "1:900889515127:web:39d7d7a40db3f728242272"
});

const messaging = firebase.messaging();

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
