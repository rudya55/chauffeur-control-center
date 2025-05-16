
import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AppSidebar from "@/components/AppSidebar";
import MobileHeader from "@/components/MobileHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import NotificationBell from "@/components/NotificationBell";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { Sheet, SheetContent } from "@/components/ui/sheet";

const AppLayout = () => {
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("AppLayout useEffect, isAuthenticated:", isAuthenticated);
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  console.log("AppLayout render, isAuthenticated:", isAuthenticated);

  if (!isAuthenticated) {
    console.log("AppLayout rendering null due to not authenticated");
    return null;
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        {!isMobile && <AppSidebar />}
        
        {isMobile && (
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetContent side="left" className="w-64 p-0" onClick={(e) => e.stopPropagation()}>
              <AppSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            </SheetContent>
          </Sheet>
        )}
        
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
    </SidebarProvider>
  );
};

export default AppLayout;
