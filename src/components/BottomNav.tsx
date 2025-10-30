import { NavLink } from "react-router-dom";
import { 
  Home,
  Calendar, 
  FileText, 
  Wallet,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/use-language";

const BottomNav = () => {
  const { t } = useLanguage();
  
  const navItems = [
    { title: t("home"), url: "/", icon: Home },
    { title: t("planning"), url: "/calendar", icon: Calendar },
    { title: t("reservations"), url: "/reservations", icon: FileText },
    { title: t("accounting"), url: "/accounting", icon: Wallet },
    { title: t("settings"), url: "/settings", icon: Settings },
  ];

  const getNavClasses = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-colors min-w-0 flex-1",
      isActive 
        ? "bg-primary/10 text-primary" 
        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
    );

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg z-50 safe-bottom">
      <div className="flex items-center justify-around px-2 py-2 max-w-screen-lg mx-auto">
        {navItems.map((item) => (
          <NavLink 
            key={item.url}
            to={item.url} 
            end 
            className={getNavClasses}
          >
            <item.icon className="h-6 w-6 flex-shrink-0" />
            <span className="text-[10px] font-medium truncate max-w-full">{item.title}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
