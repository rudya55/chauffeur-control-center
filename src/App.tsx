
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"
import { LanguageProvider } from "@/hooks/use-language";
import { Toaster } from "sonner";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from "@/layouts/AppLayout";
import Home from "@/pages/Home";
import Analytics from "@/pages/Analytics";
import Calendar from "@/pages/Calendar";
import Reservations from "@/pages/Reservations";
import Contact from "@/pages/Contact";
import Settings from "@/pages/Settings";
import Terms from "@/pages/Terms";
import NotFound from "@/pages/NotFound";
import Accounting from "@/pages/Accounting";
import Login from "@/pages/Login";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AuthProvider } from "@/hooks/use-auth";

function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Router>
        <AuthProvider>
          <LanguageProvider>
            <Routes>
              {/* Page de connexion accessible sans authentification */}
              <Route path="/login" element={<Login />} />
              
              {/* Routes protégées nécessitant une authentification */}
              <Route path="/" element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Home />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="calendar" element={<Calendar />} />
                <Route path="reservations" element={<Reservations />} />
                <Route path="contact" element={<Contact />} />
                <Route path="accounting" element={<Accounting />} />
                <Route path="settings" element={<Settings />} />
                <Route path="terms" element={<Terms />} />
                <Route path="*" element={<NotFound />} />
              </Route>
              
              {/* Redirection vers la page de connexion pour les routes inconnues */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
            <Toaster position="top-center" />
          </LanguageProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  )
}

export default App;
