
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Le nom doit comporter au moins 2 caractères.",
  }),
  email: z.string().email({
    message: "Veuillez entrer une adresse email valide.",
  }),
  phone: z.string().min(10, {
    message: "Veuillez entrer un numéro de téléphone valide.",
  }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const defaultValues: Partial<ProfileFormValues> = {
  name: "Jean Martin",
  email: "jean.martin@example.com",
  phone: "+33612345678",
};

const Settings = () => {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });

  function onSubmit(data: ProfileFormValues) {
    toast({
      title: "Profil mis à jour",
      description: "Vos informations personnelles ont été mises à jour",
    });
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">Paramètres</h1>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
                  <AvatarFallback>JM</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>Informations personnelles</CardTitle>
                  <CardDescription>
                    Mettez à jour vos informations personnelles.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom complet</FormLabel>
                        <FormControl>
                          <Input placeholder="Votre nom" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Votre email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Téléphone</FormLabel>
                        <FormControl>
                          <Input placeholder="Votre numéro de téléphone" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Enregistrer les modifications</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Votre véhicule</CardTitle>
              <CardDescription>
                Informations sur votre véhicule actuel.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium">Marque</h3>
                  <p className="text-sm">Mercedes</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Modèle</h3>
                  <p className="text-sm">Classe E</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Année</h3>
                  <p className="text-sm">2022</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Immatriculation</h3>
                  <p className="text-sm">AB-123-CD</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Modifier les informations du véhicule
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>
                Gérez vos documents professionnels.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <h3 className="font-medium">Permis de conduire</h3>
                    <p className="text-sm text-muted-foreground">Valide jusqu'au 15/10/2027</p>
                  </div>
                  <Button variant="outline" size="sm">Mettre à jour</Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <h3 className="font-medium">Carte grise</h3>
                    <p className="text-sm text-muted-foreground">Mise à jour il y a 8 mois</p>
                  </div>
                  <Button variant="outline" size="sm">Mettre à jour</Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <h3 className="font-medium">Assurance professionnelle</h3>
                    <p className="text-sm text-muted-foreground">Expire dans 45 jours</p>
                  </div>
                  <Button variant="outline" size="sm">Mettre à jour</Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-md bg-destructive/10">
                  <div>
                    <h3 className="font-medium">Carte VTC</h3>
                    <p className="text-sm text-destructive">Expiré depuis 5 jours</p>
                  </div>
                  <Button variant="outline" size="sm" className="border-destructive text-destructive">
                    Action requise
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sécurité</CardTitle>
              <CardDescription>
                Gérez la sécurité de votre compte.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Mot de passe</h3>
                <div className="grid gap-2">
                  <div className="grid gap-1">
                    <Label htmlFor="current">Mot de passe actuel</Label>
                    <Input id="current" type="password" />
                  </div>
                  <div className="grid gap-1">
                    <Label htmlFor="new">Nouveau mot de passe</Label>
                    <Input id="new" type="password" />
                  </div>
                  <div className="grid gap-1">
                    <Label htmlFor="confirm">Confirmer le mot de passe</Label>
                    <Input id="confirm" type="password" />
                  </div>
                </div>
                <Button>Changer le mot de passe</Button>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Double authentification</h3>
                <div className="flex items-center space-x-2">
                  <Switch id="2fa" />
                  <Label htmlFor="2fa">Activer la double authentification</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Protégez votre compte avec une couche de sécurité supplémentaire.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Configurez vos préférences de notification.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-lg font-medium">Notifications de l'application</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="new_reservation">Nouvelles réservations</Label>
                    <FormDescription>
                      Recevez des notifications pour les nouvelles réservations
                    </FormDescription>
                  </div>
                  <Switch id="new_reservation" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="reservation_reminder">Rappels de réservation</Label>
                    <FormDescription>
                      Recevez des rappels 1 heure avant vos réservations
                    </FormDescription>
                  </div>
                  <Switch id="reservation_reminder" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="flight_status">Mises à jour des vols</Label>
                    <FormDescription>
                      Recevez des notifications sur les changements de statut des vols
                    </FormDescription>
                  </div>
                  <Switch id="flight_status" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="promotions">Promotions et actualités</Label>
                    <FormDescription>
                      Recevez des informations sur les promotions et les actualités
                    </FormDescription>
                  </div>
                  <Switch id="promotions" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper component for the Security tab
const Label = ({ htmlFor, children }: { htmlFor: string, children: React.ReactNode }) => {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
      {children}
    </label>
  );
};

export default Settings;
