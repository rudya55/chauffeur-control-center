import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Geolocation } from '@capacitor/geolocation';

interface LocationGuardProps {
  children: React.ReactNode;
}

const LocationGuard = ({ children }: LocationGuardProps) => {
  const [locationStatus, setLocationStatus] = useState<'checking' | 'granted' | 'denied'>('checking');
  const navigate = useNavigate();

  useEffect(() => {
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    try {
      // Vérifier les permissions actuelles
      const permission = await Geolocation.checkPermissions();
      console.log('📍 Permission status:', permission.location);

      if (permission.location === 'granted') {
        // Permission déjà accordée → démarrer le tracking
        startLocationTracking();
      } else if (permission.location === 'denied') {
        // Permission refusée précédemment → bloquer l'accès
        setLocationStatus('denied');
      } else {
        // Permission non demandée encore → demander maintenant (popup native)
        const requestResult = await Geolocation.requestPermissions();
        console.log('📍 Permission request result:', requestResult.location);
        
        if (requestResult.location === 'granted') {
          startLocationTracking();
        } else {
          // Utilisateur a refusé → bloquer l'accès
          setLocationStatus('denied');
        }
      }
    } catch (error) {
      console.error("❌ Erreur vérification permissions:", error);
      // Fallback sur navigator.geolocation pour navigateur web
      checkLocationFallback();
    }
  };

  const checkLocationFallback = () => {
    if (!navigator.geolocation) {
      console.error("Géolocalisation non supportée");
      setLocationStatus('denied');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("✅ Localisation autorisée (fallback)");
        setLocationStatus('granted');
        storePosition(position.coords.latitude, position.coords.longitude);
        startLocationTrackingFallback();
      },
      (error) => {
        console.error("❌ Erreur géolocalisation (fallback):", error.message);
        setLocationStatus('denied');
        localStorage.removeItem('currentPosition');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const startLocationTracking = async () => {
    try {
      setLocationStatus('granted');

      // Démarrer le suivi en temps réel
      const watchId = await Geolocation.watchPosition(
        {
          enableHighAccuracy: true,
          timeout: 10000, // Délai d'attente de 10s
          maximumAge: 0 // Pas de cache
        },
        (position, err) => {
          if (err) {
            console.error("Erreur watch position:", err);
            if (err.code === 3) { // TIMEOUT
              return;
            }
            checkLocationFallback();
            return;
          }

          if (position) {
            console.log("🛰️ Position temps réel:", position.coords.latitude, position.coords.longitude);
            storePosition(position.coords.latitude, position.coords.longitude);
          }
        }
      );

      // Nettoyage au démontage du composant
      return () => {
        if (watchId) {
          Geolocation.clearWatch({ id: watchId });
        }
      };
    } catch (error) {
      console.error("❌ Erreur démarrage tracking:", error);
      checkLocationFallback();
    }
  };

  const startLocationTrackingFallback = () => {
    // Mise à jour toutes les 30 secondes
    const intervalId = setInterval(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            storePosition(position.coords.latitude, position.coords.longitude);
          },
          (error) => {
            console.error("Erreur mise à jour localisation:", error);
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          }
        );
      }
    }, 30000);

    return () => clearInterval(intervalId);
  };

  const storePosition = (lat: number, lng: number) => {
    localStorage.setItem('currentPosition', JSON.stringify({
      lat,
      lng,
      timestamp: Date.now()
    }));
  };

  const handleRetry = () => {
    setLocationStatus('checking');
    checkLocationPermission();
  };

  const handleLogout = () => {
    localStorage.removeItem('currentPosition');
    navigate('/auth');
  };

  // Affichage pendant la vérification
  if (locationStatus === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center space-y-4">
          <MapPin className="h-16 w-16 mx-auto text-primary animate-pulse" />
          <h2 className="text-2xl font-bold">Vérification de la localisation...</h2>
          <p className="text-muted-foreground">Veuillez autoriser l'accès à votre position</p>
        </div>
      </div>
    );
  }

  // Bloquer l'accès si la localisation est refusée
  if (locationStatus === 'denied') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full bg-card rounded-lg shadow-lg p-6 space-y-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="bg-destructive/10 p-4 rounded-full">
              <AlertTriangle className="h-12 w-12 text-destructive" />
            </div>
            
            <h2 className="text-2xl font-bold">Accès refusé</h2>
            
            <p className="text-muted-foreground">
              La géolocalisation est <strong>obligatoire</strong> pour utiliser cette application. 
              Vous devez autoriser l'accès à votre position pour continuer.
            </p>

            <div className="bg-muted p-4 rounded-lg text-sm text-left w-full space-y-2">
              <p className="font-semibold">Comment activer la géolocalisation :</p>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>Ouvrez les paramètres de votre téléphone</li>
                <li>Allez dans "Applications" → "VTC Dispatch"</li>
                <li>Activez "Localisation" ou "Position"</li>
                <li>Revenez ici et cliquez sur "Réessayer"</li>
              </ol>
            </div>

            <div className="flex gap-3 w-full">
              <Button 
                onClick={handleRetry}
                className="flex-1"
              >
                <MapPin className="mr-2 h-4 w-4" />
                Réessayer
              </Button>
              
              <Button 
                onClick={handleLogout}
                variant="outline"
                className="flex-1"
              >
                Se déconnecter
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Localisation accordée → afficher l'application
  return <>{children}</>;
};

export default LocationGuard;
