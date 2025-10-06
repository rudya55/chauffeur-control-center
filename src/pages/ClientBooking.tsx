import { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/use-language";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { MapPin, Calendar, Users, Luggage } from "lucide-react";

export default function ClientBooking() {
  const { t } = useLanguage();
  const [zones, setZones] = useState<any[]>([]);
  const [pickupZone, setPickupZone] = useState("");
  const [destinationZone, setDestinationZone] = useState("");
  const [vehicleType, setVehicleType] = useState("standard");
  const [passengers, setPassengers] = useState(1);
  const [luggage, setLuggage] = useState(0);
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchZones();
  }, []);

  useEffect(() => {
    if (pickupZone && destinationZone && vehicleType) {
      calculatePrice();
    }
  }, [pickupZone, destinationZone, vehicleType]);

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
    setLoading(true);

    try {
      const pickupZoneData = zones.find(z => z.id === pickupZone);
      const destinationZoneData = zones.find(z => z.id === destinationZone);

      const { error } = await supabase.from("reservations").insert({
        client_name: "Client Web",
        pickup_address: pickupZoneData?.name || "",
        destination: destinationZoneData?.name || "",
        phone: "",
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

      toast.success("Réservation créée avec succès!");
      // Reset form
      setPickupZone("");
      setDestinationZone("");
      setEstimatedPrice(null);
    } catch (error) {
      toast.error("Erreur lors de la création de la réservation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Réservation en ligne
          </h1>
          <p className="text-muted-foreground">Réservez votre course en quelques clics</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Détails de la course</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Point de départ
                  </label>
                  <Select value={pickupZone} onValueChange={setPickupZone} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      {zones.map((zone) => (
                        <SelectItem key={zone.id} value={zone.id}>
                          {zone.name} ({zone.zone_type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Destination
                  </label>
                  <Select value={destinationZone} onValueChange={setDestinationZone} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      {zones.map((zone) => (
                        <SelectItem key={zone.id} value={zone.id}>
                          {zone.name} ({zone.zone_type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Type de véhicule
                  </label>
                  <Select value={vehicleType} onValueChange={setVehicleType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="berline">Berline</SelectItem>
                      <SelectItem value="van">Van</SelectItem>
                      <SelectItem value="mini-bus">Mini-bus</SelectItem>
                      <SelectItem value="first-class">First Class</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

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
                  />
                </div>
              </div>

              {estimatedPrice !== null && (
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">Prix estimé</p>
                      <p className="text-4xl font-bold text-primary">
                        {estimatedPrice.toFixed(2)} €
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Button type="submit" className="w-full" size="lg" disabled={loading || !estimatedPrice}>
                {loading ? "Création..." : "Réserver maintenant"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
