
import { NavLink, useLocation } from "react-router-dom";
import { 
  Home, 
  Calendar, 
  BarChart4, 
  FileText, 
  Settings, 
  LogOut,
  Mail,
  FileText as FileTextIcon,
  User,
  CreditCard,
  ShieldCheck,
  Bell
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
import { useEffect, useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { useLanguage } from "@/hooks/use-language";

interface AppSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const AppSidebar = ({ isOpen = false, onClose }: AppSidebarProps) => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const isMobile = useIsMobile();
  const [avatarUrl, setAvatarUrl] = useState("/profile-photo.jpg");
  const { t } = useLanguage();
  
  // Driver information
  const driverName = "Jean Dupont";
  const driverRating = 4.8;
  
  // Make sure we're handling nested translation objects properly
  const getTranslation = (key: string): string => {
    const value = t(key);
    return typeof value === 'string' ? value : key;
  };
  
  const menuItems = [
    { title: getTranslation("home"), url: "/", icon: Home },
    { title: getTranslation("reservations"), url: "/reservations", icon: Calendar },
    { title: getTranslation("accounting"), url: "/accounting", icon: FileText },
    { title: getTranslation("analytics"), url: "/analytics", icon: BarChart4 },
    { title: getTranslation("settings"), url: "/settings", icon: Settings },
    { title: "Nous contacter", url: "/contact", icon: Mail },
    { title: "Conditions générales", url: "/terms", icon: FileTextIcon },
  ];

  // Settings submenu items
  const settingsSubmenuItems = [
    { title: getTranslation("settings_section.tabs.profile"), url: "/settings/profile", icon: User },
    { title: getTranslation("settings_section.tabs.documents"), url: "/settings/documents", icon: FileText },
    { title: getTranslation("settings_section.tabs.payments"), url: "/settings/payments", icon: CreditCard },
    { title: getTranslation("settings_section.tabs.security"), url: "/settings/security", icon: ShieldCheck },
    { title: getTranslation("settings_section.tabs.notifications"), url: "/settings/notifications", icon: Bell },
  ];

  const handleNavLinkClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
    }
  };

  const getNavClasses = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex items-center gap-3 p-2 rounded-md w-full",
      isActive 
        ? "bg-primary/10 text-primary font-medium" 
        : "hover:bg-muted/50 text-foreground/80"
    );

  // Check if current path is a settings page
  const isSettingsPage = location.pathname.startsWith('/settings');

  return (
    <Sidebar
      className={cn(
        "border-r transition-all duration-300",
        isMobile 
          ? isOpen ? "translate-x-0" : "-translate-x-full fixed z-50 h-full" 
          : collapsed ? "w-16" : "w-64",
        isOpen && isMobile ? "translate-x-0" : isMobile ? "-translate-x-full" : ""
      )}
    >
      <div className="flex flex-col p-4 border-b">
        {(!collapsed || isMobile) && (
          <Dialog>
            <DialogTrigger asChild>
              <div className="flex flex-col items-center mb-2 cursor-pointer">
                <Avatar className="h-16 w-16 mb-2">
                  <AvatarImage src={avatarUrl} alt="Driver" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <h3 className="font-medium text-base">{driverName}</h3>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-yellow-500">{driverRating}</span>
                  <span className="text-sm text-yellow-500 ml-1">★</span>
                </div>
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Modifier votre photo de profil</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={avatarUrl} alt="Driver" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-2 w-full">
                  <label 
                    htmlFor="profile-upload" 
                    className="cursor-pointer bg-primary text-white py-2 px-4 rounded text-center"
                  >
                    Choisir une photo
                  </label>
                  <input 
                    id="profile-upload" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>
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

        {/* Settings submenu - only visible when on settings pages */}
        {isSettingsPage && (!collapsed || isMobile) && (
          <SidebarGroup className="mt-2 pt-2 border-t">
            <SidebarGroupLabel>{getTranslation("settings_section.title")}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {settingsSubmenuItems.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        className={getNavClasses}
                        onClick={handleNavLinkClick}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

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
                    {(!collapsed || isMobile) && <span>{typeof t("logout") === 'string' ? t("logout") : "Déconnexion"}</span>}
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
