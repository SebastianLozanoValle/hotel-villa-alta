'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { type Locale, defaultLocale, locales } from '@/src/lib/locales';
import esContent from '@/content/es.json';

interface LanguageContextType {
  language: Locale;
  setLanguage: (lang: Locale) => void;
  translate: (text: string) => Promise<string>;
  isTranslating: boolean;
  dictionary: Record<string, string>;
  isReady: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Función para aplanar objetos anidados
function flattenObject(obj: any, prefix = ''): Record<string, string> {
  let items: Record<string, string> = {};
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      Object.assign(items, flattenObject(obj[key], prefix + key + '.'));
    } else if (Array.isArray(obj[key])) {
      obj[key].forEach((item: any, index: number) => {
        if (typeof item === 'object' && item !== null) {
          Object.assign(items, flattenObject(item, prefix + key + '.' + index + '.'));
        } else {
          items[prefix + key + '.' + index] = String(item);
        }
      });
    } else {
      items[prefix + key] = String(obj[key]);
    }
  }
  return items;
}

export function LanguageProvider({ 
  children, 
  initialLocale, 
  initialDictionary 
}: { 
  children: React.ReactNode;
  initialLocale?: Locale;
  initialDictionary?: any;
}) {
  const [language, setLanguageState] = useState<Locale>(initialLocale || defaultLocale);
  const [isTranslating, setIsTranslating] = useState(false);
  const [rawDictionary, setRawDictionary] = useState<any>(initialDictionary || {});
  const [isReady, setIsReady] = useState(initialLocale === 'es' || (!!initialDictionary && Object.keys(initialDictionary).length > 0));

  // Construir mapa de traducción Español -> Idioma Objetivo
  const translationMap = useMemo(() => {
    if (language === 'es' || !rawDictionary || Object.keys(rawDictionary).length === 0) {
      return {};
    }

    const flatEs = flattenObject(esContent);
    const flatTarget = flattenObject(rawDictionary);
    const map: Record<string, string> = {};

    for (const key in flatEs) {
      if (flatTarget[key]) {
        map[flatEs[key]] = flatTarget[key];
      }
    }

    return map;
  }, [language, rawDictionary]);

  // Cargar idioma y diccionario (solo si no se pasaron inicialmente)
  useEffect(() => {
    // Si ya tenemos el diccionario (desde el servidor), marcar como listo
    if (initialDictionary && Object.keys(initialDictionary).length > 0) {
      setIsReady(true);
      return;
    }

    if (initialLocale === 'es') {
      setIsReady(true);
      return;
    }

    const pathLocale = window.location.pathname.split('/')[1];
    let currentLocale = initialLocale || (locales.includes(pathLocale as Locale) ? pathLocale as Locale : null);
    
    if (!currentLocale) {
      const savedLang = localStorage.getItem('language') as Locale;
      currentLocale = (savedLang && locales.includes(savedLang)) ? savedLang : defaultLocale;
    }

    setLanguageState(currentLocale as Locale);
    localStorage.setItem('language', currentLocale);

    if (currentLocale === 'es') {
      setIsReady(true);
    } else {
      import(`@/content/${currentLocale}.json`)
        .then(dict => {
          setRawDictionary(dict.default);
          setIsReady(true);
        })
        .catch(err => {
          console.error(`Error cargando diccionario ${currentLocale}:`, err);
          setIsReady(true);
        });
    }
  }, [initialLocale, initialDictionary]);

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
    <LanguageContext.Provider value={{ language, setLanguage, translate, isTranslating, dictionary: translationMap, isReady }}>
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
