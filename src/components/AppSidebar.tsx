
import { NavLink, useLocation } from "react-router-dom";
import { 
  Home, 
  Calendar, 
  BarChart4, 
  FileText, 
  Settings,
  Mail,
  FileText as FileTextIcon,
  MoreVertical
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
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { useLanguage } from "@/hooks/use-language";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

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

  // Function to handle demo actions
  const handleMenuAction = (action: string) => {
    toast.success(`Action "${action}" clicked`);
  };

  return (
    <div className="h-full flex flex-col bg-background border-r">
      <div className="flex flex-col p-4 border-b">
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
      </div>

      <SidebarContent className="p-2 flex-1">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <div className="flex items-center justify-between w-full">
                    <SidebarMenuButton asChild className="flex-grow">
                      <NavLink 
                        to={item.url} 
                        end 
                        className={getNavClasses}
                        onClick={handleNavLinkClick}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-2 hover:bg-muted rounded-md">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleMenuAction("Option 1")}>
                          Option 1
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleMenuAction("Option 2")}>
                          Option 2
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleMenuAction("Option 3")}>
                          Option 3
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </div>
  );
};

export default AppSidebar;
