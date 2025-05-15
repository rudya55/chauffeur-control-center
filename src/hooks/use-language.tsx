
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
  
  const [translations, setTranslations] = useState<Record<string, any>>({});

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

  // Helper function to get nested translations using dot notation
  // Always returns a string to avoid React rendering issues
  const t = (key: string): string => {
    const keys = key.split('.');
    let current: any = translations;
    
    for (const k of keys) {
      if (current === undefined || current === null) {
        console.warn(`Translation key part "${k}" not found in "${key}"`);
        return key;
      }
      
      current = current[k];
    }
    
    // Ensure we always return a string
    if (current === undefined || current === null) {
      console.warn(`Translation for key "${key}" not found`);
      return key;
    }
    
    if (typeof current === 'object') {
      console.warn(`Translation key "${key}" resolved to an object, not a string. Check your translation usage.`);
      return key;
    }
    
    return String(current);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
