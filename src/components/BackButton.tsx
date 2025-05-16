
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface BackButtonProps {
  className?: string;
}

const BackButton = ({ className }: BackButtonProps) => {
  const navigate = useNavigate();
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={handleGoBack}
      className={className}
      aria-label="Go back"
    >
      <ArrowLeft className="h-5 w-5" />
    </Button>
  );
};

export default BackButton;
