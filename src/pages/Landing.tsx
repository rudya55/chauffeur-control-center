import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-md w-full">
        <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
          VTC Dispatch
        </h1>
        
        <Button 
          size="lg" 
          className="text-lg px-8 py-6 rounded-xl shadow-lg w-full"
          onClick={() => navigate('/auth')}
        >
          <LogIn className="mr-2 h-5 w-5" />
          Connexion
        </Button>
      </div>
    </div>
  );
};

export default Landing;
