
import React, { useState } from "react";
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

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const { t } = useLanguage();
  
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
            <Button className="w-fit">
              {t("settings_section.profile.save_changes")}
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="documents">
          <h2 className="text-xl font-semibold">{t("settings_section.documents.title")}</h2>
          <p className="text-gray-600 mb-4">{t("settings_section.documents.manage")}</p>
          
          <div className="border rounded-lg p-4 my-4">
            <h3 className="font-medium mb-2">Permis de conduire</h3>
            <div className="flex items-center justify-between">
              <span className="text-sm text-green-600">Vérifié</span>
              <Button variant="outline" size="sm">Voir le document</Button>
            </div>
          </div>
          
          <div className="border rounded-lg p-4 my-4">
            <h3 className="font-medium mb-2">Carte d'identité</h3>
            <div className="flex items-center justify-between">
              <span className="text-sm text-green-600">Vérifié</span>
              <Button variant="outline" size="sm">Voir le document</Button>
            </div>
          </div>
          
          <div className="border rounded-lg p-4 my-4">
            <h3 className="font-medium mb-2">Attestation d'assurance</h3>
            <div className="flex items-center justify-between">
              <span className="text-sm text-amber-600">En attente de vérification</span>
              <Button variant="outline" size="sm">Voir le document</Button>
            </div>
          </div>
          
          <Button className="mt-4">
            Télécharger un document
          </Button>
        </TabsContent>
        
        <TabsContent value="payments">
          <h2 className="text-xl font-semibold">{t("settings_section.payments.methods")}</h2>
          <p className="text-gray-600 mb-4">{t("settings_section.payments.add_method")}</p>
          
          <div className="border rounded-lg p-4 my-4">
            <h3 className="font-medium mb-2">Carte Visa ****4578</h3>
            <div className="flex items-center justify-between">
              <span className="text-sm">Expire le 09/25</span>
              <Button variant="outline" size="sm" className="text-red-500">Supprimer</Button>
            </div>
          </div>
          
          <div className="border rounded-lg p-4 my-4">
            <h3 className="font-medium mb-2">Compte bancaire</h3>
            <div className="flex items-center justify-between">
              <span className="text-sm">IBAN FR76****1234</span>
              <Button variant="outline" size="sm" className="text-red-500">Supprimer</Button>
            </div>
          </div>
          
          <Button className="mt-4">
            Ajouter un moyen de paiement
          </Button>
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
                <Button className="w-fit">
                  Mettre à jour le mot de passe
                </Button>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <h3 className="font-medium mb-2">Authentification à deux facteurs</h3>
              <div className="flex items-center justify-between">
                <span className="text-sm">Protection supplémentaire pour votre compte</span>
                <Button size="sm">
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
                    <AlertDialogAction className="bg-red-600 hover:bg-red-700">
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
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-medium">Notifications par email</h3>
                <p className="text-sm text-gray-500">Recevez des emails pour les mises à jour importantes</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-medium">Notifications SMS</h3>
                <p className="text-sm text-gray-500">Recevez des SMS pour les alertes urgentes</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Alertes marketing</h3>
                <p className="text-sm text-gray-500">Informations sur les offres et promotions</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
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
    </div>
  );
};

export default Settings;
