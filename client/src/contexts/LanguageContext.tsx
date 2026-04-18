import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '@shared/translations';

type Language = keyof typeof translations;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  // Load language from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('language') as Language | null;
    if (saved && saved in translations) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    if (lang in translations) {
      setLanguageState(lang);
      localStorage.setItem('language', lang);
    }
  };

  const t = (key: string): string => {
    const parts = key.split('.');
    let value: any = translations[language];
    
    for (const part of parts) {
      value = value?.[part];
    }
    
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
