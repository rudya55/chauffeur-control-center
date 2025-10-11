import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useTheme as useNextTheme } from 'next-themes';
import { Menu, Plus, Minus, Navigation } from 'lucide-react';

const GOOGLE_MAPS_API_KEY = 'AIzaSyBx8F2o93lp2-zzeC-AoZwPRdR5JIuB9Lg';

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
  const markerRef = useRef<google.maps.Marker | null>(null);
  const polylineRef = useRef<google.maps.Polyline | null>(null);
  const { theme } = useNextTheme();
  const [isLoaded, setIsLoaded] = useState(false);

  // Load Google Maps API
  useEffect(() => {
    if (window.google?.maps) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = () => setIsLoaded(true);
    document.head.appendChild(script);

    return () => {
      // Cleanup is handled by the browser
    };
  }, []);

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !mapRef.current || mapInstanceRef.current) return;

    const mapStyles = theme === 'dark' ? [
      { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
      {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#263c3f" }],
      },
      {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#6b9a76" }],
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#38414e" }],
      },
      {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#212a37" }],
      },
      {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9ca5b3" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#746855" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#1f2835" }],
      },
      {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ color: "#f3d19c" }],
      },
      {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#2f3948" }],
      },
      {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#17263c" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#515c6d" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#17263c" }],
      },
    ] : [];

    const map = new google.maps.Map(mapRef.current, {
      center,
      zoom,
      styles: mapStyles,
      disableDefaultUI: true,
      zoomControl: false,
    });

    mapInstanceRef.current = map;

    // Add marker
    const marker = new google.maps.Marker({
      position: center,
      map,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: theme === 'dark' ? '#d4af37' : '#1a73e8',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2,
      },
    });
    markerRef.current = marker;

    // Handle route
    if (route && route.length > 1) {
      const polyline = new google.maps.Polyline({
        path: route,
        geodesic: true,
        strokeColor: theme === 'dark' ? '#d4af37' : '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 3,
        map,
      });
      polylineRef.current = polyline;

      // Fit bounds to show entire route
      const bounds = new google.maps.LatLngBounds();
      route.forEach(point => bounds.extend(point));
      map.fitBounds(bounds);
    } else {
      // Try to get user's location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            
            map.setCenter(userLocation);
            marker.setPosition(userLocation);
          },
          (error) => {
            console.log("Geolocation error:", error);
          }
        );
      }
    }

    return () => {
      // Cleanup
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
        polylineRef.current = null;
      }
    };
  }, [isLoaded, center.lat, center.lng, zoom, route.length]);

  // Update theme
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const mapStyles = theme === 'dark' ? [
      { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
      {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#263c3f" }],
      },
      {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#6b9a76" }],
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#38414e" }],
      },
      {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#212a37" }],
      },
      {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9ca5b3" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#746855" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#1f2835" }],
      },
      {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ color: "#f3d19c" }],
      },
      {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#2f3948" }],
      },
      {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#17263c" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#515c6d" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#17263c" }],
      },
    ] : [];

    mapInstanceRef.current.setOptions({ styles: mapStyles });

    // Update marker color
    if (markerRef.current) {
      markerRef.current.setIcon({
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: theme === 'dark' ? '#d4af37' : '#1a73e8',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2,
      });
    }

    // Update polyline color
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
          markerRef.current?.setPosition(userLocation);
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
    <div className={cn("h-full w-full rounded-lg overflow-hidden relative", className)}>
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
      
      {/* Menu toggle button */}
      <button 
        className="absolute top-3 sm:top-4 left-3 sm:left-4 z-[1000] bg-card text-foreground border p-1.5 sm:p-2 rounded-md shadow-md hover:bg-accent transition-colors"
        onClick={handleMenuToggle}
        aria-label="Toggle menu"
      >
        <Menu className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
      </button>
    </div>
  );
};

export default Map;
