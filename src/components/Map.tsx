import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useTheme as useNextTheme } from 'next-themes';
import { Menu, Plus, Minus, Navigation } from 'lucide-react';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const MAP_FEATURE_ENABLED = true; // Enabled: Google Maps will load when a valid API key is present

// (MAP_FEATURE_ENABLED already declared above)

declare global {
  interface Window {
    google: typeof google;
    initMap: () => void;
  }
}

interface MapProps {
  className?: string;
  center?: { lat: number; lng: number };
  zoom?: number;
  route?: { lat: number; lng: number }[];
  onMenuToggle?: () => void;
}

const Map = ({ 
  className, 
  center = { lat: 48.8566, lng: 2.3522 }, 
  zoom = 14, 
  route = [],
  onMenuToggle
}: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<(google.maps.marker.AdvancedMarkerElement | google.maps.Marker) | null>(null);
  const polylineRef = useRef<google.maps.Polyline | null>(null);
  const { theme } = useNextTheme();
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [carIcon, setCarIcon] = useState('sedan'); // Default car type
  const [mapError, setMapError] = useState<string | null>(null);

  if (!MAP_FEATURE_ENABLED) {
    return (
      <div className={cn("h-full w-full overflow-hidden relative", className)}>
        <div className="h-full w-full bg-muted flex flex-col items-center justify-center gap-2 text-center p-6">
          <h2 className="text-lg font-semibold">Carte désactivée temporairement</h2>
          <p className="text-sm text-muted-foreground max-w-sm">
            L'intégration Google Maps est coupée pour les tests. Réactive-la en remettant
            <code className="mx-1 rounded bg-muted px-1">MAP_FEATURE_ENABLED = false</code>
            dans <code>src/components/Map.tsx</code> et en fournissant une clé API valide.
          </p>
        </div>
      </div>
    );
  }

  const isAdvancedMarkerElement = (marker: unknown): marker is google.maps.marker.AdvancedMarkerElement => {
    return Boolean(marker && typeof marker === 'object' && 'content' in (marker as Record<string, unknown>));
  };

  const updateMarkerPosition = (
    marker: google.maps.marker.AdvancedMarkerElement | google.maps.Marker,
    position: google.maps.LatLngLiteral
  ) => {
    if (marker instanceof google.maps.marker.AdvancedMarkerElement) {
      marker.position = position;
    } else {
      marker.setPosition(position);
    }
  };

  // Get car emoji based on car type
  const getCarEmoji = (carType: string) => {
    switch (carType) {
      case 'sedan': return '🚗';
      case 'suv': return '🚙';
      case 'sports': return '🏎️';
      case 'taxi': return '🚕';
      default: return '🚗';
    }
  };

  // Get user's current position from localStorage (updated by LocationGuard)
  useEffect(() => {
    // Get car type from localStorage
    const storedCarType = localStorage.getItem('mapCarType');
    if (storedCarType) {
      setCarIcon(storedCarType);
    }
    
    // Listen for car type changes
    const handleCarTypeChange = () => {
      const newCarType = localStorage.getItem('mapCarType');
      if (newCarType) {
        setCarIcon(newCarType);
      }
    };
    
    window.addEventListener('carTypeChanged', handleCarTypeChange);
    return () => window.removeEventListener('carTypeChanged', handleCarTypeChange);
  }, []);

  // Get user's current position from localStorage (updated by LocationGuard)
  useEffect(() => {
    const updatePositionFromStorage = () => {
      const storedPosition = localStorage.getItem('currentPosition');
      if (storedPosition) {
        try {
          const { lat, lng, timestamp } = JSON.parse(storedPosition);
          // Only use position if it's less than 2 minutes old
          if (Date.now() - timestamp < 120000) {
            setCurrentPosition({ lat, lng });
            console.log('Position mise à jour depuis localStorage:', { lat, lng });
            return;
          }
        } catch (error) {
          console.error('Erreur parsing position:', error);
        }
      }
      
      // Fallback: get position directly
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setCurrentPosition(pos);
            console.log('Position obtenue directement:', pos);
          },
          (error) => {
            console.error('Erreur géolocalisation:', error);
            setCurrentPosition(center); // Use default if geolocation fails
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );
      } else {
        console.warn('Géolocalisation non supportée');
        setCurrentPosition(center);
      }
    };

    updatePositionFromStorage();

    // Update position when localStorage changes
    const intervalId = setInterval(updatePositionFromStorage, 5000);
    
    return () => clearInterval(intervalId);
  }, [center]);

  // Load Google Maps API
  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (window.google?.maps) {
        setIsLoaded(true);
        return;
      }

      if (document.querySelector('script[src*="maps.googleapis.com"]')) {
        // Si le script est déjà en cours de chargement, on attend qu'il soit prêt
        const interval = setInterval(() => {
          if (window.google?.maps) {
            setIsLoaded(true);
            clearInterval(interval);
          }
        }, 100);
        return;
      }

      if (!GOOGLE_MAPS_API_KEY) {
        const message = "La clé API Google Maps est manquante. Vérifiez votre fichier .env.";
        console.error(message);
        setMapError(message);
        return;
      }

      // Créer le script tag pour charger Google Maps
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=geometry,marker&callback=initMap`;
      script.async = true;
      script.defer = true;
      
      script.onerror = (error) => {
        const message = "Erreur de chargement Google Maps. Vérifiez la clé API et les restrictions Google Cloud.";
        console.error(message, error);
        setMapError(message);
      };

      window.initMap = () => {
        console.log('Google Maps API chargée avec succès via callback');
        setIsLoaded(true);
        setMapError(null);
      };

      document.head.appendChild(script);
    };

    loadGoogleMapsScript();
  }, []);

  // Initialize map
  useEffect(() => {
  if (mapError || !isLoaded || !mapRef.current || mapInstanceRef.current) return;

    const mapStyles = theme === 'dark' ? [
      { elementType: "geometry", stylers: [{ color: "#1a2332" }] }, // Fond de carte principal
      { elementType: "labels.text.stroke", stylers: [{ color: "#1a2332" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
      {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d4af37" }], // Noms de villes en or
      },
      { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
      { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#263c3f" }] },
      { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#6b9a76" }] },
      { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
      { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
      { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
      { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#d4af37" }] }, // Autoroutes en or
      { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1a2332" }] },
      { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#f3d19c" }] },
      { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2f3948" }] },
      { featureType: "transit.station", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
      { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
      { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
      { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] },
    ] : [];

    // Use currentPosition if available, otherwise use center prop
    const initialCenter = currentPosition || center;
    
    try {
      const map = new window.google.maps.Map(mapRef.current, {
        center: initialCenter,
        zoom,
        styles: mapStyles,
        disableDefaultUI: true,
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        gestureHandling: 'greedy',
        clickableIcons: false,
      });

      mapInstanceRef.current = map;

      // Utiliser AdvancedMarkerElement quand disponible, sinon basculer sur Marker classique
      if (window.google?.maps?.marker?.AdvancedMarkerElement) {
        const markerElement = document.createElement('div');
        markerElement.className = "text-4xl"; // Taille de l'emoji
        markerElement.innerText = getCarEmoji(carIcon);

        const advancedMarker = new window.google.maps.marker.AdvancedMarkerElement({
          position: initialCenter,
          map,
          content: markerElement,
        });
        markerRef.current = advancedMarker;
      } else {
        const fallbackMarker = new window.google.maps.Marker({
          position: initialCenter,
          map,
          label: {
            text: getCarEmoji(carIcon),
            fontSize: '28px',
          },
        });
        // Icône transparente pour n'afficher que l'emoji
        fallbackMarker.setIcon({
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 0,
        });

        markerRef.current = fallbackMarker;
      }

    // Handle route
    if (route && route.length > 1) {
      const polyline = new window.google.maps.Polyline({
        path: route,
        geodesic: true,
        strokeColor: theme === 'dark' ? '#d4af37' : '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 3,
        map,
      });
      polylineRef.current = polyline;

      const bounds = new window.google.maps.LatLngBounds();
      route.forEach(point => bounds.extend(point));
      map.fitBounds(bounds);
    }
    } catch (error) {
      const message = "Impossible d'initialiser Google Maps. Vérifiez la clé API et l'état du service.";
      console.error(message, error);
      setMapError(message);
    }
  }, [isLoaded, currentPosition, theme, mapError, carIcon, route]); // Dépendances mises à jour

  // Update map center when currentPosition changes
  useEffect(() => {
    if (!mapInstanceRef.current || !currentPosition) return;
    mapInstanceRef.current.setCenter(currentPosition);
  }, [currentPosition]);

  // Update marker position and icon when they change
  useEffect(() => {
    if (!markerRef.current || !isLoaded) return;

    if (isAdvancedMarkerElement(markerRef.current)) {
      if (currentPosition) {
        updateMarkerPosition(markerRef.current, currentPosition);
      }
      const markerContent = markerRef.current.content as HTMLElement;
      if (markerContent) {
        markerContent.innerText = getCarEmoji(carIcon);
      }
    } else {
      if (currentPosition) {
        updateMarkerPosition(markerRef.current as google.maps.Marker, currentPosition);
      }
      markerRef.current.setLabel?.({
        text: getCarEmoji(carIcon),
        fontSize: '28px',
      });
    }
  }, [currentPosition, carIcon, isLoaded]);

  // Update theme
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const mapStyles = theme === 'dark' ? [
      { elementType: "geometry", stylers: [{ color: "#1a2332" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#1a2332" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
      { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d4af37" }] },
      { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
      { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#263c3f" }] },
      { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#6b9a76" }] },
      { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
      { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
      { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
      { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#d4af37" }] },
      { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1a2332" }] },
      { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#f3d19c" }] },
      { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2f3948" }] },
      { featureType: "transit.station", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
      { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
      { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
      { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] },
    ] : [];

    mapInstanceRef.current.setOptions({ styles: mapStyles });

    if (polylineRef.current) {
      polylineRef.current.setOptions({
        strokeColor: theme === 'dark' ? '#d4af37' : '#FF0000'
      });
    }
  }, [theme]);

  const handleLocate = () => {
    if (mapError) {
      alert(mapError);
      return;
    }

    if (navigator.geolocation && mapInstanceRef.current && markerRef.current) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          mapInstanceRef.current?.setCenter(userLocation);
          mapInstanceRef.current?.setZoom(16);
          if (markerRef.current) {
            updateMarkerPosition(markerRef.current, userLocation);
          }
        },
        (error) => {
          console.log("Geolocation error:", error);
          alert("Impossible d'obtenir votre position. Veuillez autoriser la géolocalisation.");
        }
      );
    }
  };

  const handleZoomIn = () => {
    if (mapError) {
      alert(mapError);
      return;
    }

    if (mapInstanceRef.current) {
      const currentZoom = mapInstanceRef.current.getZoom() || 14;
      mapInstanceRef.current.setZoom(currentZoom + 1);
    }
  };

  const handleZoomOut = () => {
    if (mapError) {
      alert(mapError);
      return;
    }

    if (mapInstanceRef.current) {
      const currentZoom = mapInstanceRef.current.getZoom() || 14;
      mapInstanceRef.current.setZoom(currentZoom - 1);
    }
  };

  const handleMenuToggle = () => {
    if (onMenuToggle) {
      onMenuToggle();
    } else {
      const event = new CustomEvent('toggle-sidebar');
      window.dispatchEvent(event);
    }
  };

  return (
    <div className={cn("h-full w-full overflow-hidden relative", className)}>
      <div ref={mapRef} className="h-full w-full" />

      {mapError && (
        <div className="absolute inset-0 z-[1000] flex flex-col items-center justify-center bg-background/95 p-6 text-center">
          <h2 className="text-lg font-semibold text-destructive mb-2">Erreur Google Maps</h2>
          <p className="text-sm text-muted-foreground max-w-md">
            {mapError}<br />
            Vérifiez les restrictions de la clé sur Google Cloud (HTTP referrers et Android SHA-1) puis actualisez.
          </p>
        </div>
      )}
      
      {/* Contrôles de zoom à droite - responsive */}
      <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-[1000] flex flex-col gap-1.5 sm:gap-2">
        <button 
          className="bg-card text-foreground border p-1.5 sm:p-2 rounded-md shadow-md hover:bg-accent transition-colors"
          onClick={handleZoomIn}
          aria-label="Zoom in"
        >
          <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
        <button 
          className="bg-card text-foreground border p-1.5 sm:p-2 rounded-md shadow-md hover:bg-accent transition-colors"
          onClick={handleZoomOut}
          aria-label="Zoom out"
        >
          <Minus className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
        <button 
          className="bg-card text-foreground border p-1.5 sm:p-2 rounded-md shadow-md hover:bg-accent transition-colors"
          onClick={handleLocate}
          aria-label="Me localiser"
        >
          <Navigation className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      </div>
    </div>
  );
};

export default Map;
