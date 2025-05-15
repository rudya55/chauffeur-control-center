
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import AppSidebar from "@/components/AppSidebar";
import MobileHeader from "@/components/MobileHeader";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "@/hooks/use-theme";
import ThemeToggle from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isMobile = useIsMobile();
  const { theme } = useTheme();

  // Listen for custom sidebar toggle events
  useEffect(() => {
    const handleToggleSidebar = () => {
      setSidebarOpen(prev => !prev);
    };

    window.addEventListener('toggle-sidebar', handleToggleSidebar);
    return () => {
      window.removeEventListener('toggle-sidebar', handleToggleSidebar);
    };
  }, []);

  return (
    <SidebarProvider>
      <div className={cn("flex flex-col h-screen w-full max-w-full", theme === 'dark' ? 'dark' : '')}>
        {isMobile ? (
          <MobileHeader 
            isOpen={sidebarOpen} 
            onToggle={() => setSidebarOpen(!sidebarOpen)}
          />
        ) : (
          <div className="h-16 border-b bg-background flex items-center px-4 justify-end">
            <ThemeToggle />
          </div>
        )}
        
        <div className="flex flex-1 overflow-hidden">
          <AppSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          
          <main className="flex-1 overflow-auto bg-background text-foreground">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
