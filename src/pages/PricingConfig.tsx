import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, MapPin, DollarSign } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import PageHeader from "@/components/PageHeader";

export default function PricingConfig() {
  const [zones, setZones] = useState<any[]>([]);
  const [pricingRules, setPricingRules] = useState<any[]>([]);
  const [airportPackages, setAirportPackages] = useState<any[]>([]);
  const [showZoneDialog, setShowZoneDialog] = useState(false);
  const [showPriceDialog, setShowPriceDialog] = useState(false);
  const [showPackageDialog, setShowPackageDialog] = useState(false);

  // Zone form state
  const [zoneName, setZoneName] = useState("");
  const [zoneType, setZoneType] = useState("city");
  const [zoneDescription, setZoneDescription] = useState("");
  const [zoneLat, setZoneLat] = useState("");
  const [zoneLng, setZoneLng] = useState("");

  // Pricing rule form state
  const [priceName, setPriceName] = useState("");
  const [priceZoneFrom, setPriceZoneFrom] = useState("");
  const [priceZoneTo, setPriceZoneTo] = useState("");
  const [priceVehicleType, setPriceVehicleType] = useState("standard");
  const [basePrice, setBasePrice] = useState("");
  const [isFlatRate, setIsFlatRate] = useState(true);
  const [priceActive, setPriceActive] = useState(true);

  // Airport package form state
  const [packageName, setPackageName] = useState("");
  const [airportZone, setAirportZone] = useState("");
  const [packageDestZone, setPackageDestZone] = useState("none");
  const [packageVehicleType, setPackageVehicleType] = useState("standard");
  const [flatRate, setFlatRate] = useState("");
  const [waitingTime, setWaitingTime] = useState("30");
  const [packageActive, setPackageActive] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [zonesRes, pricesRes, packagesRes] = await Promise.all([
      supabase.from("geographic_zones").select("*").order("name"),
      supabase.from("pricing_rules").select("*, zone_from:geographic_zones!zone_from_id(name), zone_to:geographic_zones!zone_to_id(name)"),
      supabase.from("airport_packages").select("*, airport:geographic_zones!airport_zone_id(name), destination:geographic_zones!destination_zone_id(name)")
    ]);

    if (zonesRes.data) setZones(zonesRes.data);
    if (pricesRes.data) setPricingRules(pricesRes.data);
    if (packagesRes.data) setAirportPackages(packagesRes.data);
  };

  const handleCreateZone = async () => {
    const { error } = await supabase.from("geographic_zones").insert({
      name: zoneName,
      zone_type: zoneType,
      description: zoneDescription,
      coordinates: { lat: parseFloat(zoneLat), lng: parseFloat(zoneLng) }
    });

    if (error) {
      toast.error("Erreur lors de la création de la zone");
      return;
    }

    toast.success("Zone créée avec succès");
    setShowZoneDialog(false);
    resetZoneForm();
    fetchData();
  };

  const handleCreatePricing = async () => {
    const { error } = await supabase.from("pricing_rules").insert({
      name: priceName,
      zone_from_id: priceZoneFrom,
      zone_to_id: priceZoneTo,
      vehicle_type: priceVehicleType,
      base_price: parseFloat(basePrice),
      is_flat_rate: isFlatRate,
      active: priceActive
    });

    if (error) {
      toast.error("Erreur lors de la création de la règle");
      return;
    }

    toast.success("Règle de tarification créée");
    setShowPriceDialog(false);
    resetPriceForm();
    fetchData();
  };

  const handleCreatePackage = async () => {
    const { error } = await supabase.from("airport_packages").insert({
      package_name: packageName,
      airport_zone_id: airportZone,
      destination_zone_id: packageDestZone === "none" ? null : packageDestZone || null,
      vehicle_type: packageVehicleType,
      flat_rate: parseFloat(flatRate),
      included_waiting_time: parseInt(waitingTime),
      active: packageActive
    });

    if (error) {
      toast.error("Erreur lors de la création du forfait");
      return;
    }

    toast.success("Forfait aéroport créé");
    setShowPackageDialog(false);
    resetPackageForm();
    fetchData();
  };

  const deleteZone = async (id: string) => {
    const { error } = await supabase.from("geographic_zones").delete().eq("id", id);
    if (!error) {
      toast.success("Zone supprimée");
      fetchData();
    }
  };

  const deletePricing = async (id: string) => {
    const { error } = await supabase.from("pricing_rules").delete().eq("id", id);
    if (!error) {
      toast.success("Règle supprimée");
      fetchData();
    }
  };

  const deletePackage = async (id: string) => {
    const { error } = await supabase.from("airport_packages").delete().eq("id", id);
    if (!error) {
      toast.success("Forfait supprimé");
      fetchData();
    }
  };

  const resetZoneForm = () => {
    setZoneName("");
    setZoneType("city");
    setZoneDescription("");
    setZoneLat("");
    setZoneLng("");
  };

  const resetPriceForm = () => {
    setPriceName("");
    setPriceZoneFrom("");
    setPriceZoneTo("");
    setBasePrice("");
  };

  const resetPackageForm = () => {
    setPackageName("");
    setAirportZone("");
    setPackageDestZone("none");
    setFlatRate("");
    setWaitingTime("30");
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <PageHeader title="Configuration des tarifs" />

      <Tabs defaultValue="zones" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="zones">Zones géographiques</TabsTrigger>
          <TabsTrigger value="pricing">Règles de tarification</TabsTrigger>
          <TabsTrigger value="packages">Forfaits aéroport</TabsTrigger>
        </TabsList>

        <TabsContent value="zones">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Zones géographiques
              </CardTitle>
              <Dialog open={showZoneDialog} onOpenChange={setShowZoneDialog}>
                <DialogTrigger asChild>
                  <Button><Plus className="w-4 h-4 mr-2" /> Nouvelle zone</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Créer une zone géographique</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input placeholder="Nom de la zone" value={zoneName} onChange={(e) => setZoneName(e.target.value)} />
                    <Select value={zoneType} onValueChange={setZoneType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="city">Ville</SelectItem>
                        <SelectItem value="airport">Aéroport</SelectItem>
                        <SelectItem value="station">Gare</SelectItem>
                        <SelectItem value="district">Quartier</SelectItem>
                      </SelectContent>
                    </Select>
                    <Textarea placeholder="Description" value={zoneDescription} onChange={(e) => setZoneDescription(e.target.value)} />
                    <div className="grid grid-cols-2 gap-2">
                      <Input placeholder="Latitude" value={zoneLat} onChange={(e) => setZoneLat(e.target.value)} />
                      <Input placeholder="Longitude" value={zoneLng} onChange={(e) => setZoneLng(e.target.value)} />
                    </div>
                    <Button onClick={handleCreateZone} className="w-full">Créer</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {zones.map((zone) => (
                    <TableRow key={zone.id}>
                      <TableCell className="font-medium">{zone.name}</TableCell>
                      <TableCell>{zone.zone_type}</TableCell>
                      <TableCell>{zone.description}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => deleteZone(zone.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Règles de tarification
              </CardTitle>
              <Dialog open={showPriceDialog} onOpenChange={setShowPriceDialog}>
                <DialogTrigger asChild>
                  <Button><Plus className="w-4 h-4 mr-2" /> Nouvelle règle</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Créer une règle de tarification</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input placeholder="Nom de la règle" value={priceName} onChange={(e) => setPriceName(e.target.value)} />
                    <Select value={priceZoneFrom} onValueChange={setPriceZoneFrom}>
                      <SelectTrigger>
                        <SelectValue placeholder="Zone de départ" />
                      </SelectTrigger>
                      <SelectContent>
                        {zones.map((z) => <SelectItem key={z.id} value={z.id}>{z.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Select value={priceZoneTo} onValueChange={setPriceZoneTo}>
                      <SelectTrigger>
                        <SelectValue placeholder="Zone d'arrivée" />
                      </SelectTrigger>
                      <SelectContent>
                        {zones.map((z) => <SelectItem key={z.id} value={z.id}>{z.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Select value={priceVehicleType} onValueChange={setPriceVehicleType}>
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
                    <Input placeholder="Prix de base (€)" type="number" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} />
                    <div className="flex items-center gap-2">
                      <Switch checked={priceActive} onCheckedChange={setPriceActive} />
                      <span className="text-sm">Active</span>
                    </div>
                    <Button onClick={handleCreatePricing} className="w-full">Créer</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>De → Vers</TableHead>
                    <TableHead>Véhicule</TableHead>
                    <TableHead>Prix</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pricingRules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-medium">{rule.name}</TableCell>
                      <TableCell>{rule.zone_from?.name} → {rule.zone_to?.name}</TableCell>
                      <TableCell>{rule.vehicle_type}</TableCell>
                      <TableCell>{rule.base_price} €</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${rule.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                          {rule.active ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => deletePricing(rule.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="packages">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Forfaits aéroport</CardTitle>
              <Dialog open={showPackageDialog} onOpenChange={setShowPackageDialog}>
                <DialogTrigger asChild>
                  <Button><Plus className="w-4 h-4 mr-2" /> Nouveau forfait</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Créer un forfait aéroport</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input placeholder="Nom du forfait" value={packageName} onChange={(e) => setPackageName(e.target.value)} />
                    <Select value={airportZone} onValueChange={setAirportZone}>
                      <SelectTrigger>
                        <SelectValue placeholder="Aéroport" />
                      </SelectTrigger>
                      <SelectContent>
                        {zones.filter(z => z.zone_type === 'airport').map((z) => <SelectItem key={z.id} value={z.id}>{z.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Select value={packageDestZone} onValueChange={setPackageDestZone}>
                      <SelectTrigger>
                        <SelectValue placeholder="Destination (optionnel)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Aucune</SelectItem>
                        {zones.map((z) => <SelectItem key={z.id} value={z.id}>{z.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Select value={packageVehicleType} onValueChange={setPackageVehicleType}>
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
                    <Input placeholder="Tarif forfaitaire (€)" type="number" value={flatRate} onChange={(e) => setFlatRate(e.target.value)} />
                    <Input placeholder="Temps d'attente inclus (min)" type="number" value={waitingTime} onChange={(e) => setWaitingTime(e.target.value)} />
                    <div className="flex items-center gap-2">
                      <Switch checked={packageActive} onCheckedChange={setPackageActive} />
                      <span className="text-sm">Active</span>
                    </div>
                    <Button onClick={handleCreatePackage} className="w-full">Créer</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Aéroport</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Véhicule</TableHead>
                    <TableHead>Tarif</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {airportPackages.map((pkg) => (
                    <TableRow key={pkg.id}>
                      <TableCell className="font-medium">{pkg.package_name}</TableCell>
                      <TableCell>{pkg.airport?.name}</TableCell>
                      <TableCell>{pkg.destination?.name || 'Toutes'}</TableCell>
                      <TableCell>{pkg.vehicle_type}</TableCell>
                      <TableCell>{pkg.flat_rate} €</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${pkg.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                          {pkg.active ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => deletePackage(pkg.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
