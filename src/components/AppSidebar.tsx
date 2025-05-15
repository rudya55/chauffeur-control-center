
import { NavLink, useLocation } from "react-router-dom";
import { 
  Home, 
  Calendar, 
  BarChart4, 
  FileText, 
  Settings, 
  LogOut,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

interface AppSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const AppSidebar = ({ isOpen = false, onClose }: AppSidebarProps) => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const menuItems = [
    { title: "Accueil", url: "/", icon: Home },
    { title: "Réservations", url: "/reservations", icon: Calendar },
    { title: "Comptabilité", url: "/accounting", icon: FileText },
    { title: "Analyse", url: "/analytics", icon: BarChart4 },
    { title: "Paramètres", url: "/settings", icon: Settings },
  ];

  const handleNavLinkClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  const getNavClasses = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex items-center gap-3 p-2 rounded-md w-full",
      isActive 
        ? "bg-primary/10 text-primary font-medium" 
        : "hover:bg-muted/50 text-foreground/80"
    );

  return (
    <Sidebar
      className={cn(
        "border-r transition-all duration-300",
        isMobile 
          ? isOpen ? "translate-x-0" : "-translate-x-full fixed z-50 h-full" 
          : collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <div className={cn("flex items-center", collapsed && !isMobile && "hidden")}>
          <span className="text-xl font-bold text-primary">Taxi App</span>
        </div>
        {!isMobile && <SidebarTrigger className="ml-2" />}
      </div>

      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={getNavClasses}
                      onClick={handleNavLinkClick}
                    >
                      <item.icon className="h-5 w-5" />
                      {(!collapsed || isMobile) && (
                        <span>{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto pt-4 border-t">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button 
                    className="flex items-center gap-3 p-2 text-destructive hover:bg-muted/50 rounded-md w-full"
                    onClick={() => alert("Déconnexion")}
                  >
                    <LogOut className="h-5 w-5" />
                    {(!collapsed || isMobile) && <span>Déconnexion</span>}
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
