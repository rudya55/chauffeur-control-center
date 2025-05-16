
import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, CreditCard, User, Lock, Globe, MoonStar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

const Settings = () => {
  const [avatar, setAvatar] = useState("/profile-photo.jpg");
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  
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
  
  return (
    <div className="p-4 sm:p-6">
      <PageHeader title="settings" />
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="payment">Paiement</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="bg-white rounded-lg shadow p-4 md:p-6">
          <form onSubmit={handleSaveProfile}>
            <div className="flex flex-col items-center mb-6">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={avatar} alt="Avatar" />
                <AvatarFallback>JD</AvatarFallback>
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
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input id="firstName" defaultValue="Jean" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input id="lastName" defaultValue="Dupont" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="jean.dupont@example.com" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input id="phone" defaultValue="+33 6 12 34 56 78" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <Input id="address" defaultValue="123 Rue de Paris" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Globe className="h-5 w-5" />
                  <span>Langue</span>
                </div>
                <div>
                  <select className="border rounded-md p-2">
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MoonStar className="h-5 w-5" />
                  <span>Mode sombre</span>
                </div>
                <Switch 
                  checked={darkMode} 
                  onCheckedChange={setDarkMode} 
                />
              </div>
              
              <Button type="submit" className="w-full">Enregistrer les modifications</Button>
            </div>
          </form>
        </TabsContent>
        
        <TabsContent value="notifications" className="bg-white rounded-lg shadow p-4 md:p-6">
          <form onSubmit={handleSaveNotifications}>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <Bell className="mr-2 h-5 w-5" />
                  Préférences de notification
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Notifications par email</p>
                      <p className="text-sm text-muted-foreground">Recevez des notifications par email</p>
                    </div>
                    <Switch 
                      checked={emailNotifications} 
                      onCheckedChange={setEmailNotifications} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Notifications push</p>
                      <p className="text-sm text-muted-foreground">Recevez des notifications sur votre appareil</p>
                    </div>
                    <Switch 
                      checked={pushNotifications} 
                      onCheckedChange={setPushNotifications} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Nouvelles réservations</p>
                      <p className="text-sm text-muted-foreground">Soyez notifié des nouvelles réservations</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Rappels de réservations</p>
                      <p className="text-sm text-muted-foreground">Recevez un rappel avant vos réservations</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
              
              <Button type="submit" className="w-full">Enregistrer les préférences</Button>
            </div>
          </form>
        </TabsContent>
        
        <TabsContent value="payment" className="bg-white rounded-lg shadow p-4 md:p-6">
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
              
              <Button className="w-full">Ajouter une nouvelle méthode</Button>
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
        
        <TabsContent value="security" className="bg-white rounded-lg shadow p-4 md:p-6">
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Lock className="mr-2 h-5 w-5" />
              Sécurité du compte
            </h3>
            
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Mot de passe actuel</Label>
                <Input id="current-password" type="password" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-password">Nouveau mot de passe</Label>
                <Input id="new-password" type="password" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                <Input id="confirm-password" type="password" />
              </div>
              
              <Button type="submit" className="w-full">Mettre à jour le mot de passe</Button>
            </form>
            
            <div className="mt-8 space-y-4">
              <h3 className="text-lg font-medium">Autres paramètres de sécurité</h3>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Authentification à deux facteurs</p>
                  <p className="text-sm text-muted-foreground">Ajouter une couche de sécurité supplémentaire</p>
                </div>
                <Button variant="outline">Activer</Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Sessions actives</p>
                  <p className="text-sm text-muted-foreground">Gérer les appareils connectés</p>
                </div>
                <Button variant="outline">Gérer</Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Supprimer le compte</p>
                  <p className="text-sm text-muted-foreground">Supprimer définitivement votre compte</p>
                </div>
                <Button variant="destructive">Supprimer</Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
