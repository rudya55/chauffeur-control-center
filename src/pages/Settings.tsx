
import React, { useState, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/hooks/use-language";
import { LanguageCard } from "@/components/LanguageCard";
import { Languages, FileText, CreditCard, Shield, Bell, User } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const { t } = useLanguage();
  const [showAddPaymentForm, setShowAddPaymentForm] = useState(false);
  const [selectedPaymentType, setSelectedPaymentType] = useState("card");
  const fileInputRefs = {
    permit: useRef<HTMLInputElement>(null),
    identity: useRef<HTMLInputElement>(null),
    insurance: useRef<HTMLInputElement>(null)
  };
  const [documents, setDocuments] = useState({
    permit: null,
    identity: null,
    insurance: null
  });
  const [viewingDocument, setViewingDocument] = useState<{name: string, url: string} | null>(null);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setDocuments(prev => ({
        ...prev,
        [docType]: {
          name: file.name,
          url: url,
          type: file.type
        }
      }));
      toast.success(`Document ${file.name} téléchargé avec succès`);
    }
  };
  
  const initiateDocumentUpload = (docType: string) => {
    fileInputRefs[docType as keyof typeof fileInputRefs]?.current?.click();
  };
  
  const viewDocument = (docType: string) => {
    const doc = documents[docType as keyof typeof documents];
    if (doc) {
      setViewingDocument({
        name: doc.name,
        url: doc.url
      });
    } else {
      toast.error("Aucun document disponible");
    }
  };

  const handleAddPaymentMethod = () => {
    // This would typically connect to a payment gateway
    toast.success("Méthode de paiement ajoutée avec succès");
    setShowAddPaymentForm(false);
  };
  
  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">{t("settings_section.title")}</h1>
      
      <Tabs
        defaultValue="profile"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="w-full mb-6 overflow-x-auto flex">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            {t("settings_section.tabs.profile")}
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            {t("settings_section.tabs.documents")}
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            {t("settings_section.tabs.payments")}
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            {t("settings_section.tabs.security")}
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            {t("settings_section.tabs.notifications")}
          </TabsTrigger>
          <TabsTrigger value="language" className="flex items-center gap-2">
            <Languages className="h-4 w-4" />
            {t("settings_section.tabs.language")}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-4">
          <h2 className="text-xl font-semibold">{t("settings_section.profile.personal_info")}</h2>
          <p className="text-gray-600">{t("settings_section.profile.update_info")}</p>
          
          <div className="grid gap-4 py-4">
            <div>
              <label className="text-sm font-medium">{t("settings_section.profile.full_name")}</label>
              <input type="text" className="w-full mt-1 p-2 border rounded" defaultValue="Jean Dupont" />
            </div>
            <div>
              <label className="text-sm font-medium">{t("settings_section.profile.email")}</label>
              <input type="email" className="w-full mt-1 p-2 border rounded" defaultValue="jean.dupont@example.com" />
            </div>
            <div>
              <label className="text-sm font-medium">{t("settings_section.profile.phone")}</label>
              <input type="tel" className="w-full mt-1 p-2 border rounded" defaultValue="+33 6 12 34 56 78" />
            </div>
            <Button className="w-fit" onClick={() => toast.success("Profil mis à jour avec succès")}>
              {t("settings_section.profile.save_changes")}
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="documents">
          <h2 className="text-xl font-semibold">{t("settings_section.documents.title")}</h2>
          <p className="text-gray-600 mb-4">{t("settings_section.documents.manage")}</p>
          
          {/* Hidden file inputs */}
          <input 
            ref={fileInputRefs.permit}
            type="file" 
            className="hidden"
            accept="image/*,.pdf" 
            onChange={(e) => handleFileChange(e, "permit")}
          />
          <input 
            ref={fileInputRefs.identity}
            type="file" 
            className="hidden"
            accept="image/*,.pdf" 
            onChange={(e) => handleFileChange(e, "identity")}
          />
          <input 
            ref={fileInputRefs.insurance}
            type="file" 
            className="hidden"
            accept="image/*,.pdf" 
            onChange={(e) => handleFileChange(e, "insurance")}
          />
          
          <div className="border rounded-lg p-4 my-4">
            <h3 className="font-medium mb-2">Permis de conduire</h3>
            <div className="flex items-center justify-between">
              <span className="text-sm text-green-600">
                {documents.permit ? "Document téléchargé" : "Vérifié"}
              </span>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => documents.permit ? viewDocument("permit") : initiateDocumentUpload("permit")}
                >
                  {documents.permit ? "Voir le document" : "Télécharger"}
                </Button>
                {documents.permit && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => initiateDocumentUpload("permit")}
                  >
                    Modifier
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          <div className="border rounded-lg p-4 my-4">
            <h3 className="font-medium mb-2">Carte d'identité</h3>
            <div className="flex items-center justify-between">
              <span className="text-sm text-green-600">
                {documents.identity ? "Document téléchargé" : "Vérifié"}
              </span>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => documents.identity ? viewDocument("identity") : initiateDocumentUpload("identity")}
                >
                  {documents.identity ? "Voir le document" : "Télécharger"}
                </Button>
                {documents.identity && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => initiateDocumentUpload("identity")}
                  >
                    Modifier
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          <div className="border rounded-lg p-4 my-4">
            <h3 className="font-medium mb-2">Attestation d'assurance</h3>
            <div className="flex items-center justify-between">
              <span className="text-sm text-amber-600">
                {documents.insurance ? "Document téléchargé" : "En attente de vérification"}
              </span>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => documents.insurance ? viewDocument("insurance") : initiateDocumentUpload("insurance")}
                >
                  {documents.insurance ? "Voir le document" : "Télécharger"}
                </Button>
                {documents.insurance && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => initiateDocumentUpload("insurance")}
                  >
                    Modifier
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          <Button 
            className="mt-4" 
            onClick={() => document.getElementById('general-doc-upload')?.click()}
          >
            Télécharger un document
          </Button>
          <input 
            id="general-doc-upload" 
            type="file" 
            className="hidden" 
            accept="image/*,.pdf"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                toast.success(`Document ${file.name} téléchargé avec succès`);
              }
            }}
          />
        </TabsContent>
        
        <TabsContent value="payments">
          <h2 className="text-xl font-semibold">{t("settings_section.payments.methods")}</h2>
          <p className="text-gray-600 mb-4">{t("settings_section.payments.add_method")}</p>
          
          <div className="border rounded-lg p-4 my-4">
            <h3 className="font-medium mb-2">Carte Visa ****4578</h3>
            <div className="flex items-center justify-between">
              <span className="text-sm">Expire le 09/25</span>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-red-500" 
                onClick={() => toast.success("Carte supprimée")}
              >
                Supprimer
              </Button>
            </div>
          </div>
          
          <div className="border rounded-lg p-4 my-4">
            <h3 className="font-medium mb-2">Compte bancaire</h3>
            <div className="flex items-center justify-between">
              <span className="text-sm">IBAN FR76****1234</span>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-red-500"
                onClick={() => toast.success("Compte bancaire supprimé")}
              >
                Supprimer
              </Button>
            </div>
          </div>
          
          <Dialog open={showAddPaymentForm} onOpenChange={setShowAddPaymentForm}>
            <DialogTrigger asChild>
              <Button className="mt-4">
                Ajouter un moyen de paiement
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un moyen de paiement</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <label className="block mb-2">Type</label>
                  <select 
                    className="w-full p-2 border rounded"
                    value={selectedPaymentType}
                    onChange={(e) => setSelectedPaymentType(e.target.value)}
                  >
                    <option value="card">Carte de crédit</option>
                    <option value="bank">Compte bancaire</option>
                  </select>
                </div>
                
                {selectedPaymentType === "card" ? (
                  <>
                    <div>
                      <label className="block mb-2">Numéro de carte</label>
                      <input 
                        type="text" 
                        className="w-full p-2 border rounded" 
                        placeholder="1234 5678 9012 3456" 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2">Date d'expiration</label>
                        <input type="text" className="w-full p-2 border rounded" placeholder="MM/AA" />
                      </div>
                      <div>
                        <label className="block mb-2">CVV</label>
                        <input type="text" className="w-full p-2 border rounded" placeholder="123" />
                      </div>
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="block mb-2">IBAN</label>
                    <input 
                      type="text" 
                      className="w-full p-2 border rounded" 
                      placeholder="FR76 1234 5678 9012 3456 7890 123" 
                    />
                  </div>
                )}
                
                <div>
                  <label className="block mb-2">Nom sur le compte</label>
                  <input type="text" className="w-full p-2 border rounded" placeholder="Jean Dupont" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddPaymentForm(false)}>Annuler</Button>
                <Button onClick={handleAddPaymentMethod}>Ajouter</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>
        
        <TabsContent value="security">
          <h2 className="text-xl font-semibold">{t("settings_section.security.title")}</h2>
          <p className="text-gray-600 mb-4">{t("settings_section.security.manage")}</p>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Changer le mot de passe</h3>
              <div className="grid gap-3">
                <div>
                  <label className="text-sm font-medium">Mot de passe actuel</label>
                  <input type="password" className="w-full mt-1 p-2 border rounded" />
                </div>
                <div>
                  <label className="text-sm font-medium">Nouveau mot de passe</label>
                  <input type="password" className="w-full mt-1 p-2 border rounded" />
                </div>
                <div>
                  <label className="text-sm font-medium">Confirmer le mot de passe</label>
                  <input type="password" className="w-full mt-1 p-2 border rounded" />
                </div>
                <Button className="w-fit" onClick={() => toast.success("Mot de passe mis à jour")}>
                  Mettre à jour le mot de passe
                </Button>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <h3 className="font-medium mb-2">Authentification à deux facteurs</h3>
              <div className="flex items-center justify-between">
                <span className="text-sm">Protection supplémentaire pour votre compte</span>
                <Button size="sm" onClick={() => toast.success("Authentification à deux facteurs activée")}>
                  Activer
                </Button>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <h3 className="font-medium mb-2 text-red-600">Zone de danger</h3>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Supprimer mon compte</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer votre compte?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action est définitive. Toutes vos données et votre historique seront supprimés.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => toast.error("Compte supprimé")}>
                      Supprimer définitivement
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="notifications">
          <h2 className="text-xl font-semibold">{t("settings_section.notifications.title")}</h2>
          <p className="text-gray-600 mb-4">{t("settings_section.notifications.configure")}</p>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-medium">Notifications de réservation</h3>
                <p className="text-sm text-gray-500">Soyez informé des nouvelles réservations</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  defaultChecked 
                  onChange={() => toast.success("Préférence mise à jour")}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-medium">Notifications par email</h3>
                <p className="text-sm text-gray-500">Recevez des emails pour les mises à jour importantes</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  defaultChecked 
                  onChange={() => toast.success("Préférence mise à jour")}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-medium">Notifications SMS</h3>
                <p className="text-sm text-gray-500">Recevez des SMS pour les alertes urgentes</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  onChange={() => toast.success("Préférence mise à jour")}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-medium">Alertes de vol</h3>
                <p className="text-sm text-gray-500">Recevez des notifications si votre véhicule est suspect d'être volé</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  defaultChecked 
                  onChange={() => toast.success("Alertes de vol activées")}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Alertes marketing</h3>
                <p className="text-sm text-gray-500">Informations sur les offres et promotions</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  onChange={() => toast.success("Préférence mise à jour")}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="language" className="space-y-4">
          <div className="max-w-md">
            <LanguageCard />
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Document viewer dialog */}
      {viewingDocument && (
        <Dialog open={!!viewingDocument} onOpenChange={() => setViewingDocument(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{viewingDocument.name}</DialogTitle>
            </DialogHeader>
            <div className="flex justify-center p-4 max-h-[70vh] overflow-auto">
              {viewingDocument.url.includes('.pdf') ? (
                <iframe 
                  src={viewingDocument.url} 
                  className="w-full h-[500px]" 
                  title="Document viewer"
                ></iframe>
              ) : (
                <img 
                  src={viewingDocument.url} 
                  alt="Document" 
                  className="max-w-full max-h-[500px] object-contain" 
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Settings;
