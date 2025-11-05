import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, Messaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyDINevIQHW3nmiz1Z1nYlkbOeH3XYSsTyc",
  authDomain: "vtc-dispatch-admin.firebaseapp.com",
  projectId: "vtc-dispatch-admin",
  storageBucket: "vtc-dispatch-admin.firebasestorage.app",
  messagingSenderId: "900889515127",
  appId: "1:900889515127:web:39d7d7a40db3f728242272",
};

let app;
let messaging: Messaging | null = null;

try {
  app = initializeApp(firebaseConfig);
  // Messaging only works in secure contexts (HTTPS)
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    messaging = getMessaging(app);
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
}

export { app, messaging, getToken, onMessage };
