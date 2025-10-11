
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
    <div className={`flex items-center gap-2 mb-4 sm:mb-6 ${className}`}>
      {/* Menu hamburger button */}
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => window.dispatchEvent(new CustomEvent('toggle-sidebar'))}
        className="flex-shrink-0"
      >
        <Menu className="h-5 w-5" />
      </Button>
      
      {showBackButton && (
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleGoBack} 
          className="flex-shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      )}
      
      {title && (
        <h1 className="text-xl font-bold tracking-tight truncate">
          {t(title.toLowerCase()) || title}
        </h1>
      )}
    </div>
  );
};

export default PageHeader;
