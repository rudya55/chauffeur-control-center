
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
import NotFound from "@/pages/NotFound";

function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      disableTransitionOnChange
    >
      <Router>
        <AuthProvider>
          <LanguageProvider>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                <Route index element={<Home />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="calendar" element={<Calendar />} />
                <Route path="reservations" element={<Reservations />} />
                <Route path="accounting" element={<Accounting />} />
                <Route path="contact" element={<Contact />} />
                <Route path="settings" element={<Settings />} />
                <Route path="terms" element={<Terms />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
            <Toaster position="top-center" />
          </LanguageProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  )
}

export default App;
