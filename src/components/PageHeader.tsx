
import { Button } from "@/components/ui/button";
import { ArrowLeft, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/hooks/use-language";

interface PageHeaderProps {
  title: string;
  showBackButton?: boolean;
  className?: string;
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {/* Empty menu content as requested */}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default PageHeader;
