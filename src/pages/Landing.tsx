import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Car } from "lucide-react";
import { useEffect, useState } from "react";

const Landing = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        {/* Logo / Title avec animation */}
        <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 mb-6 bg-primary/10 rounded-full animate-scale-in">
            <Car className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            Espace Chauffeur
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Connectez-vous pour accéder à votre espace professionnel
          </p>
        </div>


        {/* CTA Buttons avec animation */}
        <div className={`flex flex-col sm:flex-row gap-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '300ms' }}>
          <Button 
            size="lg" 
            className="text-lg px-8 py-6 rounded-xl hover-scale shadow-lg"
            onClick={() => navigate('/auth')}
          >
            Commencer maintenant
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="text-lg px-8 py-6 rounded-xl hover-scale"
            onClick={() => navigate('/auth')}
          >
            Se connecter
          </Button>
        </div>

      </div>
    </div>
  );
};

export default Landing;
