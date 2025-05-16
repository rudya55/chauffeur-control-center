
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/use-language";

interface PageHeaderProps {
  title: string;
  showBackButton?: boolean;
  className?: string;
  onMenuToggle?: () => void;
}

const PageHeader = ({ title, showBackButton = true, className }: PageHeaderProps) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  return (
    <div className={`flex justify-between items-center mb-6 ${className}`}>
      <div className="flex items-center gap-2">
        {/* Menu hamburger button supprimé comme demandé */}
        
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
