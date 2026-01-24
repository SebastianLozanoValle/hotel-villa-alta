/**
 * Utilidad para traducir usando DeepL API
 */

const DEEPL_API_URL = 'https://api-free.deepl.com/v2/translate';

// Códigos de idioma soportados por DeepL
export const SUPPORTED_LANGUAGES = {
  es: 'ES',
  en: 'EN',
  fr: 'FR',
  de: 'DE',
  it: 'IT',
  pt: 'PT',
  ru: 'RU',
  ja: 'JA',
  zh: 'ZH',
  pl: 'PL',
  nl: 'NL',
  sv: 'SV',
  da: 'DA',
  fi: 'FI',
  el: 'EL',
  cs: 'CS',
  ro: 'RO',
  hu: 'HU',
  sk: 'SK',
  bg: 'BG',
  sl: 'SL',
  et: 'ET',
  lv: 'LV',
  lt: 'LT',
} as const;

export type LanguageCode = keyof typeof SUPPORTED_LANGUAGES;

interface DeepLResponse {
  translations: Array<{
    detected_source_language: string;
    text: string;
  }>;
}

/**
 * Traduce texto usando DeepL API
 */
export async function translateText(
  text: string,
  targetLang: LanguageCode,
  sourceLang: LanguageCode = 'es'
): Promise<string> {
  // Si el idioma objetivo es el mismo que el origen, no traducir
  if (targetLang === sourceLang) {
    return text;
  }

  // Verificar cache
  const { getFromCache, setCache } = await import('./translation-cache');
  const cached = getFromCache(text, sourceLang, targetLang);
  if (cached && typeof cached === 'string') {
    return cached;
  }

  const apiKey = process.env.DEEPL_API_KEY;

  if (!apiKey) {
    console.warn('DEEPL_API_KEY no configurada. Retornando texto original.');
    return text;
  }

  try {
    const targetLangCode = SUPPORTED_LANGUAGES[targetLang];
    const sourceLangCode = SUPPORTED_LANGUAGES[sourceLang];

    // Usar api-free.deepl.com por defecto (para keys gratuitas)
    // Si tienes key Pro, cambia a api.deepl.com
    const apiUrl = 'https://api-free.deepl.com/v2/translate';

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Next.js-DeepL-App/1.0.0',
      },
      body: JSON.stringify({
        text: [text],
        target_lang: targetLangCode,
        source_lang: sourceLangCode,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`DeepL API error: ${response.status} - ${errorText}`);
    }

    const data: DeepLResponse = await response.json();
    const translated = data.translations[0]?.text || text;
    
    // Guardar en cache
    setCache(text, sourceLang, targetLang, translated);
    
    return translated;
  } catch (error) {
    console.error('Error al traducir con DeepL:', error);
    return text; // Retornar texto original en caso de error
  }
}

/**
 * Traduce múltiples textos en una sola llamada
 */
export async function translateMultiple(
  texts: string[],
  targetLang: LanguageCode,
  sourceLang: LanguageCode = 'es'
): Promise<string[]> {
  // Si el idioma objetivo es el mismo que el origen, no traducir
  if (targetLang === sourceLang) {
    return texts;
  }

  // Verificar cache
  const { getFromCache, setCache } = await import('./translation-cache');
  const cached = getFromCache(texts, sourceLang, targetLang);
  if (cached && Array.isArray(cached)) {
    return cached;
  }

  const apiKey = process.env.DEEPL_API_KEY;

  if (!apiKey) {
    return texts;
  }

  try {
    const targetLangCode = SUPPORTED_LANGUAGES[targetLang];
    const sourceLangCode = SUPPORTED_LANGUAGES[sourceLang];

    // Usar api-free.deepl.com por defecto (para keys gratuitas)
    const apiUrl = 'https://api-free.deepl.com/v2/translate';

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Next.js-DeepL-App/1.0.0',
      },
      body: JSON.stringify({
        text: texts,
        target_lang: targetLangCode,
        source_lang: sourceLangCode,
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepL API error: ${response.status}`);
    }

    const data: DeepLResponse = await response.json();
    const translated = data.translations.map(t => t.text);
    
    // Guardar en cache
    setCache(texts, sourceLang, targetLang, translated);
    
    return translated;
  } catch (error) {
    console.error('Error al traducir múltiples textos:', error);
    return texts;
  }
}
