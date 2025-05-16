
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MobileHeaderProps {
  isOpen: boolean;
  onToggle: () => void;
}

const MobileHeader = ({ isOpen, onToggle }: MobileHeaderProps) => {
  // Driver rating
  const driverRating = 4.8;

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static md:hidden w-full">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Toggle Menu"
        className="mr-2"
        onClick={onToggle}
      >
        <Menu className="h-5 w-5" />
      </Button>
      <div className="flex flex-1 items-center">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/profile-photo.jpg" alt="Driver" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start leading-none">
            <span className="text-sm font-medium">Jean Dupont</span>
            <div className="flex items-center">
              <span className="text-xs font-medium text-yellow-500">{driverRating}</span>
              <span className="text-xs text-yellow-500 ml-1">★</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;
