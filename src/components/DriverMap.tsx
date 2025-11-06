import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DriverMapProps {
  driverId?: string;
  className?: string;
}

interface DriverLocation {
  latitude: number;
  longitude: number;
  updated_at: string;
}

const DriverMap = ({ driverId, className = "" }: DriverMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initMap = async () => {
      try {
        // Charger le script Google Maps
        if (!window.google) {
          const script = document.createElement('script');
          const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
          if (!key) throw new Error('VITE_GOOGLE_MAPS_API_KEY manquante. Voir .env.example');
          script.src = `https://maps.googleapis.com/maps/api/js?key=${key}`;
          script.async = true;
          script.defer = true;
          document.head.appendChild(script);
          
          await new Promise((resolve) => {
            script.onload = resolve;
          });
        }

        if (!mapRef.current) return;

        // Position par défaut (Paris)
        const defaultPosition = { lat: 48.8566, lng: 2.3522 };

        mapInstanceRef.current = new google.maps.Map(mapRef.current, {
          center: defaultPosition,
          zoom: 13,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        });

        // Créer un marqueur pour le chauffeur
        markerRef.current = new google.maps.Marker({
          map: mapInstanceRef.current,
          position: defaultPosition,
          title: 'Chauffeur',
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#4F46E5',
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 2,
          },
        });

        // Charger la position du chauffeur si un ID est fourni
        if (driverId) {
          loadDriverLocation(driverId);
          subscribeToLocationUpdates(driverId);
        }
      } catch (err) {
        console.error('Erreur lors du chargement de Google Maps:', err);
        setError('Erreur lors du chargement de la carte');
      }
    };

    initMap();

    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
    };
  }, [driverId]);

  const loadDriverLocation = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('latitude, longitude')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data && (data as any).latitude && (data as any).longitude) {
        updateMarkerPosition({
          latitude: (data as any).latitude,
          longitude: (data as any).longitude,
          updated_at: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error('Erreur lors du chargement de la position:', err);
    }
  };

  const subscribeToLocationUpdates = (id: string) => {
    const channel = supabase
      .channel(`driver-location-${id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${id}`,
        },
        (payload) => {
          const newData = payload.new as any;
          if (newData.latitude && newData.longitude) {
            updateMarkerPosition({
              latitude: newData.latitude,
              longitude: newData.longitude,
              updated_at: newData.updated_at,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const updateMarkerPosition = (location: DriverLocation) => {
    if (!mapInstanceRef.current || !markerRef.current) return;

    const position = {
      lat: location.latitude,
      lng: location.longitude,
    };

    markerRef.current.setPosition(position);
    mapInstanceRef.current.panTo(position);
  };

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-muted rounded-lg ${className}`}>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div ref={mapRef} className="w-full h-full rounded-lg shadow-lg" />
    </div>
  );
};

export default DriverMap;
