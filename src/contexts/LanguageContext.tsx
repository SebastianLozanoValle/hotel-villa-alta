'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { type Locale, defaultLocale, locales } from '@/src/lib/locales';

interface LanguageContextType {
  language: Locale;
  setLanguage: (lang: Locale) => void;
  translate: (text: string) => Promise<string>;
  isTranslating: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Locale>(defaultLocale);
  const [isTranslating, setIsTranslating] = useState(false);

  // Cargar idioma de la URL
  useEffect(() => {
    const pathLocale = window.location.pathname.split('/')[1];
    
    if (pathLocale && pathLocale !== 'api' && pathLocale !== '_next' && locales.includes(pathLocale as Locale)) {
      setLanguageState(pathLocale as Locale);
      localStorage.setItem('language', pathLocale);
    } else {
      const savedLang = localStorage.getItem('language') as Locale;
      if (savedLang && locales.includes(savedLang)) {
        setLanguageState(savedLang);
      }
    }
  }, []);

  const setLanguage = (lang: Locale) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    const currentPath = window.location.pathname;
    const pathWithoutLocale = currentPath.replace(/^\/[^/]+/, '') || '/';
    window.location.href = `/${lang}${pathWithoutLocale}`;
  };

  const translate = async (text: string): Promise<string> => {
    if (language === defaultLocale || !text) {
      return text;
    }

    setIsTranslating(true);
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          targetLang: language,
          sourceLang: 'es',
        }),
      });

      const data = await response.json();
      return data.translated || text;
    } catch (error) {
      console.error('Error al traducir:', error);
      return text;
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translate, isTranslating }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage debe usarse dentro de LanguageProvider');
  }
  return context;
}
