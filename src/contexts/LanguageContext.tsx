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
  const [isReady, setIsReady] = useState(!!initialDictionary || initialLocale === 'es');

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
    if (initialLocale && initialDictionary) return;

    const pathLocale = window.location.pathname.split('/')[1];
    let currentLocale = initialLocale || defaultLocale;
    
    if (!initialLocale) {
      if (pathLocale && pathLocale !== 'api' && pathLocale !== '_next' && locales.includes(pathLocale as Locale)) {
        currentLocale = pathLocale as Locale;
      } else {
        const savedLang = localStorage.getItem('language') as Locale;
        if (savedLang && locales.includes(savedLang)) {
          currentLocale = savedLang;
        }
      }
      setLanguageState(currentLocale);
    }

    localStorage.setItem('language', currentLocale);

    // Cargar diccionario estático si no se pasó inicialmente
    if (currentLocale !== 'es' && (!initialDictionary || Object.keys(initialDictionary).length === 0)) {
      import(`@/content/${currentLocale}.json`)
        .then(dict => {
          setRawDictionary(dict.default);
          setIsReady(true);
        })
        .catch(err => {
          console.error(`Error cargando diccionario ${currentLocale}:`, err);
          setIsReady(true);
        });
    } else {
      setIsReady(true);
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
