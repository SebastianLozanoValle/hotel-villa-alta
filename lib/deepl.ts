import { getFromCache, setCache } from './translation-cache';

const DEEPL_API_URL = 'https://api-free.deepl.com/v2/translate';

export const SUPPORTED_LANGUAGES = {
  es: 'ES',
  en: 'EN',
  fr: 'FR',
  de: 'DE',
  it: 'IT',
  pt: 'PT',
} as const;

export type LanguageCode = keyof typeof SUPPORTED_LANGUAGES;

interface DeepLResponse {
  translations: Array<{
    detected_source_language: string;
    text: string;
  }>;
}

/**
 * Traduce un objeto completo de forma recursiva
 */
export async function translateObject<T>(obj: T, targetLang: LanguageCode): Promise<T> {
  if (targetLang === 'es') return obj;

  const textsToTranslate: string[] = [];

  function collectTexts(item: unknown) {
    if (typeof item === 'string' && item.length > 0 && !item.startsWith('/') && !item.startsWith('$')) {
      textsToTranslate.push(item);
    } else if (Array.isArray(item)) {
      item.forEach(collectTexts);
    } else if (typeof item === 'object' && item !== null) {
      Object.values(item).forEach(collectTexts);
    }
  }

  collectTexts(obj);

  if (textsToTranslate.length === 0) return obj;

  const translatedMap: Record<string, string> = {};
  const missingTexts: string[] = [];

  for (const text of textsToTranslate) {
    const cached = getFromCache(text, targetLang);
    
    if (cached) {
      translatedMap[text] = cached;
    } else if (!missingTexts.includes(text)) {
      missingTexts.push(text);
    }
  }

  if (missingTexts.length > 0) {
    const apiKey = process.env.DEEPL_API_KEY;
    if (apiKey) {
      try {
        const response = await fetch(DEEPL_API_URL, {
          method: 'POST',
          headers: {
            'Authorization': `DeepL-Auth-Key ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: missingTexts,
            target_lang: SUPPORTED_LANGUAGES[targetLang],
            source_lang: 'ES',
          }),
        });

        if (response.ok) {
          const data: DeepLResponse = await response.json();
          data.translations.forEach((t, i) => {
            const original = missingTexts[i];
            const translated = t.text;
            translatedMap[original] = translated;
            setCache(original, targetLang, translated);
          });
        }
      } catch (error) {
        console.error('Error en traducción por lote:', error);
      }
    }
  }

  function applyTranslations(item: unknown): unknown {
    if (typeof item === 'string') {
      return translatedMap[item] || item;
    } else if (Array.isArray(item)) {
      return item.map(applyTranslations);
    } else if (typeof item === 'object' && item !== null) {
      const res: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(item)) {
        res[key] = applyTranslations(value);
      }
      return res;
    }
    return item;
  }

  return applyTranslations(obj) as T;
}

export async function translateText(
  text: string,
  targetLang: LanguageCode,
  sourceLang: LanguageCode = 'es'
): Promise<string> {
  if (targetLang === sourceLang) return text;

  const cached = getFromCache(text, targetLang);
  if (cached) return cached;

  const apiKey = process.env.DEEPL_API_KEY;
  if (!apiKey) return text;

  try {
    const response = await fetch(DEEPL_API_URL, {
      method: 'POST',
      headers: { 'Authorization': `DeepL-Auth-Key ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: [text],
        target_lang: SUPPORTED_LANGUAGES[targetLang],
        source_lang: SUPPORTED_LANGUAGES[sourceLang],
      }),
    });

    if (!response.ok) return text;
    const data: DeepLResponse = await response.json();
    const translated = data.translations[0]?.text || text;

    setCache(text, targetLang, translated);

    return translated;
  } catch (error) {
    console.error(error);
    return text;
  }
}
