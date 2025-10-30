import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useTheme as useNextTheme } from 'next-themes';
import { Menu, Plus, Minus, Navigation } from 'lucide-react';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyDINevIQHW3nmiz1Z1nYlkbOeH3XYSsTyc';

declare global {
  interface Window {
    google: typeof google;
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
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const polylineRef = useRef<google.maps.Polyline | null>(null);
  const { theme } = useNextTheme();
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [carIcon, setCarIcon] = useState('sedan'); // Default car type

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
    const loadGoogleMapsScript = async () => {
      if (window.google?.maps) {
        setIsLoaded(true);
        return;
      }

      try {
        // Utiliser l'importation dynamique de l'API JS Loader
        const { Loader } = await import('@googlemaps/js-api-loader');
        const loader = new Loader({
          apiKey: GOOGLE_MAPS_API_KEY,
          version: "weekly",
          libraries: ["geometry", "marker"] // Ajout de la bibliothèque "marker"
        });

        await loader.load();
        console.log('Google Maps API chargée avec succès via JS API Loader');
        setIsLoaded(true);
      } catch (error) {
        console.error('Erreur de chargement Google Maps:', error);
      }
    };

    loadGoogleMapsScript();
  }, []);

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !mapRef.current || mapInstanceRef.current) return;

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

    // Utiliser AdvancedMarkerElement pour de meilleures performances
    const markerElement = document.createElement('div');
    markerElement.className = "text-4xl"; // Taille de l'emoji
    markerElement.innerText = getCarEmoji(carIcon);

    const marker = new window.google.maps.marker.AdvancedMarkerElement({
      position: initialCenter,
      map,
      content: markerElement,
    });
    markerRef.current = marker;

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
  }, [isLoaded, currentPosition, theme]); // Dépendances mises à jour

  // Update map center when currentPosition changes
  useEffect(() => {
    if (!mapInstanceRef.current || !currentPosition) return;
    mapInstanceRef.current.setCenter(currentPosition);
  }, [currentPosition]);

  // Update marker position and icon when they change
  useEffect(() => {
    if (!markerRef.current || !isLoaded) return;

    if (currentPosition) {
      markerRef.current.position = currentPosition;
    }
    
    const markerContent = markerRef.current.content as HTMLElement;
    if (markerContent) {
      markerContent.innerText = getCarEmoji(carIcon);
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
            markerRef.current.position = userLocation;
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
    if (mapInstanceRef.current) {
      const currentZoom = mapInstanceRef.current.getZoom() || 14;
      mapInstanceRef.current.setZoom(currentZoom + 1);
    }
  };

  const handleZoomOut = () => {
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
