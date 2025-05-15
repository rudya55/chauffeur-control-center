
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface MapProps {
  className?: string;
  center?: { lat: number; lng: number };
  zoom?: number;
}

const Map = ({ className, center = { lat: 48.8566, lng: 2.3522 }, zoom = 14 }: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);

  useEffect(() => {
    // Load Google Maps API
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

        mapInstanceRef.current = new window.google.maps.Map(mapRef.current, mapOptions);

        // Add a marker for the driver's position
        markerRef.current = new window.google.maps.Marker({
          position: center,
          map: mapInstanceRef.current,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#1a73e8',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          },
          title: "Votre position"
        });

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
    };

    loadMap();

    return () => {
      // Cleanup
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
  }, [center, zoom]);

  return (
    <div 
      ref={mapRef} 
      className={cn("h-full w-full rounded-lg overflow-hidden", className)} 
    />
  );
};

export default Map;
