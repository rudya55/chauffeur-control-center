import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/hooks/use-language";
import { LanguageCard } from "@/components/LanguageCard";
import { Language } from 'lucide-react';

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
          <TabsTrigger value="profile">{t("settings_section.tabs.profile")}</TabsTrigger>
          <TabsTrigger value="documents">{t("settings_section.tabs.documents")}</TabsTrigger>
          <TabsTrigger value="payments">{t("settings_section.tabs.payments")}</TabsTrigger>
          <TabsTrigger value="security">{t("settings_section.tabs.security")}</TabsTrigger>
          <TabsTrigger value="notifications">{t("settings_section.tabs.notifications")}</TabsTrigger>
          <TabsTrigger value="language">{t("settings_section.tabs.language")}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-4">
          <h2 className="text-xl font-semibold">{t("settings_section.profile.personal_info")}</h2>
          <p className="text-gray-600">{t("settings_section.profile.update_info")}</p>
          
          {/* Profile content would go here */}
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
            <button className="bg-primary text-white py-2 px-4 rounded mt-2">
              {t("settings_section.profile.save_changes")}
            </button>
          </div>
        </TabsContent>
        
        <TabsContent value="documents">
          <h2 className="text-xl font-semibold">{t("settings_section.documents.title")}</h2>
          <p className="text-gray-600 mb-4">{t("settings_section.documents.manage")}</p>
          
          {/* Documents content would go here */}
        </TabsContent>
        
        <TabsContent value="payments">
          <h2 className="text-xl font-semibold">{t("settings_section.payments.methods")}</h2>
          <p className="text-gray-600 mb-4">{t("settings_section.payments.add_method")}</p>
          
          {/* Payments content would go here */}
        </TabsContent>
        
        <TabsContent value="security">
          <h2 className="text-xl font-semibold">{t("settings_section.security.title")}</h2>
          <p className="text-gray-600 mb-4">{t("settings_section.security.manage")}</p>
          
          {/* Security content would go here */}
        </TabsContent>
        
        <TabsContent value="notifications">
          <h2 className="text-xl font-semibold">{t("settings_section.notifications.title")}</h2>
          <p className="text-gray-600 mb-4">{t("settings_section.notifications.configure")}</p>
          
          {/* Notifications content would go here */}
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
