import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { MapPin, Users, Luggage, Clock, DollarSign, Car, CreditCard } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const vehicleTypes = [
  { value: "standard", label: "Standard", icon: "🚗", capacity: 4, description: "Voiture confortable" },
  { value: "berline", label: "Berline", icon: "🚙", capacity: 4, description: "Véhicule haut de gamme" },
  { value: "van", label: "Van", icon: "🚐", capacity: 7, description: "Pour groupes" },
  { value: "mini-bus", label: "Mini-bus", icon: "🚌", capacity: 15, description: "Grands groupes" },
  { value: "first-class", label: "First Class", icon: "✨", capacity: 3, description: "Luxe premium" }
];

export default function ClientBooking() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [zones, setZones] = useState<any[]>([]);
  const [pickupZone, setPickupZone] = useState("");
  const [destinationZone, setDestinationZone] = useState("");
  const [vehicleType, setVehicleType] = useState("standard");
  const [passengers, setPassengers] = useState(1);
  const [luggage, setLuggage] = useState(0);
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [clientName, setClientName] = useState("");
  const [phone, setPhone] = useState("");
  const [showBookingForm, setShowBookingForm] = useState(true);

  useEffect(() => {
    fetchZones();
    initializeMap();
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (pickupZone && destinationZone && vehicleType) {
      calculatePrice();
      updateMapRoute();
    }
  }, [pickupZone, destinationZone, vehicleType]);

  const initializeMap = () => {
    if (!mapRef.current) return;

    const map = L.map(mapRef.current).setView([48.8566, 2.3522], 12);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    mapInstanceRef.current = map;
  };

  const updateMapRoute = () => {
    if (!mapInstanceRef.current || !pickupZone || !destinationZone) return;

    const pickup = zones.find(z => z.id === pickupZone);
    const destination = zones.find(z => z.id === destinationZone);

    if (pickup?.coordinates && destination?.coordinates) {
      const bounds = L.latLngBounds([
        [pickup.coordinates.lat, pickup.coordinates.lng],
        [destination.coordinates.lat, destination.coordinates.lng]
      ]);
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });

      // Clear existing markers
      mapInstanceRef.current.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          layer.remove();
        }
      });

      // Add markers
      const pickupIcon = L.divIcon({
        html: '<div style="background: #10b981; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white;"></div>',
        className: 'custom-marker',
        iconSize: [24, 24]
      });

      const destIcon = L.divIcon({
        html: '<div style="background: #ef4444; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white;"></div>',
        className: 'custom-marker',
        iconSize: [24, 24]
      });

      L.marker([pickup.coordinates.lat, pickup.coordinates.lng], { icon: pickupIcon }).addTo(mapInstanceRef.current!);
      L.marker([destination.coordinates.lat, destination.coordinates.lng], { icon: destIcon }).addTo(mapInstanceRef.current!);
    }
  };

  const fetchZones = async () => {
    const { data, error } = await supabase
      .from("geographic_zones")
      .select("*")
      .order("name");

    if (error) {
      toast.error("Erreur lors du chargement des zones");
      return;
    }
    setZones(data || []);
  };

  const calculatePrice = async () => {
    // Check for airport package first
    const { data: packageData } = await supabase
      .from("airport_packages")
      .select("*")
      .eq("airport_zone_id", pickupZone)
      .eq("destination_zone_id", destinationZone)
      .eq("vehicle_type", vehicleType)
      .eq("active", true)
      .maybeSingle();

    if (packageData) {
      setEstimatedPrice(Number(packageData.flat_rate));
      return;
    }

    // Otherwise use pricing rules
    const { data: priceData } = await supabase
      .from("pricing_rules")
      .select("*")
      .eq("zone_from_id", pickupZone)
      .eq("zone_to_id", destinationZone)
      .eq("vehicle_type", vehicleType)
      .eq("active", true)
      .maybeSingle();

    if (priceData) {
      setEstimatedPrice(Number(priceData.base_price));
    } else {
      setEstimatedPrice(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clientName || !phone) {
      toast.error("Veuillez remplir votre nom et téléphone");
      return;
    }

    setLoading(true);

    try {
      const pickupZoneData = zones.find(z => z.id === pickupZone);
      const destinationZoneData = zones.find(z => z.id === destinationZone);

      const { error } = await supabase.from("reservations").insert({
        client_name: clientName,
        pickup_address: pickupZoneData?.name || "",
        destination: destinationZoneData?.name || "",
        phone,
        date: new Date().toISOString(),
        dispatcher: "Web Booking",
        vehicle_type: vehicleType,
        passengers,
        luggage,
        amount: estimatedPrice || 0,
        driver_amount: estimatedPrice ? estimatedPrice * 0.7 : 0,
        commission: estimatedPrice ? estimatedPrice * 0.3 : 0,
        payment_type: "card",
        status: "pending"
      });

      if (error) throw error;

      toast.success("🎉 Réservation confirmée! Un chauffeur vous sera assigné dans quelques instants.");
      setShowBookingForm(false);
    } catch (error) {
      toast.error("Erreur lors de la création de la réservation");
    } finally {
      setLoading(false);
    }
  };

  if (!showBookingForm) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-6 space-y-4">
            <div className="w-20 h-20 bg-green-500 rounded-full mx-auto flex items-center justify-center">
              <Car className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold">Réservation confirmée!</h2>
            <p className="text-muted-foreground">
              Nous recherchons un chauffeur pour vous. Vous recevrez une notification dès qu'un chauffeur acceptera votre course.
            </p>
            <Button onClick={() => {
              setShowBookingForm(true);
              setPickupZone("");
              setDestinationZone("");
              setEstimatedPrice(null);
              setClientName("");
              setPhone("");
            }} className="w-full">
              Nouvelle réservation
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold">🚕 FastTransport</h1>
          <p className="text-sm opacity-90">Votre chauffeur en quelques clics</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Map Section */}
        <div className="lg:w-1/2 h-64 lg:h-auto relative">
          <div ref={mapRef} className="absolute inset-0" />
        </div>

        {/* Booking Form Section */}
        <div className="lg:w-1/2 p-4 lg:p-8 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
            {/* Vehicle Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Choisissez votre véhicule</label>
              <div className="grid grid-cols-2 gap-3">
                {vehicleTypes.map((vType) => (
                  <button
                    key={vType.value}
                    type="button"
                    onClick={() => setVehicleType(vType.value)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      vehicleType === vType.value
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="text-3xl mb-2">{vType.icon}</div>
                    <div className="font-medium text-sm">{vType.label}</div>
                    <div className="text-xs text-muted-foreground">{vType.description}</div>
                    <div className="text-xs mt-1 flex items-center gap-1 justify-center">
                      <Users className="w-3 h-3" />
                      {vType.capacity}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Location Selection */}
            <div className="space-y-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-green-500" />
                <select
                  value={pickupZone}
                  onChange={(e) => setPickupZone(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-border focus:border-primary outline-none bg-background"
                  required
                >
                  <option value="">Point de départ</option>
                  {zones.map((zone) => (
                    <option key={zone.id} value={zone.id}>
                      {zone.name} ({zone.zone_type})
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-red-500" />
                <select
                  value={destinationZone}
                  onChange={(e) => setDestinationZone(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-border focus:border-primary outline-none bg-background"
                  required
                >
                  <option value="">Destination</option>
                  {zones.map((zone) => (
                    <option key={zone.id} value={zone.id}>
                      {zone.name} ({zone.zone_type})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Passengers & Luggage */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Passagers
                </label>
                <Input
                  type="number"
                  min="1"
                  max="20"
                  value={passengers}
                  onChange={(e) => setPassengers(Number(e.target.value))}
                  className="text-center"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Luggage className="w-4 h-4" />
                  Bagages
                </label>
                <Input
                  type="number"
                  min="0"
                  max="20"
                  value={luggage}
                  onChange={(e) => setLuggage(Number(e.target.value))}
                  className="text-center"
                />
              </div>
            </div>

            {/* Client Info */}
            <div className="space-y-4">
              <Input
                placeholder="Votre nom"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required
              />
              <Input
                placeholder="Numéro de téléphone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            {/* Price Display */}
            {estimatedPrice !== null && (
              <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-primary" />
                      <span className="font-medium">Prix estimé</span>
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      {estimatedPrice.toFixed(2)} €
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Arrivée estimée: 5-10 min</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full h-14 text-lg font-semibold" 
              size="lg" 
              disabled={loading || !estimatedPrice || !pickupZone || !destinationZone}
            >
              {loading ? (
                "Confirmation..."
              ) : (
                <span className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Confirmer la réservation
                </span>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
