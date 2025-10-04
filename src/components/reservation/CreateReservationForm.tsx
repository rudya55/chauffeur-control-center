import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CreateReservationFormProps {
  onSuccess?: () => void;
}

const CreateReservationForm = ({ onSuccess }: CreateReservationFormProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    clientName: "",
    phone: "",
    pickupAddress: "",
    destination: "",
    date: "",
    flightNumber: "",
    passengers: "1",
    luggage: "0",
    vehicleType: "standard",
    paymentType: "card",
    amount: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const amount = parseFloat(formData.amount);
      const commission = amount * 0.20; // 20% commission
      const driverAmount = amount - commission;

      const { error } = await supabase.from("reservations").insert({
        client_name: formData.clientName,
        phone: formData.phone,
        pickup_address: formData.pickupAddress,
        destination: formData.destination,
        date: new Date(formData.date).toISOString(),
        flight_number: formData.flightNumber || null,
        passengers: parseInt(formData.passengers),
        luggage: parseInt(formData.luggage),
        vehicle_type: formData.vehicleType,
        payment_type: formData.paymentType,
        amount,
        driver_amount: driverAmount,
        commission,
        dispatcher: "Admin",
        dispatcher_logo: "👤",
        status: "pending",
      });

      if (error) throw error;

      toast.success("Réservation créée avec succès !");
      
      // Reset form
      setFormData({
        clientName: "",
        phone: "",
        pickupAddress: "",
        destination: "",
        date: "",
        flightNumber: "",
        passengers: "1",
        luggage: "0",
        vehicleType: "standard",
        paymentType: "card",
        amount: "",
      });

      onSuccess?.();
    } catch (error) {
      console.error("Error creating reservation:", error);
      toast.error("Erreur lors de la création de la réservation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="clientName">Nom du client</Label>
          <Input
            id="clientName"
            value={formData.clientName}
            onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="pickupAddress">Adresse de prise en charge</Label>
          <Input
            id="pickupAddress"
            value={formData.pickupAddress}
            onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="destination">Destination</Label>
          <Input
            id="destination"
            value={formData.destination}
            onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Date et heure</Label>
          <Input
            id="date"
            type="datetime-local"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="flightNumber">Numéro de vol (optionnel)</Label>
          <Input
            id="flightNumber"
            value={formData.flightNumber}
            onChange={(e) => setFormData({ ...formData, flightNumber: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="passengers">Passagers</Label>
          <Input
            id="passengers"
            type="number"
            min="1"
            value={formData.passengers}
            onChange={(e) => setFormData({ ...formData, passengers: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="luggage">Bagages</Label>
          <Input
            id="luggage"
            type="number"
            min="0"
            value={formData.luggage}
            onChange={(e) => setFormData({ ...formData, luggage: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="vehicleType">Type de véhicule</Label>
          <Select
            value={formData.vehicleType}
            onValueChange={(value) => setFormData({ ...formData, vehicleType: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="berline">Berline</SelectItem>
              <SelectItem value="first-class">First Class</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="paymentType">Mode de paiement</Label>
          <Select
            value={formData.paymentType}
            onValueChange={(value) => setFormData({ ...formData, paymentType: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="card">Carte</SelectItem>
              <SelectItem value="cash">Espèces</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Montant (€)</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            required
          />
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Création..." : "Créer la réservation"}
      </Button>
    </form>
  );
};

export default CreateReservationForm;