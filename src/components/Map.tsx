import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useTheme as useNextTheme } from 'next-themes';
import { Menu, Car } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);
  const { theme } = useNextTheme();

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView([center.lat, center.lng], zoom);

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

    // Create custom car icon
    const carIcon = L.divIcon({
      html: `<div style="
        width: 40px; 
        height: 40px; 
        display: flex; 
        align-items: center; 
        justify-content: center;
        background: ${theme === 'dark' ? '#d4af37' : '#1a73e8'};
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
          <circle cx="7" cy="17" r="2"/>
          <path d="M9 17h6"/>
          <circle cx="17" cy="17" r="2"/>
        </svg>
      </div>`,
      className: 'custom-car-marker',
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });

    // Add marker
    const marker = L.marker([center.lat, center.lng], { icon: carIcon }).addTo(map);
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
      const carIcon = L.divIcon({
        html: `<div style="
          width: 40px; 
          height: 40px; 
          display: flex; 
          align-items: center; 
          justify-content: center;
          background: ${theme === 'dark' ? '#d4af37' : '#1a73e8'};
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        ">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
            <circle cx="7" cy="17" r="2"/>
            <path d="M9 17h6"/>
            <circle cx="17" cy="17" r="2"/>
          </svg>
        </div>`,
        className: 'custom-car-marker',
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });
      markerRef.current.setIcon(carIcon);
    }

    // Update polyline color
    if (polylineRef.current) {
      polylineRef.current.setStyle({
        color: theme === 'dark' ? '#d4af37' : '#FF0000'
      });
    }
  }, [theme]);

  // Handle menu toggle click
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
