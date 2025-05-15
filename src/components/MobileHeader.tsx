
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileHeaderProps {
  isOpen: boolean;
  onToggle: () => void;
}

const MobileHeader = ({ isOpen, onToggle }: MobileHeaderProps) => {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static md:hidden">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Toggle Menu"
        className="mr-2"
        onClick={onToggle}
      >
        <Menu className="h-5 w-5" />
      </Button>
      <div className="flex-1">
        <h1 className="text-lg font-semibold">Taxi App</h1>
      </div>
    </header>
  );
};

export default MobileHeader;
