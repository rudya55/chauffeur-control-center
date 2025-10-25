import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Capacitor } from '@capacitor/core';
import { initializeNotifications } from './services/notificationService';

// Initialiser les notifications si on est sur une plateforme native (Android/iOS)
if (Capacitor.isNativePlatform()) {
  initializeNotifications().catch(console.error);
}

createRoot(document.getElementById("root")!).render(<App />);
