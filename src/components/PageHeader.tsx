
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

  const handleMenuToggle = () => {
    console.log("Toggling sidebar from PageHeader");
    // Trigger sidebar toggle event
    const event = new CustomEvent('toggle-sidebar');
    window.dispatchEvent(event);
    
    if (onMenuToggle) {
      onMenuToggle();
    }
  };
  
  return (
    <div className={`flex justify-between items-center mb-6 ${className}`}>
      <div className="flex items-center gap-2">
        {/* Menu hamburger button */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleMenuToggle}
          className="mr-2"
          aria-label="Toggle Menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        {showBackButton && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleGoBack} 
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <h1 className="text-2xl font-bold tracking-tight">{t(title.toLowerCase()) || title}</h1>
      </div>
    </div>
  );
};

export default PageHeader;
