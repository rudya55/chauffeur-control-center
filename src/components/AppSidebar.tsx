
import { NavLink, useLocation } from "react-router-dom";
import { 
  Home, 
  Calendar, 
  BarChart4, 
  FileText, 
  Settings,
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
  
  const menuItems = [
    { title: t("home"), url: "/", icon: Home },
    { title: t("planning"), url: "/calendar", icon: Calendar },
    { title: t("reservations"), url: "/reservations", icon: FileText },
    { title: t("accounting"), url: "/accounting", icon: FileText },
    { title: t("analytics"), url: "/analytics", icon: BarChart4 },
    { title: t("settings"), url: "/settings", icon: Settings },
    { title: t("contact"), url: "/contact", icon: Mail },
    { title: t("general_conditions"), url: "/terms", icon: FileTextIcon },
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
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
