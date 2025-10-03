
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import AppSidebar from "@/components/AppSidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Sheet, SheetContent } from "@/components/ui/sheet";

const AppLayout = () => {
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Listen for custom events to toggle sidebar
  useEffect(() => {
    const handleToggleSidebar = () => {
      console.log("Event received: toggle-sidebar");
      setIsSidebarOpen(prev => !prev);
    };

    window.addEventListener('toggle-sidebar', handleToggleSidebar);
    
    return () => {
      window.removeEventListener('toggle-sidebar', handleToggleSidebar);
    };
  }, []);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        {/* Mobile sidebar as a sheet - only opens when toggled */}
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetContent 
            side="left" 
            className="p-0 w-[280px] max-w-[85vw] sm:w-[320px]" 
            onClick={(e) => e.stopPropagation()}
          >
            <AppSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
          </SheetContent>
        </Sheet>
        
        <div className="flex-1 flex flex-col overflow-hidden w-full">
          <main className="flex-1 overflow-y-auto overflow-x-hidden bg-muted/30 w-full">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
