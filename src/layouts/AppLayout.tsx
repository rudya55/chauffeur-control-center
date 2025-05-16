
import { useState } from "react";
import { Outlet } from "react-router-dom";
import AppSidebar from "@/components/AppSidebar";
import MobileHeader from "@/components/MobileHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import NotificationBell from "@/components/NotificationBell";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Sheet, SheetContent } from "@/components/ui/sheet";

const AppLayout = () => {
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    console.log("Toggling sidebar, current state:", isSidebarOpen);
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        {/* Desktop sidebar - only visible on desktop */}
        {!isMobile && <AppSidebar />}
        
        {/* Mobile sidebar as a sheet - only opens when toggled */}
        {isMobile && (
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetContent side="left" className="p-0 w-[85%]" onClick={(e) => e.stopPropagation()}>
              <div className="h-full">
                <AppSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>
        )}
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile header with hamburger menu */}
          {isMobile && (
            <div className="flex justify-between items-center w-full border-b">
              <MobileHeader isOpen={isSidebarOpen} onToggle={toggleSidebar} />
              <div className="flex items-center gap-2 pr-4">
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
