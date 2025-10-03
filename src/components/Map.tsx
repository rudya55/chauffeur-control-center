import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useTheme as useNextTheme } from 'next-themes';
import { Menu, Plus, Minus, Navigation } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  className?: string;
  center?: { lat: number; lng: number };
  zoom?: number;
  route?: { lat: number; lng: number }[];
  onMenuToggle?: () => void;
}

// Différents types d'icônes de voiture
const carIcons = {
  sedan: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
  </svg>`,
  suv: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v9c0 1.1.9 2 2 2 0 1.66 1.34 3 3 3s3-1.34 3-3h3c0 1.66 1.34 3 3 3s3-1.34 3-3c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM9 20c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm3-12c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3 12c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
  </svg>`,
  sports: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.7 7.3l-1.4-1.4C18.1 4.7 16.3 4 14.5 4h-5C7.7 4 5.9 4.7 4.7 5.9L3.3 7.3c-.4.4-.4 1 0 1.4.4.4 1 .4 1.4 0l1.4-1.4c.8-.8 1.9-1.3 3-1.3h5c1.1 0 2.2.5 3 1.3l1.4 1.4c.4.4 1 .4 1.4 0 .4-.4.4-1 0-1.4zM20 11H4c-1.1 0-2 .9-2 2v3c0 1.1.9 2 2 2h1c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h1c1.1 0 2-.9 2-2v-3c0-1.1-.9-2-2-2zM8 19.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm8 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
  </svg>`,
  taxi: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5H15V3H9v2H6.5c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.08 3.11H5.77L6.85 7zM19 17H5v-5h14v5z"/>
    <circle cx="7.5" cy="14.5" r="1.5"/>
    <circle cx="16.5" cy="14.5" r="1.5"/>
  </svg>`
};

const Map = ({ 
  className, 
  center = { lat: 48.8566, lng: 2.3522 }, 
  zoom = 14, 
  route = [],
  onMenuToggle
}: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);
  const { theme } = useNextTheme();
  const [carType, setCarType] = useState<keyof typeof carIcons>(() => 
    (localStorage.getItem('mapCarType') as keyof typeof carIcons) || 'sedan'
  );

  // Écouter les changements du type de voiture depuis les réglages
  useEffect(() => {
    const handleCarTypeChange = () => {
      const newCarType = (localStorage.getItem('mapCarType') as keyof typeof carIcons) || 'sedan';
      setCarType(newCarType);
    };
    
    window.addEventListener('storage', handleCarTypeChange);
    window.addEventListener('carTypeChanged', handleCarTypeChange);
    
    return () => {
      window.removeEventListener('storage', handleCarTypeChange);
      window.removeEventListener('carTypeChanged', handleCarTypeChange);
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map with zoom control disabled (we'll add custom controls)
    const map = L.map(mapRef.current, { zoomControl: false }).setView([center.lat, center.lng], zoom);

    // Add tile layer based on theme
    const tileLayer = theme === 'dark'
      ? L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          maxZoom: 19
        })
      : L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19
        });

    tileLayer.addTo(map);
    mapInstanceRef.current = map;

    // Fonction pour créer l'icône de voiture
    const createCarIcon = () => {
      const color = theme === 'dark' ? '#d4af37' : '#1a73e8';
      return L.divIcon({
        html: `<div style="color: ${color}; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
          ${carIcons[carType]}
        </div>`,
        className: 'custom-car-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
    };

    // Add marker
    const marker = L.marker([center.lat, center.lng], { icon: createCarIcon() }).addTo(map);
    markerRef.current = marker;

    // Handle route
    if (route && route.length > 1) {
      const latLngs: [number, number][] = route.map(point => [point.lat, point.lng]);
      const polyline = L.polyline(latLngs, {
        color: theme === 'dark' ? '#d4af37' : '#FF0000',
        weight: 3
      }).addTo(map);
      polylineRef.current = polyline;
      
      // Fit bounds to show entire route
      map.fitBounds(polyline.getBounds());
    } else {
      // Try to get user's location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation: [number, number] = [
              position.coords.latitude,
              position.coords.longitude
            ];
            
            map.setView(userLocation, zoom);
            marker.setLatLng(userLocation);
          },
          (error) => {
            console.log("Geolocation error:", error);
          }
        );
      }
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
        polylineRef.current = null;
      }
    };
  }, [center.lat, center.lng, zoom, route.length]);

  // Update theme
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Remove old tile layer
    mapInstanceRef.current.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        mapInstanceRef.current?.removeLayer(layer);
      }
    });

    // Add new tile layer based on theme
    const tileLayer = theme === 'dark'
      ? L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          maxZoom: 19
        })
      : L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19
        });

    tileLayer.addTo(mapInstanceRef.current);

    // Update marker icon
    if (markerRef.current) {
      const color = theme === 'dark' ? '#d4af37' : '#1a73e8';
      const newCarIcon = L.divIcon({
        html: `<div style="color: ${color}; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
          ${carIcons[carType]}
        </div>`,
        className: 'custom-car-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
      markerRef.current.setIcon(newCarIcon);
    }

    // Update polyline color
    if (polylineRef.current) {
      polylineRef.current.setStyle({
        color: theme === 'dark' ? '#d4af37' : '#FF0000'
      });
    }
  }, [theme, carType]);

  const handleLocate = () => {
    if (navigator.geolocation && mapInstanceRef.current && markerRef.current) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation: [number, number] = [
            position.coords.latitude,
            position.coords.longitude
          ];
          
          mapInstanceRef.current?.setView(userLocation, 16);
          markerRef.current?.setLatLng(userLocation);
        },
        (error) => {
          console.log("Geolocation error:", error);
          alert("Impossible d'obtenir votre position. Veuillez autoriser la géolocalisation.");
        }
      );
    }
  };

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
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
      
      {/* Contrôles de zoom à droite */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        <button 
          className="bg-card text-foreground border p-2 rounded-md shadow-md hover:bg-accent transition-colors"
          onClick={handleZoomIn}
          aria-label="Zoom in"
        >
          <Plus className="h-5 w-5" />
        </button>
        <button 
          className="bg-card text-foreground border p-2 rounded-md shadow-md hover:bg-accent transition-colors"
          onClick={handleZoomOut}
          aria-label="Zoom out"
        >
          <Minus className="h-5 w-5" />
        </button>
        <button 
          className="bg-card text-foreground border p-2 rounded-md shadow-md hover:bg-accent transition-colors"
          onClick={handleLocate}
          aria-label="Me localiser"
        >
          <Navigation className="h-5 w-5" />
        </button>
      </div>
      
      {/* Menu toggle button */}
      <button 
        className="absolute top-4 left-4 z-[1000] bg-card text-foreground border p-2 rounded-md shadow-md hover:bg-accent transition-colors"
        onClick={handleMenuToggle}
        aria-label="Toggle menu"
      >
        <Menu className="h-5 w-5 text-foreground" />
      </button>
    </div>
  );
};

export default Map;
