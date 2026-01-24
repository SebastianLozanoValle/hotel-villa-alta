'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/src/contexts/LanguageContext';
import { getFromClientCache, setClientCache } from '@/src/lib/client-cache';

interface TranslatedTextProps {
  children: string;
  className?: string;
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div';
}

export function TranslatedText({ children, className, as: Component = 'span' }: TranslatedTextProps) {
  const { language, translate, dictionary } = useLanguage();
  
  // Inicializar con la traducción si ya está disponible en el diccionario
  const [translatedText, setTranslatedText] = useState(() => {
    if (language === 'es') return children;
    if (dictionary && dictionary[children]) return dictionary[children];
    return children;
  });

  useEffect(() => {
    if (language === 'es') {
      setTranslatedText(children);
      return;
    }

    // 1. Intentar obtener del diccionario estático
    if (dictionary && dictionary[children]) {
      setTranslatedText(dictionary[children]);
      return;
    }

    // 2. Intentar obtener del cache del cliente
    const cached = getFromClientCache(children, 'es', language);
    if (cached && typeof cached === 'string') {
      setTranslatedText(cached);
      return;
    }

    // 3. Si no está en ninguna parte, traducir vía API
    translate(children).then((translated) => {
      setTranslatedText(translated);
      setClientCache(children, 'es', language, translated);
    });
  }, [children, language, translate, dictionary]);

  return <Component className={className}>{translatedText}</Component>;
}
