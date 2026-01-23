import { translateText, type LanguageCode } from './deepl';

/**
 * Traduce un texto en el servidor.
 * Si ya existe en la DB (SQLite), lo devuelve instantáneamente.
 * Si no, lo pide a DeepL y lo guarda para siempre.
 */
export async function getServerTranslation(text: string, locale: string): Promise<string> {
  if (locale === 'es') return text;
  
  return await translateText(text, locale as LanguageCode);
}
