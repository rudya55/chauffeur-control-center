
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Languages } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

type SupportedLanguages = "fr" | "en" | "es" | "de" | "it";

const languageOptions = [
  { value: "fr", label: "Français" },
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
  { value: "de", label: "Deutsch" },
  { value: "it", label: "Italiano" },
];

export const LanguageCard = () => {
  const { language, setLanguage, t } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguages>(language);

  const handleSaveLanguage = () => {
    setLanguage(selectedLanguage);
    toast({
      title: t("language.save"),
      description: `${t("language." + selectedLanguage)}`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Languages className="text-primary" size={20} />
          <div>
            <CardTitle>{t("language.title")}</CardTitle>
            <CardDescription>{t("language.description")}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">{t("language.select")}</label>
          <Select value={selectedLanguage} onValueChange={(value) => setSelectedLanguage(value as SupportedLanguages)}>
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder={t("commons.select")} />
            </SelectTrigger>
            <SelectContent>
              {languageOptions.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSaveLanguage} 
          className="w-full"
          disabled={selectedLanguage === language}
        >
          {t("language.save")}
        </Button>
      </CardFooter>
    </Card>
  );
};
