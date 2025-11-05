
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"
import { LanguageProvider } from "@/hooks/use-language";
import { Toaster } from "sonner";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from "@/hooks/use-auth";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppLayout from "@/layouts/AppLayout";
import Home from "@/pages/Home";
import Analytics from "@/pages/Analytics";
import Calendar from "@/pages/Calendar";
import Reservations from "@/pages/Reservations";
import Contact from "@/pages/Contact";
import Settings from "@/pages/Settings";
import Terms from "@/pages/Terms";
import Accounting from "@/pages/Accounting";
import Auth from "@/pages/Auth";
import Admin from "@/pages/Admin";
import Landing from "@/pages/Landing";
import NotFound from "@/pages/NotFound";
import ClientBooking from "@/pages/ClientBooking";
import PricingConfig from "@/pages/PricingConfig";
import NotificationTest from "@/pages/NotificationTest";
import { NotificationPermissionPrompt } from "@/components/NotificationPermissionPrompt";
import { setupForegroundMessageListener } from "@/services/firebaseNotifications";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    // Initialiser l'écoute des messages Firebase en premier plan
    setupForegroundMessageListener();
    console.log('🔔 Firebase Messaging initialized');
  }, []);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={true}
      storageKey="theme"
    >
      <Router>
        <AuthProvider>
          <LanguageProvider>
            <Routes>
              <Route path="/welcome" element={<Landing />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/booking" element={<ClientBooking />} />
              <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                <Route index element={<Home />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="calendar" element={<Calendar />} />
                <Route path="reservations" element={<Reservations />} />
                <Route path="accounting" element={<Accounting />} />
                <Route path="contact" element={<Contact />} />
                <Route path="settings" element={<Settings />} />
                <Route path="admin" element={<Admin />} />
                <Route path="pricing-config" element={<PricingConfig />} />
                <Route path="notification-test" element={<NotificationTest />} />
                <Route path="terms" element={<Terms />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
            <NotificationPermissionPrompt />
            <Toaster position="top-center" />
          </LanguageProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  )
}

export default App;
