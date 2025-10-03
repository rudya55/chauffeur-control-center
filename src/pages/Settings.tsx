import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell, 
  CreditCard, 
  User, 
  Lock, 
  Globe, 
  MoonStar, 
  Building, 
  Mail, 
  Phone, 
  AlertCircle,
  FileText,
  Download 
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useLanguage } from "@/hooks/use-language";
import { LanguageCard } from "@/components/LanguageCard";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger 
} from "@/components/ui/accordion";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Settings = () => {
  const { t } = useLanguage();
  const [avatar, setAvatar] = useState("/profile-photo.jpg");
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [documents, setDocuments] = useState([
    { id: "1", name: "Permis de conduire", type: "pdf", date: "2025-04-15", size: "2.3 MB" },
    { id: "2", name: "Assurance véhicule", type: "pdf", date: "2025-03-22", size: "1.5 MB" },
    { id: "3", name: "Carte grise", type: "pdf", date: "2025-01-10", size: "650 KB" },
  ]);
  
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profil mis à jour avec succès");
  };
  
  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Préférences de notification mises à jour");
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatar(url);
      toast.success("Photo de profil mise à jour");
    }
  };

  const handleAddPaymentMethod = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Nouvelle méthode de paiement ajoutée`);
    setShowPaymentDialog(false);
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocumentFile(file);
      // En production, vous enverriez le fichier à un serveur ici
      const newDocument = {
        id: (documents.length + 1).toString(),
        name: file.name,
        type: file.name.split('.').pop() || "unknown",
        date: new Date().toISOString().split('T')[0],
        size: `${(file.size / 1024).toFixed(1)} KB`
      };
      setDocuments([...documents, newDocument]);
      toast.success("Document téléchargé avec succès");
    }
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
    toast.success("Document supprimé");
  };

  const handleViewDocument = (id: string) => {
    // En production, vous récupéreriez le document depuis votre serveur
    toast.info(`Affichage du document ${id}`);
  };

  const handleDownloadDocument = (id: string) => {
    // En production, vous téléchargeriez le document depuis votre serveur
    toast.info(`Téléchargement du document ${id}`);
  };
  
  return (
    <div className="p-4 sm:p-6">
      <PageHeader title="settings" />
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 mb-6 h-auto gap-2 bg-card p-2">
          <TabsTrigger value="profile" className="text-xs sm:text-sm">Profil</TabsTrigger>
          <TabsTrigger value="map" className="text-xs sm:text-sm">Carte</TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs sm:text-sm">Notifications</TabsTrigger>
          <TabsTrigger value="payment" className="text-xs sm:text-sm">Paiement</TabsTrigger>
          <TabsTrigger value="language" className="text-xs sm:text-sm">Langues</TabsTrigger>
          <TabsTrigger value="documents" className="text-xs sm:text-sm">Documents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="bg-card text-card-foreground rounded-lg shadow p-4 md:p-6">
          <form onSubmit={handleSaveProfile}>
            <div className="flex flex-col items-center mb-6">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={avatar} alt="Avatar" />
                <AvatarFallback className="bg-primary text-primary-foreground">JD</AvatarFallback>
              </Avatar>
              
              <Label 
                htmlFor="avatar-upload" 
                className="cursor-pointer bg-primary text-primary-foreground px-4 py-2 rounded-md"
              >
                Modifier la photo
              </Label>
              <Input 
                id="avatar-upload" 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileChange}
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex flex-col gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-foreground">Prénom</Label>
                  <Input id="firstName" defaultValue="Jean" className="bg-background text-foreground" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-foreground">Nom</Label>
                  <Input id="lastName" defaultValue="Dupont" className="bg-background text-foreground" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">Email</Label>
                <Input id="email" type="email" defaultValue="jean.dupont@example.com" className="bg-background text-foreground" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-foreground">Téléphone</Label>
                <Input id="phone" defaultValue="+33 6 12 34 56 78" className="bg-background text-foreground" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address" className="text-foreground">Adresse</Label>
                <Input id="address" defaultValue="123 Rue de Paris" className="bg-background text-foreground" />
              </div>
              
              <div className="flex items-center space-x-2">
                <MoonStar className="h-5 w-5 text-foreground" />
                <span className="text-foreground">Mode sombre</span>
                <Switch 
                  checked={darkMode} 
                  onCheckedChange={setDarkMode} 
                  className="ml-auto"
                />
              </div>
              
              <Button type="submit" className="w-full">Enregistrer les modifications</Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="map" className="bg-card text-card-foreground rounded-lg shadow p-4 md:p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <Globe className="mr-2 h-5 w-5" />
                Paramètres de la carte
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="car-type">Type de voiture sur la carte</Label>
                  <Select 
                    defaultValue={localStorage.getItem('mapCarType') || 'sedan'} 
                    onValueChange={(value) => {
                      localStorage.setItem('mapCarType', value);
                      window.dispatchEvent(new Event('carTypeChanged'));
                      toast.success("Type de voiture mis à jour");
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir un type de voiture" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedan">🚗 Berline</SelectItem>
                      <SelectItem value="suv">🚙 SUV</SelectItem>
                      <SelectItem value="sports">🏎️ Sportive</SelectItem>
                      <SelectItem value="taxi">🚕 Taxi</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Choisissez l'icône de voiture qui s'affichera sur la carte
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="notifications" className="bg-card text-card-foreground rounded-lg shadow p-4 md:p-6">
          <form onSubmit={handleSaveNotifications}>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <Bell className="mr-2 h-5 w-5" />
                  Préférences de notification
                </h3>
                
                <Accordion type="single" collapsible className="w-full space-y-4">
                  <AccordionItem value="email-notifications" className="border rounded-lg px-4">
                    <AccordionTrigger className="py-4">Notifications par email</AccordionTrigger>
                    <AccordionContent className="space-y-4 pb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Nouvelles réservations</p>
                          <p className="text-sm text-muted-foreground">Recevoir un email pour chaque nouvelle réservation</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Rappels</p>
                          <p className="text-sm text-muted-foreground">Recevoir un rappel 2 heures avant une course</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Paiements</p>
                          <p className="text-sm text-muted-foreground">Recevoir une confirmation pour chaque paiement</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Marketing</p>
                          <p className="text-sm text-muted-foreground">Offres et promotions</p>
                        </div>
                        <Switch />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="push-notifications" className="border rounded-lg px-4">
                    <AccordionTrigger className="py-4">Notifications push</AccordionTrigger>
                    <AccordionContent className="space-y-4 pb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Nouvelles réservations</p>
                          <p className="text-sm text-muted-foreground">Recevoir une notification pour chaque nouvelle réservation</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Rappels de courses</p>
                          <p className="text-sm text-muted-foreground">Recevoir un rappel 30 minutes avant une course</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Changements de statut</p>
                          <p className="text-sm text-muted-foreground">Recevoir une notification pour les changements de statut</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Alertes importantes</p>
                          <p className="text-sm text-muted-foreground">Notifications urgentes et critiques</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="sms-notifications" className="border rounded-lg px-4">
                    <AccordionTrigger className="py-4">Notifications SMS</AccordionTrigger>
                    <AccordionContent className="space-y-4 pb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Réservations urgentes</p>
                          <p className="text-sm text-muted-foreground">Recevoir un SMS pour les réservations de dernière minute</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Annulations</p>
                          <p className="text-sm text-muted-foreground">Recevoir un SMS en cas d'annulation</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="in-app-notifications" className="border rounded-lg px-4">
                    <AccordionTrigger className="py-4">Notifications dans l'application</AccordionTrigger>
                    <AccordionContent className="space-y-4 pb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Activité du compte</p>
                          <p className="text-sm text-muted-foreground">Nouvelles réservations, paiements, etc.</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Communications</p>
                          <p className="text-sm text-muted-foreground">Messages des clients et répartiteurs</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Mises à jour</p>
                          <p className="text-sm text-muted-foreground">Nouvelles fonctionnalités et améliorations</p>
                        </div>
                        <Switch />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
              
              <Button type="submit" className="w-full">Enregistrer les préférences</Button>
            </div>
          </form>
        </TabsContent>
        
        <TabsContent value="payment" className="bg-card text-card-foreground rounded-lg shadow p-4 md:p-6">
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <CreditCard className="mr-2 h-5 w-5" />
              Méthodes de paiement
            </h3>
            
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Visa terminant par 4242</p>
                      <p className="text-sm text-muted-foreground">Expire le 12/2024</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Supprimer</Button>
                </div>
              </div>
              
              <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
                <DialogTrigger asChild>
                  <Button className="w-full">Ajouter une nouvelle méthode</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Ajouter une méthode de paiement</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddPaymentMethod}>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="payment-type">Type de méthode de paiement</Label>
                        <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="card">Carte bancaire</SelectItem>
                            <SelectItem value="bank">Coordonnées bancaires (RIB)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {paymentMethod === "card" && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="card-number">Numéro de carte</Label>
                            <Input id="card-number" placeholder="1234 5678 9012 3456" />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="expiry">Date d'expiration</Label>
                              <Input id="expiry" placeholder="MM/YY" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="cvc">CVC</Label>
                              <Input id="cvc" placeholder="123" />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="card-name">Nom sur la carte</Label>
                            <Input id="card-name" placeholder="Jean Dupont" />
                          </div>
                        </div>
                      )}
                      
                      {paymentMethod === "bank" && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="account-name">Titulaire du compte</Label>
                            <Input id="account-name" placeholder="Jean Dupont" />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="iban">IBAN</Label>
                            <Input id="iban" placeholder="FR76 1234 5678 9012 3456 7890 123" />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="bic">BIC / SWIFT</Label>
                            <Input id="bic" placeholder="ABCDEFGHXXX" />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="bank-name">Nom de la banque</Label>
                            <Input id="bank-name" placeholder="Banque Populaire" />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-end gap-3">
                      <Button variant="outline" type="button" onClick={() => setShowPaymentDialog(false)}>Annuler</Button>
                      <Button type="submit">Enregistrer</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            
            <h3 className="text-lg font-medium mt-8 mb-4">Historique de facturation</h3>
            <div className="border rounded-lg">
              <div className="p-4 flex justify-between items-center border-b">
                <div>
                  <p className="font-medium">Mai 2025</p>
                  <p className="text-sm text-muted-foreground">Abonnement mensuel</p>
                </div>
                <span className="text-right">35,00 €</span>
              </div>
              <div className="p-4 flex justify-between items-center border-b">
                <div>
                  <p className="font-medium">Avril 2025</p>
                  <p className="text-sm text-muted-foreground">Abonnement mensuel</p>
                </div>
                <span className="text-right">35,00 €</span>
              </div>
              <div className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium">Mars 2025</p>
                  <p className="text-sm text-muted-foreground">Abonnement mensuel</p>
                </div>
                <span className="text-right">35,00 €</span>
              </div>
            </div>
          </div>
        </TabsContent>
        
        
        <TabsContent value="language" className="bg-card text-card-foreground rounded-lg shadow p-4 md:p-6">
          <div className="space-y-6">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Globe className="mr-2 h-5 w-5" />
              Préférences linguistiques
            </h3>
            
            <LanguageCard />
            
            <div className="space-y-4 mt-6">
              <h4 className="text-md font-medium">Langues disponibles</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {["fr", "en", "es", "de", "it", "ar", "zh", "ru", "pt", "ja"].map((lang) => (
                  <div key={lang} className="p-3 border rounded-md flex items-center justify-center text-center">
                    {lang === "fr" && "Français"}
                    {lang === "en" && "English"}
                    {lang === "es" && "Español"}
                    {lang === "de" && "Deutsch"}
                    {lang === "it" && "Italiano"}
                    {lang === "ar" && "العربية"}
                    {lang === "zh" && "中文"}
                    {lang === "ru" && "Русский"}
                    {lang === "pt" && "Português"}
                    {lang === "ja" && "日本語"}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border-t pt-6 mt-6">
              <div className="flex items-center gap-2 text-amber-600">
                <AlertCircle className="h-5 w-5" />
                <p className="text-sm font-medium">La traduction automatique peut ne pas être parfaite.</p>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Nous nous efforçons d'améliorer constamment nos traductions. Si vous remarquez des erreurs, n'hésitez pas à nous les signaler.
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="bg-card text-card-foreground rounded-lg shadow p-4 md:p-6">
          <div className="space-y-6">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Documents
            </h3>
            
            <div className="border rounded-lg p-6 bg-gray-50">
              <div className="text-center">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                <h4 className="font-medium mb-1">Télécharger un document</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Formats supportés: PDF, JPG, PNG (max 10MB)
                </p>
                
                <Label 
                  htmlFor="document-upload" 
                  className="cursor-pointer bg-primary text-primary-foreground px-4 py-2 rounded-md inline-block"
                >
                  Sélectionner un fichier
                </Label>
                <Input 
                  id="document-upload" 
                  type="file" 
                  accept=".pdf,.jpg,.jpeg,.png" 
                  className="hidden" 
                  onChange={handleDocumentUpload}
                />
              </div>
            </div>
            
            <h4 className="font-medium mt-8 mb-2">Documents téléchargés</h4>
            <div className="border rounded-lg overflow-hidden">
              <div className="grid grid-cols-5 bg-muted/50 p-3 border-b font-medium text-sm">
                <div className="col-span-2">Nom</div>
                <div>Type</div>
                <div>Date</div>
                <div className="text-right">Actions</div>
              </div>
              
              {documents.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  Aucun document téléchargé
                </div>
              ) : (
                documents.map((doc) => (
                  <div key={doc.id} className="grid grid-cols-5 p-3 border-b items-center text-sm">
                    <div className="col-span-2 font-medium">{doc.name}</div>
                    <div className="uppercase">{doc.type}</div>
                    <div>{doc.date}</div>
                    <div className="flex gap-2 justify-end">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleViewDocument(doc.id)}
                      >
                        Voir
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDownloadDocument(doc.id)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-destructive hover:bg-destructive/10" 
                        onClick={() => handleDeleteDocument(doc.id)}
                      >
                        Supprimer
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-amber-600">
                <AlertCircle className="h-5 w-5" />
                <p className="text-sm font-medium">
                  Les documents sont uniquement visibles par vous et l'administration.
                </p>
              </div>
              <p className="text-sm text-amber-700 mt-2">
                Veuillez vous assurer que tous les documents sont à jour et lisibles.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
