'use client';

import { useEffect, useState, useRef } from 'react';
import { useLanguage } from '@/src/contexts/LanguageContext';
import { getFromClientCache, setClientCache } from '@/src/lib/client-cache';

interface TranslatedTextProps {
  children: string;
  className?: string;
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div';
}

export function TranslatedText({ children, className, as: Component = 'span' }: TranslatedTextProps) {
  const { language, translate } = useLanguage();
  const [translatedText, setTranslatedText] = useState(children);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (language === 'es') {
      setTranslatedText(children);
      return;
    }

    // Intentar obtener del cache del cliente primero
    const cached = getFromClientCache(children, 'es', language);
    if (cached && typeof cached === 'string') {
      setTranslatedText(cached);
      return;
    }

    // Si no está en cache, traducir
    translate(children).then((translated) => {
      setTranslatedText(translated);
      // Guardar en cache del cliente
      setClientCache(children, 'es', language, translated);
    });
  }, [children, language, translate]);

  return <Component className={className}>{translatedText}</Component>;
}
