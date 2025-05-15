import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/use-theme';
import { Menu } from 'lucide-react';

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
  const { theme } = useTheme();

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
        // Set map styles based on theme
        const darkMapStyles = [
          { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
          { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
          { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
          {
            featureType: 'administrative.locality',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#d59563' }]
          },
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ color: '#38414e' }]
          },
          {
            featureType: 'road',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#212a37' }]
          },
          {
            featureType: 'road',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#9ca5b3' }]
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [{ color: '#746855' }]
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#1f2835' }]
          },
          {
            featureType: 'transit',
            elementType: 'geometry',
            stylers: [{ color: '#2f3948' }]
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#17263c' }]
          },
          {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#515c6d' }]
          }
        ];
        
        const lightMapStyles = [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ];

        const mapOptions = {
          center: center,
          zoom: zoom,
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          styles: theme === 'dark' ? darkMapStyles : lightMapStyles
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
            fillColor: theme === 'dark' ? '#d4af37' : '#1a73e8', // Gold in dark mode, blue in light mode
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
            strokeColor: theme === 'dark' ? '#d4af37' : '#FF0000', // Gold in dark mode, red in light mode
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

    // Update map when theme changes
    if (mapInstanceRef.current) {
      const styles = theme === 'dark' ? [
        { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
        { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
        // ... other dark styles
      ] : [
        { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] }
      ];
      
      mapInstanceRef.current.setOptions({ styles });
      
      if (markerRef.current) {
        markerRef.current.setIcon({
          // @ts-ignore
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: theme === 'dark' ? '#d4af37' : '#1a73e8', // Gold in dark mode, blue in light mode
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        });
      }
      
      if (polylineRef.current) {
        polylineRef.current.setOptions({
          strokeColor: theme === 'dark' ? '#d4af37' : '#FF0000' // Gold in dark mode, red in light mode
        });
      }
    }

    return () => {
      // Cleanup
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
      }
      mapInstanceRef.current = null;
      markerRef.current = null;
      polylineRef.current = null;
    };
  }, [center, zoom, route, theme]);

  // Handle menu toggle click
  const handleMenuToggle = () => {
    const event = new CustomEvent('toggle-sidebar');
    window.dispatchEvent(event);
  };

  return (
    <div 
      className={cn("h-full w-full rounded-lg overflow-hidden relative", className)} 
    >
      <div ref={mapRef} className="h-full w-full" />
      
      {/* Menu toggle button for mobile */}
      <button 
        className="absolute top-4 left-4 z-50 bg-white/80 dark:bg-background/80 p-2 rounded-md shadow-md"
        onClick={handleMenuToggle}
      >
        <Menu className="h-5 w-5 text-gray-700 dark:text-primary" />
      </button>
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
