import fs from 'fs/promises';
import path from 'path';
import { translateObject, type LanguageCode } from './deepl';

export async function getPageContent(locale: string) {
  const filePath = path.join(process.cwd(), 'content', 'es.json');
  const fileContent = await fs.readFile(filePath, 'utf8');
  const baseContent = JSON.parse(fileContent);

  if (locale === 'es') {
    return baseContent;
  }

  // Traducir el objeto completo (usando cache de SQLite internamente)
  return await translateObject(baseContent, locale as LanguageCode);
}
