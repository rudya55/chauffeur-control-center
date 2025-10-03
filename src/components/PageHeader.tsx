
import { Button } from "@/components/ui/button";
import { ArrowLeft, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/use-language";

interface PageHeaderProps {
  title: string;
  showBackButton?: boolean;
  className?: string;
  onMenuToggle?: () => void;
}

const PageHeader = ({ title, showBackButton = true, className, onMenuToggle }: PageHeaderProps) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  return (
    <div className={`flex justify-between items-center mb-4 sm:mb-6 ${className}`}>
      <div className="flex items-center gap-1 sm:gap-2 min-w-0 flex-1">
        {/* Menu hamburger button - toujours visible */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => window.dispatchEvent(new CustomEvent('toggle-sidebar'))}
          className="p-2 hover:bg-accent rounded-md transition-colors flex-shrink-0"
        >
          <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>
        
        {showBackButton && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleGoBack} 
            className="mr-1 sm:mr-2 flex-shrink-0"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        )}
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight truncate">
          {t(title.toLowerCase()) || title}
        </h1>
      </div>
    </div>
  );
};

export default PageHeader;
