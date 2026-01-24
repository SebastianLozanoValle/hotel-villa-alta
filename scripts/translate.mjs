import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar .env manualmente
const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, ...value] = line.split('=');
    if (key && value) {
      process.env[key.trim()] = value.join('=').trim();
    }
  });
}

const locales = ['en', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'zh', 'pl', 'nl'];
const sourceLocale = 'es';
const DEEPL_API_KEY = process.env.DEEPL_API_KEY;

if (!DEEPL_API_KEY) {
  console.error('Error: DEEPL_API_KEY no encontrada en el archivo .env');
  process.exit(1);
}

const contentDir = path.join(__dirname, '../content');
const sourceFile = path.join(contentDir, 'es.json');
const esContent = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));

async function translateText(text, targetLang, retryCount = 0) {
  if (!text || typeof text !== 'string' || text.trim() === '' || !isNaN(text)) return text;
  
  // Ignorar rutas, imágenes, etc.
  if (text.startsWith('/') || text.includes('.png') || text.includes('.jpg')) return text;
  
  // Ignorar IDs cortos
  if (text.length <= 2 && /^[0-9A-Z]+$/.test(text)) return text;

  const targetLangCode = targetLang.toUpperCase();
  const sourceLangCode = 'ES';

  try {
    const response = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: [text],
        target_lang: targetLangCode,
        source_lang: sourceLangCode,
      }),
    });

    if (response.status === 429) {
      const waitTime = (retryCount + 1) * 2000;
      console.warn(`Rate limit alcanzado. Esperando ${waitTime}ms...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return translateText(text, targetLang, retryCount + 1);
    }

    if (!response.ok) {
      throw new Error(`DeepL API error: ${response.status}`);
    }

    const data = await response.json();
    return data.translations[0].text;
  } catch (error) {
    console.error(`Error traduciendo "${text}" a ${targetLang}:`, error.message);
    return text;
  }
}

async function translateObject(obj, targetLang) {
  const result = Array.isArray(obj) ? [] : {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object' && value !== null) {
      result[key] = await translateObject(value, targetLang);
    } else if (typeof value === 'string') {
      // No traducir si es una ruta
      if (value.startsWith('/') || value.includes('.png')) {
        result[key] = value;
        continue;
      }
      
      console.log(`Traduciendo: ${value.substring(0, 30)}${value.length > 30 ? '...' : ''} -> ${targetLang}`);
      result[key] = await translateText(value, targetLang);
      // Delay base para evitar 429
      await new Promise(resolve => setTimeout(resolve, 500));
    } else {
      result[key] = value;
    }
  }
  
  return result;
}

async function main() {
  for (const locale of locales) {
    const targetFile = path.join(contentDir, `${locale}.json`);
    
    // Si el archivo existe pero tiene textos en español (porque falló antes), lo borramos para reintentar
    // Para simplificar, si vas a correr esto, borra los archivos primero.
    
    console.log(`\nGenerando traducciones para: ${locale.toUpperCase()}`);
    const translatedContent = await translateObject(esContent, locale);
    
    fs.writeFileSync(targetFile, JSON.stringify(translatedContent, null, 2), 'utf8');
    console.log(`¡Completado! Guardado en content/${locale}.json`);
  }
}

main().catch(console.error);
