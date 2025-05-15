import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const polylineRef = useRef<any>(null);

  useEffect(() => {
    // Load Google Maps API script
    const loadMap = () => {
      if (!window.google) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBInRJxBA3-aLlx6o7Np8Mic0yXHLnaFQE&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = initMap;
        document.head.appendChild(script);
      } else {
        initMap();
      }
    };

    // Initialize the map
    const initMap = () => {
      if (mapRef.current && window.google) {
        const mapOptions = {
          center: center,
          zoom: zoom,
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }]
            }
          ]
        };

        // @ts-ignore
        mapInstanceRef.current = new window.google.maps.Map(mapRef.current, mapOptions);

        // Add a marker for the driver's position
        // @ts-ignore
        markerRef.current = new window.google.maps.Marker({
          position: center,
          map: mapInstanceRef.current,
          icon: {
            // @ts-ignore
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#1a73e8',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          },
          title: "Position"
        });

        // Si nous avons un itinéraire, on affiche une polyline
        if (route && route.length > 1) {
          const path = route.map(point => ({ lat: point.lat, lng: point.lng }));
          
          // @ts-ignore
          polylineRef.current = new window.google.maps.Polyline({
            path: path,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 3
          });
          
          polylineRef.current.setMap(mapInstanceRef.current);
          
          // Ajuster la vue pour inclure tout l'itinéraire
          // @ts-ignore
          const bounds = new window.google.maps.LatLngBounds();
          path.forEach(point => bounds.extend(point));
          mapInstanceRef.current.fitBounds(bounds);
        } else {
          // Try to get user's location
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const userLocation = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
                };
                
                if (mapInstanceRef.current && markerRef.current) {
                  mapInstanceRef.current.setCenter(userLocation);
                  markerRef.current.setPosition(userLocation);
                }
              },
              () => {
                console.log("Error: The Geolocation service failed.");
              }
            );
          }
        }
      }
    };

    loadMap();

    return () => {
      // Cleanup
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
      }
      mapInstanceRef.current = null;
      markerRef.current = null;
      polylineRef.current = null;
    };
  }, [center, zoom, route]);

  return (
    <div 
      className={cn("h-full w-full rounded-lg overflow-hidden relative", className)} 
    >
      <div ref={mapRef} className="h-full w-full" />
      
      {/* Menu toggle button */}
      {onMenuToggle && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-4 left-4 bg-white shadow-md rounded-md z-10"
          onClick={onMenuToggle}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      )}
    </div>
  );
};

// Add the missing google type definition for TypeScript
declare global {
  interface Window {
    google: any;
  }
}

export default Map;
