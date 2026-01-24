import fs from 'fs/promises';
import path from 'path';
import { translateObject, type LanguageCode } from '../lib/deepl';
import { locales } from '../lib/locales';

async function generateTranslations() {
  const contentDir = path.join(process.cwd(), 'content');
  const esPath = path.join(contentDir, 'es.json');
  
  console.log('📖 Leyendo archivo base (es.json)...');
  const esContent = JSON.parse(await fs.readFile(esPath, 'utf8'));

  for (const locale of locales) {
    if (locale === 'es') continue;

    const targetPath = path.join(contentDir, `${locale}.json`);
    
    // Verificar si ya existe para no gastar créditos innecesariamente
    try {
      await fs.access(targetPath);
      console.log(`⏩ El idioma ${locale.toUpperCase()} ya existe, saltando...`);
      continue;
    } catch {
      console.log(`🌐 Traduciendo a ${locale.toUpperCase()}...`);
      const translated = await translateObject(esContent, locale as LanguageCode);
      await fs.writeFile(targetPath, JSON.stringify(translated, null, 2), 'utf8');
      console.log(`✅ Archivo ${locale}.json generado con éxito.`);
    }
  }
  
  console.log('✨ ¡Todas las traducciones han sido generadas!');
}

generateTranslations().catch(console.error);
