
import { NavLink, useLocation } from "react-router-dom";
import { 
  Home, 
  Calendar, 
  BarChart4, 
  FileText, 
  Settings, 
  LogOut,
  Menu,
  Mail,
  FileText as FileTextIcon
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface AppSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const AppSidebar = ({ isOpen = false, onClose }: AppSidebarProps) => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Driver information
  const driverName = "Jean Dupont";
  const driverRating = 4.8;
  
  const menuItems = [
    { title: "Accueil", url: "/", icon: Home },
    { title: "Réservations", url: "/reservations", icon: Calendar },
    { title: "Comptabilité", url: "/accounting", icon: FileText },
    { title: "Analyse", url: "/analytics", icon: BarChart4 },
    { title: "Paramètres", url: "/settings", icon: Settings },
    { title: "Nous contacter", url: "/contact", icon: Mail },
    { title: "Conditions générales", url: "/terms", icon: FileTextIcon },
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
      <div className="flex flex-col p-4 border-b">
        {(!collapsed || isMobile) && (
          <div className="flex flex-col items-center mb-2">
            <Avatar className="h-16 w-16 mb-2">
              <AvatarImage src="/profile-photo.jpg" alt="Driver" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <h3 className="font-medium text-base">{driverName}</h3>
            <div className="flex items-center">
              <span className="text-sm font-medium text-yellow-500">{driverRating}</span>
              <span className="text-sm text-yellow-500 ml-1">★</span>
            </div>
          </div>
        )}
        {!isMobile && <SidebarTrigger className="ml-auto" />}
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
