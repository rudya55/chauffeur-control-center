
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

type SupportedLanguages = "fr" | "en" | "es" | "de" | "it" | "ar" | "zh" | "ru" | "pt" | "ja";

const languageOptions = [
  { value: "fr", label: "Français" },
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
  { value: "de", label: "Deutsch" },
  { value: "it", label: "Italiano" },
  { value: "ar", label: "العربية" },
  { value: "zh", label: "中文" },
  { value: "ru", label: "Русский" },
  { value: "pt", label: "Português" },
  { value: "ja", label: "日本語" },
];

export const LanguageCard = () => {
  const { language, setLanguage, t } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguages>(language);

  const handleSaveLanguage = () => {
    setLanguage(selectedLanguage);
    toast.success(`Langue changée en ${languageOptions.find(lang => lang.value === selectedLanguage)?.label}`);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Globe className="text-primary" size={20} />
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
