import fs from 'fs/promises';
import path from 'path';

/**
 * Obtiene el contenido de una página según el idioma.
 * Ahora lee directamente de archivos JSON pre-generados en la carpeta /content.
 */
export async function getPageContent(locale: string) {
  try {
    const filePath = path.join(process.cwd(), 'content', `${locale}.json`);
    const fileContent = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.warn(`⚠️ No se encontró el archivo para el idioma: ${locale}, usando español por defecto.`);
    // Fallback al español si el archivo no existe
    const esPath = path.join(process.cwd(), 'content', 'es.json');
    const esContent = await fs.readFile(esPath, 'utf8');
    return JSON.parse(esContent);
  }
}
