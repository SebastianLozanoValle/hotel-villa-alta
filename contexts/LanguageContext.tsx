'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { type Locale, defaultLocale, locales } from '@/lib/locales';

interface LanguageContextType {
  language: Locale;
  setLanguage: (lang: Locale) => void;
  translate: (text: string) => Promise<string>;
  isTranslating: boolean;
  activeTranslations: number;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Cache simple en memoria para evitar peticiones duplicadas en la misma sesión
const translationCache: Record<string, string> = {};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Locale>(defaultLocale);
  const [activeTranslations, setActiveTranslations] = useState(0);

  // Cargar idioma de la URL
  useEffect(() => {
    const pathLocale = window.location.pathname.split('/')[1];
    
    if (pathLocale && locales.includes(pathLocale as Locale)) {
      setLanguageState(pathLocale as Locale);
      localStorage.setItem('language', pathLocale);
    }
  }, []);

  const setLanguage = (lang: Locale) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    // Redirigir a la ruta con el nuevo locale
    const currentPath = window.location.pathname;
    const pathWithoutLocale = currentPath.replace(/^\/[^/]+/, '') || '/';
    window.location.href = `/${lang}${pathWithoutLocale}`;
  };

  const translate = useCallback(async (text: string): Promise<string> => {
    if (language === defaultLocale || !text) return text;

    const cacheKey = `${language}:${text}`;
    if (translationCache[cacheKey]) return translationCache[cacheKey];

    setActiveTranslations(prev => prev + 1);
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
      const translated = data.translated || text;
      
      translationCache[cacheKey] = translated;
      return translated;
    } catch (error) {
      console.error('Error al traducir:', error);
      return text;
    } finally {
      setActiveTranslations(prev => Math.max(0, prev - 1));
    }
  }, [language]);

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      translate, 
      isTranslating: activeTranslations > 0,
      activeTranslations 
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage debe usarse dentro de LanguageProvider');
  return context;
}
