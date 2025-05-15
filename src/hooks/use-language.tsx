
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type SupportedLanguages = "fr" | "en" | "es" | "de" | "it";

type LanguageContextType = {
  language: SupportedLanguages;
  setLanguage: (language: SupportedLanguages) => void;
  t: (key: string) => string;
};

const defaultLanguage = "fr";

const LanguageContext = createContext<LanguageContextType>({
  language: defaultLanguage,
  setLanguage: () => {},
  t: (key) => key,
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<SupportedLanguages>(() => {
    // Try to get from localStorage first
    const savedLanguage = localStorage.getItem("language");
    return (savedLanguage as SupportedLanguages) || defaultLanguage;
  });
  
  const [translations, setTranslations] = useState<Record<string, string>>({});

  useEffect(() => {
    // Save to localStorage whenever language changes
    localStorage.setItem("language", language);
    
    // Load translations
    import(`../locales/${language}.json`)
      .then((module) => {
        setTranslations(module.default);
      })
      .catch((error) => {
        console.error(`Failed to load translations for ${language}:`, error);
        setTranslations({});
      });
  }, [language]);

  const t = (key: string): string => {
    return translations[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
