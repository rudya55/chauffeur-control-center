
import { Button } from "@/components/ui/button";
import { Menu, MoreVertical } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import NotificationBell from "@/components/NotificationBell";
import { useLanguage } from "@/hooks/use-language";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface ReservationHeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

const ReservationHeader = ({ isSidebarOpen, setIsSidebarOpen }: ReservationHeaderProps) => {
  const { t } = useLanguage();
  
  const handleAction = (action: string) => {
    toast.success(`Action "${action}" clicked`);
  };
  
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold tracking-tight">{t("reservations")}</h1>
      
      <div className="flex items-center gap-2">
        <NotificationBell />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <MoreVertical className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleAction("Option 1")}>
              Option 1
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAction("Option 2")}>
              Option 2
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAction("Option 3")}>
              Option 3
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <div className="py-4">
              <h2 className="text-lg font-medium mb-4">{t("menu")}</h2>
              <nav className="space-y-2">
                <a href="/" className="block px-4 py-2 hover:bg-muted rounded-md">{t("home")}</a>
                <a href="/reservations" className="block px-4 py-2 bg-muted rounded-md font-medium">{t("reservations")}</a>
                <a href="/accounting" className="block px-4 py-2 hover:bg-muted rounded-md">{t("accounting")}</a>
                <a href="/analytics" className="block px-4 py-2 hover:bg-muted rounded-md">{t("analytics")}</a>
                <a href="/settings" className="block px-4 py-2 hover:bg-muted rounded-md">{t("settings")}</a>
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default ReservationHeader;
