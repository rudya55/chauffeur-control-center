
import { useState } from "react";
import AppSidebar from "@/components/AppSidebar";
import MobileHeader from "@/components/MobileHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import NotificationBell from "@/components/NotificationBell";
import { SidebarProvider } from "@/components/ui/sidebar";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "@/pages/Home";
import Analytics from "@/pages/Analytics";
import Calendar from "@/pages/Calendar";
import Reservations from "@/pages/Reservations";
import Contact from "@/pages/Contact";
import Settings from "@/pages/Settings";
import Terms from "@/pages/Terms";
import NotFound from "@/pages/NotFound";

const AppLayout = () => {
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>
      <SidebarProvider>
        <div className="flex h-screen w-full">
          {!isMobile && <AppSidebar />}
          <div className="flex-1 flex flex-col overflow-hidden">
            {isMobile && (
              <div className="flex justify-between items-center px-4 py-2 border-b">
                <MobileHeader isOpen={isSidebarOpen} onToggle={toggleSidebar} />
                <div className="flex items-center gap-2">
                  <NotificationBell />
                </div>
              </div>
            )}
            <main className="flex-1 overflow-auto bg-muted/30">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/reservations" element={<Reservations />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </Router>
  );
};

export default AppLayout;
