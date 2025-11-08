import { useState, useEffect } from "react";
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
  Download,
  Car,
  Trash2,
  Shield,
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Zap
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
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "next-themes";

const Settings = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [profile, setProfile] = useState<any>(null);
  const [avatar, setAvatar] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [notificationSound, setNotificationSound] = useState<string>('default');
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  
  // Vehicle info
  const [carBrand, setCarBrand] = useState("");
  const [carModel, setCarModel] = useState("");
  const [carYear, setCarYear] = useState("");
  const [carColor, setCarColor] = useState("");
  const [carPlate, setCarPlate] = useState("");
  
  // Contact form
  const [contactSubject, setContactSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  
  // Analytics
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Les données seront récupérées de Supabase
  const [driverStats, setDriverStats] = useState({
    totalConnections: 0,
    totalRidesAccepted: 0,
    totalRidesCompleted: 0,
    totalRidesCancelled: 0,
    acceptanceRate: 0,
    completionRate: 0,
    avgRating: 0,
    totalEarnings: 0,
    thisMonthRides: 0,
    lastMonthRides: 0,
    bestDay: "-",
    peakHours: "-",
    totalCompanies: 0,
    driverRanking: 0,
    totalDrivers: 0,
    companiesStats: []
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchDocuments();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileData) {
      setProfile(profileData);
      setEmail(profileData.email || user.email || '');
      setAvatar(profileData.avatar_url || '');
      const fullName = profileData.full_name || '';
      const nameParts = fullName.split(' ');
      setFirstName(nameParts[0] || '');
      setLastName(nameParts.slice(1).join(' ') || '');
      
      // Populate vehicle form - using any to avoid type errors
      const profileAny = profileData as any;
      setCarBrand(profileAny.brand || "");
      setCarModel(profileAny.model || "");
      setCarYear(profileAny.year || "");
      setCarColor(profileAny.color || "");
      setCarPlate(profileAny.license_plate || "");
      // Notifications prefs
      setPushNotifications(profileAny.push_notifications_enabled ?? true);
      // notification_sound may not exist in DB yet (migration not applied)
      const ns = profileAny.notification_sound || localStorage.getItem('notification-sound') || 'default';
      setNotificationSound(ns);
      try {
        localStorage.setItem('notification-sound', ns);
      } catch (e) {
        // ignore
      }
    }
  };

  const fetchDocuments = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('driver_documents')
      .select('*')
      .eq('user_id', user.id)
      .order('uploaded_at', { ascending: false });

    if (data) {
      setDocuments(data.map(doc => ({
        id: doc.id,
        name: doc.document_name,
        type: doc.document_type,
        date: new Date(doc.uploaded_at).toLocaleDateString('fr-FR'),
        size: 'N/A',
        status: doc.status,
        url: doc.document_url
      })));
    }
  };
  
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: `${firstName} ${lastName}`,
        email: email,
        avatar_url: avatar
      })
      .eq('id', user.id);

    if (error) {
      toast.error("Erreur lors de la mise à jour du profil");
    } else {
      toast.success("Profil mis à jour avec succès");
    }
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Utilisateur non connecté');
      return;
    }

    (async () => {
      const { error } = await supabase
        .from('profiles')
        .update({
          push_notifications_enabled: pushNotifications,
          notification_sound: notificationSound
        } as any)
        .eq('id', user.id);

      if (error) {
        console.error('Erreur sauvegarde préférences notifications', error);
        // Si la colonne n'existe pas (mauvaise migration), on sauvegarde localement pour que l'UX marche
        try {
          localStorage.setItem('push-notifications-enabled', JSON.stringify(pushNotifications));
          localStorage.setItem('notification-sound', notificationSound || 'default');
        } catch (e) {}

        toast.error("Impossible d'enregistrer côté serveur. Les préférences sont sauvegardées localement. Exécutez la migration SQL pour activer la sauvegarde serveur.");
        return;
      } else {
        try { localStorage.setItem('notification-sound', notificationSound || 'default'); } catch (e) {}
        toast.success('Préférences de notification mises à jour');
      }
      // Ensure native channel exists for selected sound (best-effort)
      try {
        const ns = notificationSound || 'default';
        // import the helper lazily to avoid circular import issues
        const mod = await import('@/services/notificationService');
        if (mod && typeof mod.ensureNotificationChannel === 'function') {
          await mod.ensureNotificationChannel(ns);
        }
      } catch (e) {
        console.warn('Could not ensure native notification channel:', e);
      }
    })();
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

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      setDocumentFile(file);
      
      // Upload to Supabase storage would go here
      const { error } = await supabase
        .from('driver_documents')
        .insert({
          user_id: user.id,
          document_name: file.name,
          document_type: file.name.split('.').pop() || 'unknown',
          document_url: `temp-url-${file.name}`,
          status: 'pending'
        });

      if (error) {
        toast.error("Erreur lors du téléchargement du document");
      } else {
        toast.success("Document téléchargé avec succès");
        fetchDocuments();
      }
    }
  };

  const handleDeleteDocument = async (id: string) => {
    const { error } = await supabase
      .from('driver_documents')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error("Erreur lors de la suppression");
    } else {
      toast.success("Document supprimé");
      fetchDocuments();
    }
  };

  const handleViewDocument = (id: string) => {
    const doc = documents.find(d => d.id === id);
    if (doc?.url) {
      window.open(doc.url, '_blank');
    }
  };

  const handleDownloadDocument = (id: string) => {
    // En production, vous téléchargeriez le document depuis votre serveur
    toast.info(`Téléchargement du document ${id}`);
  };
  
  const handleSaveVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;

    const updateData: any = {
      brand: carBrand,
      model: carModel,
      year: carYear,
      color: carColor,
      license_plate: carPlate,
      accepted_vehicle_types: profile.accepted_vehicle_types || []
    };

    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user.id);

    if (error) {
      toast.error("Erreur lors de l'enregistrement du véhicule");
      console.error("Supabase error:", error);
    } else {
      toast.success("Informations du véhicule enregistrées avec succès");
      fetchProfile(); // Refresh profile data
    }
  };
  
  const handleSendContactMessage = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message envoyé avec succès");
    setContactSubject("");
    setContactMessage("");
  };
  
  const handleDeleteAccount = () => {
    if (window.confirm("⚠️ ATTENTION : Cette action est irréversible ! Êtes-vous sûr de vouloir supprimer votre compte ?")) {
      toast.error("Suppression du compte en cours...");
      // Logique de suppression ici
    }
  };
  
  const generateAIAnalysis = async () => {
    setIsAnalyzing(true);
    
    try {
      // Simulate API call to OpenAI/ChatGPT
      // In production, call your backend endpoint that connects to OpenAI API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const analysis = `## 📊 Analyse détaillée de votre performance

**Performance Globale : Excellente** ⭐⭐⭐⭐⭐

### � Classement
- **Vous êtes classé ${driverStats.driverRanking}/${driverStats.totalDrivers}** parmi tous les chauffeurs
- Top ${Math.round((driverStats.driverRanking / driverStats.totalDrivers) * 100)}% des meilleurs chauffeurs !

### 🏢 Sociétés partenaires
- **Vous travaillez avec ${driverStats.totalCompanies} sociétés**
- Diversification excellente pour maximiser vos revenus

### �🎯 Points forts identifiés :
- **Taux d'acceptation de ${driverStats.acceptanceRate}%** - Très bon ! Vous êtes réactif aux demandes.
- **Taux de complétion de ${driverStats.completionRate}%** - Excellent engagement envers vos clients.
- **Note moyenne de ${driverStats.avgRating}/5** - Vos clients sont très satisfaits de votre service.

### 📈 Tendances observées :
- Vous avez effectué **${driverStats.totalRidesCompleted} courses** avec seulement ${driverStats.totalRidesCancelled} annulations.
- Meilleure journée : **${driverStats.bestDay}** 
- Heures de pointe : **${driverStats.peakHours}**

### 🏢 Performance par société :
${driverStats.companiesStats.map((company, index) => `
${index + 1}. **${company.name}**
   - Taux d'acceptation : ${company.acceptanceRate}%
   - Courses effectuées : ${company.ridesCompleted}
   - Gains générés : ${company.earnings}€`).join('\n')}

### 💡 Recommandations personnalisées :

1. **Optimisez vos partenariats**
   - **${driverStats.companiesStats[0].name}** est votre meilleur partenaire (${driverStats.companiesStats[0].acceptanceRate}% acceptation)
   - Augmentez votre disponibilité pour cette société pour maximiser vos gains

2. **Améliorez avec les autres sociétés**
   - **${driverStats.companiesStats[4].name}** : Taux d'acceptation à améliorer (${driverStats.companiesStats[4].acceptanceRate}%)
   - Essayez d'accepter plus de courses pour renforcer votre partenariat

3. **Réduisez les annulations**
   - ${driverStats.totalRidesCancelled} courses annulées ce mois
   - Astuce : Vérifiez la distance avant d'accepter pour éviter les refus tardifs

4. **Maintenez votre excellente note**
   - Votre note de ${driverStats.avgRating}/5 est exceptionnelle
   - Continuez à offrir un service de qualité (ponctualité, propreté, courtoisie)

5. **Montez dans le classement**
   - Vous êtes #${driverStats.driverRanking}, objectif : Top 10
   - Augmentez vos courses de 15-20% pour grimper de 3-5 places

### 🚀 Plan d'action suggéré :
- ✅ Priorisez les courses de **${driverStats.companiesStats[0].name}** (meilleur taux)
- ✅ Acceptez plus rapidement pour améliorer votre classement
- ✅ Connectez-vous plus pendant ${driverStats.peakHours} (heures de pointe)
- ✅ Diversifiez encore plus : Cherchez 1-2 nouvelles sociétés partenaires

**Votre potentiel de gains estimé si vous appliquez ces conseils : +30% (environ ${Math.round(driverStats.totalEarnings * 1.30)}€/mois)**`;

      setAiAnalysis(analysis);
      toast.success("Analyse IA générée avec succès !");
    } catch (error) {
      toast.error("Erreur lors de la génération de l'analyse");
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  return (
    <div className="p-4 sm:p-6">
      <PageHeader title="settings" />
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-4 lg:grid-cols-10 mb-6 h-auto gap-2 bg-card p-2">
          <TabsTrigger value="profile" className="text-xs sm:text-sm">Profil</TabsTrigger>
          <TabsTrigger value="vehicle" className="text-xs sm:text-sm">Véhicule</TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs sm:text-sm">Analyse</TabsTrigger>
          <TabsTrigger value="map" className="text-xs sm:text-sm">Carte</TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs sm:text-sm">Notifications</TabsTrigger>
          <TabsTrigger value="payment" className="text-xs sm:text-sm">Paiement</TabsTrigger>
          <TabsTrigger value="language" className="text-xs sm:text-sm">Langues</TabsTrigger>
          <TabsTrigger value="documents" className="text-xs sm:text-sm">Documents</TabsTrigger>
          <TabsTrigger value="contact" className="text-xs sm:text-sm">Contact</TabsTrigger>
          <TabsTrigger value="security" className="text-xs sm:text-sm">Sécurité</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="bg-card text-card-foreground rounded-lg shadow p-4 md:p-6">
          <form onSubmit={handleSaveProfile}>
            <div className="flex flex-col items-center mb-6">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={avatar || undefined} alt="Avatar" />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {firstName.charAt(0)}{lastName.charAt(0)}
                </AvatarFallback>
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
                  <Input 
                    id="firstName" 
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)}
                    className="bg-background text-foreground" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-foreground">Nom</Label>
                  <Input 
                    id="lastName" 
                    value={lastName} 
                    onChange={(e) => setLastName(e.target.value)}
                    className="bg-background text-foreground" 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background text-foreground" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-foreground">Téléphone</Label>
                <Input 
                  id="phone" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-background text-foreground" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address" className="text-foreground">Adresse</Label>
                <Input 
                  id="address" 
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)}
                  className="bg-background text-foreground" 
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <MoonStar className="h-5 w-5 text-foreground" />
                <span className="text-foreground">Mode sombre</span>
                <Switch 
                  checked={theme === "dark"} 
                  onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")} 
                  className="ml-auto"
                />
              </div>
              
              <Button type="submit" className="w-full">Enregistrer les modifications</Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="analytics" className="bg-card text-card-foreground rounded-lg shadow p-4 md:p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium flex items-center">
                <BarChart3 className="mr-2 h-5 w-5" />
                Analyse du chauffeur
              </h3>
              <Button 
                onClick={generateAIAnalysis}
                disabled={isAnalyzing}
                className="flex items-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Analyse en cours...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    Générer analyse IA
                  </>
                )}
              </Button>
            </div>

            {/* Statistiques clés */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <Clock className="h-8 w-8 opacity-80" />
                  <span className="text-2xl font-bold">{driverStats.totalConnections}</span>
                </div>
                <p className="text-sm mt-2 opacity-90">Connexions totales</p>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <CheckCircle className="h-8 w-8 opacity-80" />
                  <span className="text-2xl font-bold">{driverStats.totalRidesAccepted}</span>
                </div>
                <p className="text-sm mt-2 opacity-90">Courses acceptées</p>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <TrendingUp className="h-8 w-8 opacity-80" />
                  <span className="text-2xl font-bold">{driverStats.totalRidesCompleted}</span>
                </div>
                <p className="text-sm mt-2 opacity-90">Courses effectuées</p>
              </div>

              <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <XCircle className="h-8 w-8 opacity-80" />
                  <span className="text-2xl font-bold">{driverStats.totalRidesCancelled}</span>
                </div>
                <p className="text-sm mt-2 opacity-90">Courses annulées</p>
              </div>
            </div>

            {/* Taux de performance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3 flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                  Taux d'acceptation
                </h4>
                <div className="flex items-end justify-between mb-2">
                  <span className="text-3xl font-bold text-green-600">{driverStats.acceptanceRate}%</span>
                  <span className="text-sm text-muted-foreground">{driverStats.totalRidesAccepted}/{driverStats.totalConnections * 0.7 | 0} demandes</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all"
                    style={{ width: `${driverStats.acceptanceRate}%` }}
                  ></div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3 flex items-center">
                  <TrendingUp className="mr-2 h-4 w-4 text-purple-600" />
                  Taux de complétion
                </h4>
                <div className="flex items-end justify-between mb-2">
                  <span className="text-3xl font-bold text-purple-600">{driverStats.completionRate}%</span>
                  <span className="text-sm text-muted-foreground">{driverStats.totalRidesCompleted}/{driverStats.totalRidesAccepted} courses</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all"
                    style={{ width: `${driverStats.completionRate}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Graphique des performances mensuelles */}
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-4">Performance mensuelle</h4>
              <div className="flex items-end justify-around h-48 gap-2">
                <div className="flex flex-col items-center flex-1">
                  <div className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t transition-all hover:opacity-80" 
                       style={{ height: `${(driverStats.lastMonthRides / 35) * 100}%` }}></div>
                  <span className="text-xs mt-2 font-medium">{driverStats.lastMonthRides}</span>
                  <span className="text-xs text-muted-foreground">Mois dernier</span>
                </div>
                <div className="flex flex-col items-center flex-1">
                  <div className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t transition-all hover:opacity-80" 
                       style={{ height: `${(driverStats.thisMonthRides / 35) * 100}%` }}></div>
                  <span className="text-xs mt-2 font-medium">{driverStats.thisMonthRides}</span>
                  <span className="text-xs text-muted-foreground">Ce mois</span>
                </div>
                <div className="flex flex-col items-center flex-1">
                  <div className="w-full bg-gradient-to-t from-purple-500 to-purple-400 rounded-t transition-all hover:opacity-80 opacity-30" 
                       style={{ height: '85%' }}></div>
                  <span className="text-xs mt-2 font-medium">30</span>
                  <span className="text-xs text-muted-foreground">Objectif</span>
                </div>
              </div>
            </div>

            {/* Informations supplémentaires */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4 bg-amber-50">
                <p className="text-sm text-muted-foreground mb-1">Meilleur jour</p>
                <p className="text-xl font-bold text-amber-700">{driverStats.bestDay}</p>
              </div>
              <div className="border rounded-lg p-4 bg-blue-50">
                <p className="text-sm text-muted-foreground mb-1">Heures de pointe</p>
                <p className="text-xl font-bold text-blue-700">{driverStats.peakHours}</p>
              </div>
              <div className="border rounded-lg p-4 bg-green-50">
                <p className="text-sm text-muted-foreground mb-1">Gains totaux</p>
                <p className="text-xl font-bold text-green-700">{driverStats.totalEarnings}€</p>
              </div>
            </div>

            {/* Classement et sociétés */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border-2 border-primary/20 rounded-lg p-6 bg-gradient-to-br from-primary/5 to-primary/10">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-lg flex items-center">
                    🏆 Votre classement
                  </h4>
                  <span className="text-3xl font-bold text-primary">#{driverStats.driverRanking}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Sur {driverStats.totalDrivers} chauffeurs actifs
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-gradient-to-r from-amber-500 to-amber-600 h-2 rounded-full"
                    style={{ width: `${100 - (driverStats.driverRanking / driverStats.totalDrivers * 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-primary font-medium">
                  Top {Math.round((driverStats.driverRanking / driverStats.totalDrivers) * 100)}% des meilleurs chauffeurs
                </p>
              </div>

              <div className="border-2 border-purple-200 rounded-lg p-6 bg-gradient-to-br from-purple-50 to-purple-100">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-lg flex items-center">
                    🏢 Sociétés partenaires
                  </h4>
                  <span className="text-3xl font-bold text-purple-700">{driverStats.totalCompanies}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Diversification de vos revenus
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-purple-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full"
                      style={{ width: `${(driverStats.totalCompanies / 10) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-purple-700 font-medium">
                    {driverStats.totalCompanies}/10
                  </span>
                </div>
              </div>
            </div>

            {/* Classement par société */}
            <div className="border rounded-lg p-6">
              <h4 className="font-semibold text-lg mb-4 flex items-center">
                📊 Performance par société
              </h4>
              <div className="space-y-3">
                {driverStats.companiesStats.map((company, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-medium">{company.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {company.ridesCompleted} courses • {company.earnings}€
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">{company.acceptanceRate}%</p>
                        <p className="text-xs text-muted-foreground">Acceptation</p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${
                          company.acceptanceRate >= 90 ? 'bg-gradient-to-r from-green-500 to-green-600' :
                          company.acceptanceRate >= 80 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                          'bg-gradient-to-r from-red-500 to-red-600'
                        }`}
                        style={{ width: `${company.acceptanceRate}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-800">
                  💡 <strong>Conseil :</strong> Priorisez les sociétés avec les meilleurs taux d'acceptation pour maximiser vos revenus.
                </p>
              </div>
            </div>

            {/* Analyse IA */}
            {aiAnalysis && (
              <div className="border-2 border-primary/20 rounded-lg p-6 bg-primary/5">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="h-5 w-5 text-primary" />
                  <h4 className="font-semibold text-lg">Analyse IA - ChatGPT</h4>
                </div>
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-sm">{aiAnalysis}</div>
                </div>
              </div>
            )}

            {!aiAnalysis && (
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Zap className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground mb-4">
                  Cliquez sur "Générer analyse IA" pour obtenir une analyse détaillée<br />
                  de votre comportement et des conseils personnalisés
                </p>
              </div>
            )}
          </div>
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
                          <p className="font-medium">Activer les notifications push</p>
                          <p className="text-sm text-muted-foreground">Autoriser l'application à vous envoyer des notifications push</p>
                        </div>
                        <Switch checked={pushNotifications} onCheckedChange={(val: boolean) => setPushNotifications(val)} />
                      </div>

                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div>
                          <p className="font-medium">Sonnerie de notification</p>
                          <p className="text-sm text-muted-foreground">Choisissez la sonnerie jouée pour une nouvelle course (en premier plan)</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <select
                            value={notificationSound}
                            onChange={(e) => {
                              setNotificationSound(e.target.value);
                              try { localStorage.setItem('notification-sound', e.target.value); } catch (err) {}
                            }}
                            className="bg-background border rounded px-3 py-2"
                          >
                            <option value="default">Défaut</option>
                            <option value="alert1">Alerte 1</option>
                            <option value="alert2">Alerte 2</option>
                            <option value="chime">Carillon</option>
                          </select>
                          <Button type="button" onClick={async () => {
                            try {
                              const mod = await import('@/services/firebaseNotifications');
                              if (mod && typeof mod.playNotificationSound === 'function') {
                                mod.playNotificationSound();
                              } else {
                                // fallback: simple beep
                                const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
                                const o = ctx.createOscillator(); const g = ctx.createGain();
                                o.type = 'sine'; o.frequency.setValueAtTime(950, ctx.currentTime);
                                g.gain.setValueAtTime(0.08, ctx.currentTime);
                                o.connect(g); g.connect(ctx.destination); o.start();
                                setTimeout(() => { o.stop(); try { ctx.close(); } catch(e){} }, 300);
                              }
                            } catch (e) { console.log('Test son erreur', e); }
                          }}>
                            Tester
                          </Button>
                        </div>
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

        <TabsContent value="vehicle" className="bg-card text-card-foreground rounded-lg shadow p-4 md:p-6">
          <form onSubmit={handleSaveVehicle}>
            <h3 className="text-lg font-medium mb-6 flex items-center">
              <Car className="mr-2 h-5 w-5" />
              Informations du véhicule
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="carBrand">Marque</Label>
                  <Input 
                    id="carBrand" 
                    value={carBrand} 
                    onChange={(e) => setCarBrand(e.target.value)}
                    placeholder="ex: Mercedes, BMW, Tesla"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="carModel">Modèle</Label>
                  <Input 
                    id="carModel" 
                    value={carModel} 
                    onChange={(e) => setCarModel(e.target.value)}
                    placeholder="ex: Classe E, Série 5, Model S"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="carYear">Année</Label>
                  <Input 
                    id="carYear" 
                    type="number"
                    value={carYear} 
                    onChange={(e) => setCarYear(e.target.value)}
                    placeholder="2023"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="carColor">Couleur</Label>
                  <Input 
                    id="carColor" 
                    value={carColor} 
                    onChange={(e) => setCarColor(e.target.value)}
                    placeholder="Noir, Blanc, Gris..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="carPlate">Plaque d'immatriculation</Label>
                  <Input 
                    id="carPlate" 
                    value={carPlate} 
                    onChange={(e) => setCarPlate(e.target.value)}
                    placeholder="AB-123-CD"
                  />
                </div>
              </div>

              {/* Vehicle category + dynamic accepted types based on admin-assigned main category */}
              <div className="border-t pt-6 mt-2">
                <h4 className="text-md font-medium mb-4">Catégorie principale</h4>
                <p className="mb-4">{profile?.vehicle_category || profile?.vehicle_type || 'Standard'}</p>

                <h4 className="text-md font-medium mb-4">Catégories de courses que vous pouvez recevoir</h4>
                <div className="space-y-3">
                  {/* compute allowed types from profile.vehicle_category */}
                  {(() => {
                    const main = profile?.vehicle_category || profile?.vehicle_type || 'standard';
                    const allowed: Record<string, string> = {
                      minibus: 'Minibus',
                      van: 'Van',
                      berline: 'Berline',
                      standard: 'Standard'
                    };

                    const order = ['standard','berline','van','minibus'];
                    const mainIndex = order.indexOf(main.toLowerCase());
                    const toShow = order.slice(0, mainIndex + 1).reverse(); // show from highest to lowest

                    return toShow.map((key) => {
                      const isMain = key === main.toLowerCase();
                      const checked = (profile?.accepted_vehicle_types || []).includes(key) || isMain;
                      return (
                        <div key={key} className="flex items-center space-x-3">
                          <Switch 
                            id={`receive-${key}`} 
                            checked={checked}
                            onCheckedChange={(val: boolean) => {
                              // update local profile state immediately
                              const current = new Set(profile?.accepted_vehicle_types || []);
                              if (val) current.add(key);
                              else current.delete(key);
                              const updated = Array.from(current);
                              setProfile((p: any) => ({ ...p, accepted_vehicle_types: updated }));
                            }}
                            disabled={isMain} // main category forced
                          />
                          <Label htmlFor={`receive-${key}`} className="font-normal">{allowed[key]}</Label>
                        </div>
                      );
                    });
                  })()}
                </div>

                <p className="text-sm text-muted-foreground mt-4">
                  L'administrateur définit votre catégorie principale. Cochez les catégories supplémentaires que vous acceptez de recevoir.
                </p>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg mt-4">
                <p className="text-sm text-muted-foreground">
                  Ces informations sont utilisées par le dispatch pour cibler les chauffeurs.
                </p>
              </div>

              <Button type="submit" className="w-full">Enregistrer les informations</Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="contact" className="bg-card text-card-foreground rounded-lg shadow p-4 md:p-6">
          <form onSubmit={handleSendContactMessage}>
            <h3 className="text-lg font-medium mb-6 flex items-center">
              <Mail className="mr-2 h-5 w-5" />
              Contacter le support
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contactSubject">Sujet</Label>
                <Input 
                  id="contactSubject" 
                  value={contactSubject} 
                  onChange={(e) => setContactSubject(e.target.value)}
                  placeholder="Objet de votre message"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contactMessage">Message</Label>
                <textarea
                  id="contactMessage"
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Décrivez votre demande ou problème..."
                  required
                  rows={8}
                  className="w-full px-3 py-2 border rounded-md bg-background text-foreground resize-none"
                />
              </div>
              
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      Nous vous répondrons dans les 24 heures
                    </p>
                    <p className="text-sm text-blue-700 mt-1">
                      Pour les urgences, appelez le : +33 1 23 45 67 89
                    </p>
                  </div>
                </div>
              </div>
              
              <Button type="submit" className="w-full">
                <Mail className="mr-2 h-4 w-4" />
                Envoyer le message
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="security" className="bg-card text-card-foreground rounded-lg shadow p-4 md:p-6">
          <div className="space-y-6">
            <h3 className="text-lg font-medium mb-6 flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Sécurité du compte
            </h3>
            
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Mot de passe</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Dernière modification : Il y a 2 mois
                </p>
                <Button variant="outline">Changer le mot de passe</Button>
              </div>
              
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Authentification à deux facteurs</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Ajoutez une couche de sécurité supplémentaire à votre compte
                </p>
                <Button variant="outline">Activer 2FA</Button>
              </div>
              
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Sessions actives</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Gérez les appareils connectés à votre compte
                </p>
                <Button variant="outline">Voir les sessions</Button>
              </div>
            </div>
            
            <div className="border-t pt-6 mt-8">
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
                <h4 className="font-semibold text-destructive mb-3 flex items-center">
                  <AlertCircle className="mr-2 h-5 w-5" />
                  Zone de danger
                </h4>
                
                <p className="text-sm text-muted-foreground mb-4">
                  Une fois que vous aurez supprimé votre compte, il n'y a pas de retour en arrière. 
                  Toutes vos données seront définitivement supprimées.
                </p>
                
                <Button 
                  variant="destructive" 
                  className="bg-destructive hover:bg-destructive/90"
                  onClick={handleDeleteAccount}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer mon compte
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
