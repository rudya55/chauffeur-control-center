import { useState } from "react";
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Car, Download, Shield, Bell, Trash2, CreditCard, Banknote } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

const vehicleFormSchema = z.object({
  brand: z.string().min(2, {
    message: "La marque doit comporter au moins 2 caractères.",
  }),
  model: z.string().min(2, {
    message: "Le modèle doit comporter au moins 2 caractères.",
  }),
  year: z.string().regex(/^\d{4}$/, {
    message: "L'année doit être au format YYYY.",
  }),
  registration: z.string().min(5, {
    message: "L'immatriculation doit comporter au moins 5 caractères.",
  }),
});

const passwordFormSchema = z.object({
  currentPassword: z.string().min(8, {
    message: "Le mot de passe doit comporter au moins 8 caractères.",
  }),
  newPassword: z.string().min(8, {
    message: "Le mot de passe doit comporter au moins 8 caractères.",
  }),
  confirmPassword: z.string().min(8, {
    message: "Le mot de passe doit comporter au moins 8 caractères.",
  }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas.",
  path: ["confirmPassword"],
});

const notificationsFormSchema = z.object({
  appNotifications: z.object({
    newReservation: z.boolean().default(true),
    reservationReminder: z.boolean().default(true),
    flightStatus: z.boolean().default(true),
    promotions: z.boolean().default(false),
  }),
  emailNotifications: z.object({
    reservations: z.boolean().default(true),
    payments: z.boolean().default(true),
    news: z.boolean().default(false),
  }),
  smsNotifications: z.object({
    urgentReservations: z.boolean().default(true),
    security: z.boolean().default(true),
  }),
});

const paymentMethodFormSchema = z.object({
  methodType: z.enum(["card", "bank"]),
  cardDetails: z.object({
    cardNumber: z.string().regex(/^\d{16}$/, {
      message: "Le numéro de carte doit comporter 16 chiffres.",
    }).optional(),
    cardName: z.string().min(2, {
      message: "Le nom sur la carte doit comporter au moins 2 caractères.",
    }).optional(),
    expiryDate: z.string().regex(/^\d{2}\/\d{2}$/, {
      message: "La date d'expiration doit être au format MM/YY.",
    }).optional(),
    cvv: z.string().regex(/^\d{3}$/, {
      message: "Le code CVV doit comporter 3 chiffres.",
    }).optional(),
  }).optional(),
  bankDetails: z.object({
    accountName: z.string().min(2, {
      message: "Le nom du titulaire doit comporter au moins 2 caractères.",
    }).optional(),
    iban: z.string().min(14, {
      message: "L'IBAN doit comporter au moins 14 caractères.",
    }).optional(),
    bic: z.string().min(8, {
      message: "Le BIC doit comporter au moins 8 caractères.",
    }).optional(),
    bankName: z.string().min(2, {
      message: "Le nom de la banque doit comporter au moins 2 caractères.",
    }).optional(),
  }).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type VehicleFormValues = z.infer<typeof vehicleFormSchema>;
type PasswordFormValues = z.infer<typeof passwordFormSchema>;
type NotificationsFormValues = z.infer<typeof notificationsFormSchema>;
type PaymentMethodFormValues = z.infer<typeof paymentMethodFormSchema>;

const defaultValues: Partial<ProfileFormValues> = {
  name: "Jean Martin",
  email: "jean.martin@example.com",
  phone: "+33612345678",
};

const defaultVehicleValues: Partial<VehicleFormValues> = {
  brand: "",
  model: "",
  year: "",
  registration: "",
};

const defaultPasswordValues: Partial<PasswordFormValues> = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const defaultNotificationValues: NotificationsFormValues = {
  appNotifications: {
    newReservation: true,
    reservationReminder: true,
    flightStatus: true,
    promotions: false,
  },
  emailNotifications: {
    reservations: true,
    payments: true,
    news: false,
  },
  smsNotifications: {
    urgentReservations: true,
    security: true,
  },
};

const defaultPaymentMethodValues: Partial<PaymentMethodFormValues> = {
  methodType: "card",
};

const Settings = () => {
  const [vehicleActive, setVehicleActive] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteAccountDialog, setDeleteAccountDialog] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "bank">("card");

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const vehicleForm = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: defaultVehicleValues,
    mode: "onChange",
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: defaultPasswordValues,
    mode: "onChange",
  });

  const notificationsForm = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues: defaultNotificationValues,
    mode: "onChange",
  });

  const paymentMethodForm = useForm<PaymentMethodFormValues>({
    resolver: zodResolver(paymentMethodFormSchema),
    defaultValues: defaultPaymentMethodValues,
    mode: "onChange",
  });

  function onSubmit(data: ProfileFormValues) {
    toast({
      title: "Profil mis à jour",
      description: "Vos informations personnelles ont été mises à jour",
    });
  }

  function onVehicleSubmit(data: VehicleFormValues) {
    toast({
      title: "Véhicule ajouté",
      description: `${data.brand} ${data.model} a été ajouté à votre flotte`,
    });
    setOpenDialog(false);
    vehicleForm.reset();
  }

  function onPasswordSubmit(data: PasswordFormValues) {
    toast({
      title: "Mot de passe mis à jour",
      description: "Votre mot de passe a été modifié avec succès",
    });
    passwordForm.reset();
  }

  function onNotificationsSubmit(data: NotificationsFormValues) {
    toast({
      title: "Préférences de notification mises à jour",
      description: "Vos préférences de notification ont été enregistrées",
    });
  }

  function onPaymentMethodSubmit(data: PaymentMethodFormValues) {
    const methodType = data.methodType === "card" ? "Carte bancaire" : "Coordonnées bancaires";
    toast({
      title: "Méthode de paiement ajoutée",
      description: `Votre ${methodType} a été enregistrée avec succès`,
    });
  }

  function handleVehicleStatusChange(checked: boolean) {
    setVehicleActive(checked);
    toast({
      title: checked ? "Véhicule activé" : "Véhicule désactivé",
      description: checked ? "Votre véhicule est maintenant disponible pour les courses" : "Votre véhicule n'est plus disponible pour les courses",
    });
  }

  function handleDocumentDownload(documentName: string) {
    toast({
      title: "Téléchargement démarré",
      description: `Le document ${documentName} est en cours de téléchargement`,
    });
  }

  function handleDeleteAccount() {
    toast({
      variant: "destructive",
      title: "Compte supprimé",
      description: "Votre compte a été supprimé définitivement",
    });
    setDeleteAccountDialog(false);
  }

  function handlePaymentMethodChange(value: "card" | "bank") {
    setPaymentMethod(value);
    paymentMethodForm.setValue("methodType", value);
  }

  const toggleExpand = (id: string) => {
    setExpanded(expanded === id ? null : id);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">Paramètres</h1>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="payments">Paiements</TabsTrigger>
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
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Votre véhicule</CardTitle>
                  <CardDescription>
                    Informations sur votre véhicule actuel.
                  </CardDescription>
                </div>
                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Plus className="mr-1" size={16} />
                      Ajouter un véhicule
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Ajouter un véhicule</DialogTitle>
                      <DialogDescription>
                        Renseignez les informations de votre nouveau véhicule.
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...vehicleForm}>
                      <form onSubmit={vehicleForm.handleSubmit(onVehicleSubmit)} className="space-y-4">
                        <FormField
                          control={vehicleForm.control}
                          name="brand"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Marque</FormLabel>
                              <FormControl>
                                <Input placeholder="Mercedes, BMW, etc." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={vehicleForm.control}
                          name="model"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Modèle</FormLabel>
                              <FormControl>
                                <Input placeholder="Classe E, Série 5, etc." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={vehicleForm.control}
                          name="year"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Année</FormLabel>
                              <FormControl>
                                <Input placeholder="2023" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={vehicleForm.control}
                          name="registration"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Immatriculation</FormLabel>
                              <FormControl>
                                <Input placeholder="AB-123-CD" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <DialogFooter>
                          <Button type="submit">Enregistrer le véhicule</Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
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
              <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-2">
                <div className="flex items-center space-x-2">
                  <Car size={18} />
                  <span className="text-sm font-medium">Véhicule actif</span>
                </div>
                <Switch 
                  id="vehicle-active" 
                  checked={vehicleActive}
                  onCheckedChange={handleVehicleStatusChange}
                />
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
                Gérez et téléchargez vos documents professionnels.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <h3 className="font-medium">Permis de conduire</h3>
                    <p className="text-sm text-muted-foreground">Valide jusqu'au 15/10/2027</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDocumentDownload("Permis de conduire")}
                    >
                      <Download className="mr-1" size={16} />
                      Télécharger
                    </Button>
                    <Button variant="outline" size="sm">Mettre à jour</Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <h3 className="font-medium">Carte grise</h3>
                    <p className="text-sm text-muted-foreground">Mise à jour il y a 8 mois</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDocumentDownload("Carte grise")}
                    >
                      <Download className="mr-1" size={16} />
                      Télécharger
                    </Button>
                    <Button variant="outline" size="sm">Mettre à jour</Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <h3 className="font-medium">Assurance professionnelle</h3>
                    <p className="text-sm text-muted-foreground">Expire dans 45 jours</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDocumentDownload("Assurance professionnelle")}
                    >
                      <Download className="mr-1" size={16} />
                      Télécharger
                    </Button>
                    <Button variant="outline" size="sm">Mettre à jour</Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-md bg-destructive/10">
                  <div>
                    <h3 className="font-medium">Carte VTC</h3>
                    <p className="text-sm text-destructive">Expiré depuis 5 jours</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDocumentDownload("Carte VTC")}
                    >
                      <Download className="mr-1" size={16} />
                      Télécharger
                    </Button>
                    <Button variant="outline" size="sm" className="border-destructive text-destructive">
                      Action requise
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <h3 className="font-medium">Factures et relevés</h3>
                    <p className="text-sm text-muted-foreground">Accédez à vos documents financiers</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => toggleExpand('factures')}
                  >
                    {expanded === 'factures' ? 'Masquer' : 'Afficher'}
                  </Button>
                </div>
                
                <Collapsible open={expanded === 'factures'} className="border rounded-md p-3">
                  <CollapsibleContent className="space-y-3 pt-2">
                    <div className="flex items-center justify-between border-t pt-2">
                      <div>
                        <h4 className="font-medium">Factures Mai 2024</h4>
                        <p className="text-sm text-muted-foreground">Ensemble des factures du mois</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDocumentDownload("Factures Mai 2024")}
                      >
                        <Download className="mr-1" size={16} />
                        Télécharger
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between border-t pt-2">
                      <div>
                        <h4 className="font-medium">Factures Avril 2024</h4>
                        <p className="text-sm text-muted-foreground">Ensemble des factures du mois</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDocumentDownload("Factures Avril 2024")}
                      >
                        <Download className="mr-1" size={16} />
                        Télécharger
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between border-t pt-2">
                      <div>
                        <h4 className="font-medium">Rapport annuel 2023</h4>
                        <p className="text-sm text-muted-foreground">Résumé des activités de l'année</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDocumentDownload("Rapport annuel 2023")}
                      >
                        <Download className="mr-1" size={16} />
                        Télécharger
                      </Button>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payments" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CreditCard className="text-primary" size={20} />
                <div>
                  <CardTitle>Méthodes de paiement</CardTitle>
                  <CardDescription>
                    Ajoutez des méthodes de paiement pour recevoir vos revenus.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Form {...paymentMethodForm}>
                <form onSubmit={paymentMethodForm.handleSubmit(onPaymentMethodSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <RadioGroup 
                      defaultValue="card" 
                      value={paymentMethod}
                      onValueChange={(value) => handlePaymentMethodChange(value as "card" | "bank")}
                      className="grid grid-cols-2 gap-4"
                    >
                      <div>
                        <RadioGroupItem value="card" id="card" className="peer sr-only" />
                        <Label
                          htmlFor="card"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <CreditCard className="mb-3 h-6 w-6" />
                          <span className="font-medium">Carte Bancaire</span>
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="bank" id="bank" className="peer sr-only" />
                        <Label
                          htmlFor="bank"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <Banknote className="mb-3 h-6 w-6" />
                          <span className="font-medium">Coordonnées Bancaires</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {paymentMethod === "card" && (
                    <div className="space-y-4 pt-4">
                      <h3 className="text-lg font-medium">Informations de carte bancaire</h3>
                      
                      <FormField
                        control={paymentMethodForm.control}
                        name="cardDetails.cardNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Numéro de carte</FormLabel>
                            <FormControl>
                              <Input placeholder="1234 5678 9012 3456" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={paymentMethodForm.control}
                        name="cardDetails.cardName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom sur la carte</FormLabel>
                            <FormControl>
                              <Input placeholder="Jean Martin" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={paymentMethodForm.control}
                          name="cardDetails.expiryDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date d'expiration</FormLabel>
                              <FormControl>
                                <Input placeholder="MM/YY" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={paymentMethodForm.control}
                          name="cardDetails.cvv"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>CVV</FormLabel>
                              <FormControl>
                                <Input placeholder="123" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod === "bank" && (
                    <div className="space-y-4 pt-4">
                      <h3 className="text-lg font-medium">Coordonnées bancaires</h3>
                      
                      <FormField
                        control={paymentMethodForm.control}
                        name="bankDetails.accountName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom du titulaire</FormLabel>
                            <FormControl>
                              <Input placeholder="Jean Martin" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={paymentMethodForm.control}
                        name="bankDetails.iban"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>IBAN</FormLabel>
                            <FormControl>
                              <Input placeholder="FR76 1234 5678 9123 4567 8912 345" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={paymentMethodForm.control}
                        name="bankDetails.bic"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>BIC / SWIFT</FormLabel>
                            <FormControl>
                              <Input placeholder="ABCDEFGH123" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={paymentMethodForm.control}
                        name="bankDetails.bankName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom de la banque</FormLabel>
                            <FormControl>
                              <Input placeholder="Banque Nationale" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                  
                  <div className="pt-4">
                    <Button type="submit">Enregistrer la méthode de paiement</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Paiements automatiques</CardTitle>
              <CardDescription>
                Configurez les paramètres pour recevoir vos paiements automatiquement.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-payout">Versements automatiques</Label>
                  <FormDescription>
                    Recevoir automatiquement vos paiements lorsque votre solde atteint un certain montant
                  </FormDescription>
                </div>
                <Switch id="auto-payout" defaultChecked={true} />
              </div>
              
              <div className="pt-2">
                <Label htmlFor="payout-threshold">Seuil de versement</Label>
                <Select defaultValue="100">
                  <SelectTrigger id="payout-threshold" className="w-full">
                    <SelectValue placeholder="Sélectionnez un seuil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="50">50 €</SelectItem>
                    <SelectItem value="100">100 €</SelectItem>
                    <SelectItem value="200">200 €</SelectItem>
                    <SelectItem value="500">500 €</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Le montant minimum que votre solde doit atteindre avant un versement automatique
                </FormDescription>
              </div>
              
              <div className="pt-2">
                <Label htmlFor="payout-frequency">Fréquence de versement</Label>
                <Select defaultValue="weekly">
                  <SelectTrigger id="payout-frequency" className="w-full">
                    <SelectValue placeholder="Sélectionnez une fréquence" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Quotidien</SelectItem>
                    <SelectItem value="weekly">Hebdomadaire</SelectItem>
                    <SelectItem value="biweekly">Toutes les deux semaines</SelectItem>
                    <SelectItem value="monthly">Mensuel</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  La fréquence à laquelle les versements sont effectués
                </FormDescription>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Enregistrer les préférences de paiement</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Historique des paiements</CardTitle>
              <CardDescription>
                Consultez l'historique de vos paiements reçus.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-md p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Versement vers compte bancaire</h3>
                      <p className="text-sm text-muted-foreground">15 mai 2024</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">485,75 €</p>
                      <p className="text-sm text-green-600">Versé</p>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Versement vers compte bancaire</h3>
                      <p className="text-sm text-muted-foreground">8 mai 2024</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">367,20 €</p>
                      <p className="text-sm text-green-600">Versé</p>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Versement vers compte bancaire</h3>
                      <p className="text-sm text-muted-foreground">1 mai 2024</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">523,50 €</p>
                      <p className="text-sm text-green-600">Versé</p>
                    </div>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full">Voir tout l'historique</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="text-primary" size={20} />
                <div>
                  <CardTitle>Sécurité du compte</CardTitle>
                  <CardDescription>
                    Gérez la sécurité de votre compte.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Mot de passe</h3>
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mot de passe actuel</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nouveau mot de passe</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirmer le mot de passe</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit">Changer le mot de passe</Button>
                  </form>
                </Form>
              </div>
              
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-medium">Double authentification</h3>
                <div className="flex items-center space-x-2">
                  <Switch id="2fa" />
                  <Label htmlFor="2fa">Activer la double authentification</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Protégez votre compte avec une couche de sécurité supplémentaire.
                  Vous recevrez un code par SMS à chaque connexion.
                </p>
              </div>
              
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-medium text-destructive">Zone de danger</h3>
                <p className="text-sm text-muted-foreground">
                  Cette action est irréversible. Toutes vos données seront définitivement supprimées.
                </p>
                <Dialog open={deleteAccountDialog} onOpenChange={setDeleteAccountDialog}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="w-full sm:w-auto">
                      <Trash2 className="mr-1" size={16} />
                      Supprimer mon compte
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="text-destructive">Supprimer votre compte ?</DialogTitle>
                      <DialogDescription>
                        Cette action est irréversible. Toutes vos données seront définitivement supprimées 
                        de nos serveurs.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="p-4 border border-destructive/20 rounded-md bg-destructive/5 my-2">
                      <p className="text-sm font-medium">Les éléments suivants seront supprimés :</p>
                      <ul className="text-sm mt-2 space-y-1 list-disc pl-4">
                        <li>Votre profil et vos informations personnelles</li>
                        <li>Votre historique de courses et de paiements</li>
                        <li>Tous vos documents téléchargés</li>
                        <li>Vos préférences et paramètres</li>
                      </ul>
                    </div>
                    <DialogFooter className="flex flex-col sm:flex-row gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => setDeleteAccountDialog(false)}
                        className="w-full sm:w-auto"
                      >
                        Annuler
                      </Button>
                      <Button 
                        variant="destructive" 
                        onClick={handleDeleteAccount}
                        className="w-full sm:w-auto"
                      >
                        Confirmer la suppression
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="text-primary" size={20} />
                <div>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>
                    Configurez vos préférences de notification.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Form {...notificationsForm}>
                <form onSubmit={notificationsForm.handleSubmit(onNotificationsSubmit)} className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Notifications de l'application</h3>
                    
                    <FormField
                      control={notificationsForm.control}
                      name="appNotifications.newReservation"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between space-y-0">
                          <div className="space-y-0.5">
                            <FormLabel htmlFor="new_reservation">Nouvelles réservations</FormLabel>
                            <FormDescription>
                              Recevez des notifications pour les nouvelles réservations
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch 
                              id="new_reservation"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={notificationsForm.control}
                      name="appNotifications.reservationReminder"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between space-y-0">
                          <div className="space-y-0.5">
                            <FormLabel htmlFor="reservation_reminder">Rappels de réservation</FormLabel>
                            <FormDescription>
                              Recevez des rappels 1 heure avant vos réservations
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch 
                              id="reservation_reminder"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={notificationsForm.control}
                      name="appNotifications.flightStatus"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between space-y-0">
                          <div className="space-y-0.5">
                            <FormLabel htmlFor="flight_status">Mises à jour des vols</FormLabel>
                            <FormDescription>
                              Recevez des notifications sur les changements de statut des vols
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch 
                              id="flight_status"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={notificationsForm.control}
                      name="appNotifications.promotions"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between space-y-0">
                          <div className="space-y-0.5">
                            <FormLabel htmlFor="promotions">Promotions et actualités</FormLabel>
                            <FormDescription>
                              Recevez des informations sur les promotions et les actualités
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch 
                              id="promotions"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="space-y-4 border-t pt-6">
                    <h3 className="text-lg font-medium">Notifications par email</h3>
                    
                    <FormField
                      control={notificationsForm.control}
                      name="emailNotifications.reservations"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between space-y-0">
                          <div className="space-y-0.5">
                            <FormLabel htmlFor="email_reservations">Réservations</FormLabel>
                            <FormDescription>
                              Recevez un email pour chaque nouvelle réservation
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch 
                              id="email_reservations"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={notificationsForm.control}
                      name="emailNotifications.payments"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between space-y-0">
                          <div className="space-y-0.5">
                            <FormLabel htmlFor="email_payments">Paiements</FormLabel>
                            <FormDescription>
                              Recevez un email pour chaque nouveau paiement
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch 
                              id="email_payments"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={notificationsForm.control}
                      name="emailNotifications.news"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between space-y-0">
                          <div className="space-y-0.5">
                            <FormLabel htmlFor="email_news">Actualités</FormLabel>
                            <FormDescription>
                              Recevez notre newsletter mensuelle
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch 
                              id="email_news"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="space-y-4 border-t pt-6">
                    <h3 className="text-lg font-medium">Notifications SMS</h3>
                    
                    <FormField
                      control={notificationsForm.control}
                      name="smsNotifications.urgentReservations"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between space-y-0">
                          <div className="space-y-0.5">
                            <FormLabel htmlFor="sms_reservations">Réservations urgentes</FormLabel>
                            <FormDescription>
                              Recevez un SMS pour les réservations à court terme
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch 
                              id="sms_reservations"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={notificationsForm.control}
                      name="smsNotifications.security"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between space-y-0">
                          <div className="space-y-0.5">
                            <FormLabel htmlFor="sms_security">Alertes de sécurité</FormLabel>
                            <FormDescription>
                              Recevez un SMS pour les connexions depuis un nouvel appareil
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch 
                              id="sms_security"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button type="submit">Enregistrer les préférences</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
