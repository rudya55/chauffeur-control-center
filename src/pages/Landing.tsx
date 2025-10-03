import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Car, Shield, Clock, Award } from "lucide-react";
import { useEffect, useState } from "react";

const Landing = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: Car,
      title: "Gestion optimale",
      description: "Gérez toutes vos courses en un seul endroit"
    },
    {
      icon: Shield,
      title: "Sécurisé",
      description: "Vos données sont protégées et cryptées"
    },
    {
      icon: Clock,
      title: "Gain de temps",
      description: "Automatisez votre planning et vos factures"
    },
    {
      icon: Award,
      title: "Performance",
      description: "Suivez vos statistiques en temps réel"
    }
  ];

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
            Centre de Contrôle
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Votre plateforme complète pour gérer vos courses de chauffeur professionnel
          </p>
        </div>

        {/* Features Grid avec animations échelonnées */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 max-w-6xl w-full">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 hover-scale transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 100 + 300}ms` }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Buttons avec animation */}
        <div className={`flex flex-col sm:flex-row gap-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '700ms' }}>
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

        {/* Stats avec compteurs animés */}
        <div className={`grid grid-cols-3 gap-8 mt-16 max-w-3xl w-full transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '900ms' }}>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">500+</div>
            <div className="text-sm text-muted-foreground">Chauffeurs actifs</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">10K+</div>
            <div className="text-sm text-muted-foreground">Courses réalisées</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">4.9★</div>
            <div className="text-sm text-muted-foreground">Satisfaction</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
