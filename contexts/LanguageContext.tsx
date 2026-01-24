'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { type Locale, defaultLocale, locales } from '@/lib/locales';

interface LanguageContextType {
  language: Locale;
  setLanguage: (lang: Locale) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Locale>(defaultLocale);

  // Cargar idioma de la URL
  useEffect(() => {
    const pathLocale = window.location.pathname.split('/')[1];
    
    if (pathLocale && locales.includes(pathLocale as Locale)) {
      setLanguageState(pathLocale as Locale);
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

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage,
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
