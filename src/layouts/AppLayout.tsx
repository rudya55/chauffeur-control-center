
import { useState } from "react";
import { Outlet } from "react-router-dom";
import AppSidebar from "@/components/AppSidebar";
import MobileHeader from "@/components/MobileHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import NotificationBell from "@/components/NotificationBell";

const AppLayout = () => {
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen">
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
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
