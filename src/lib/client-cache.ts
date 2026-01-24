/**
 * Cache del lado del cliente para traducciones
 * Usa localStorage para persistir entre sesiones
 */

const CACHE_PREFIX = 'translation_cache_';
const CACHE_TTL = 1000 * 60 * 60 * 24 * 7; // 7 días

interface CacheEntry {
  translated: string | string[];
  timestamp: number;
  sourceLang: string;
  targetLang: string;
}

/**
 * Genera una clave única para el cache
 */
function getCacheKey(text: string | string[], sourceLang: string, targetLang: string): string {
  const textKey = Array.isArray(text) ? text.join('|||') : text;
  // Usar btoa de forma segura para caracteres especiales (UTF-8)
  const safeTextKey = encodeURIComponent(textKey);
  const hash = btoa(`${sourceLang}:${targetLang}:${safeTextKey}`).replace(/[^a-zA-Z0-9]/g, '');
  return `${CACHE_PREFIX}${hash}`;
}

/**
 * Obtiene una traducción del cache del cliente
 */
export function getFromClientCache(
  text: string | string[],
  sourceLang: string,
  targetLang: string
): string | string[] | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const key = getCacheKey(text, sourceLang, targetLang);
    const cached = localStorage.getItem(key);

    if (!cached) {
      return null;
    }

    const entry: CacheEntry = JSON.parse(cached);

    // Verificar si el cache ha expirado
    const now = Date.now();
    if (now - entry.timestamp > CACHE_TTL) {
      localStorage.removeItem(key);
      return null;
    }

    // Verificar que los idiomas coincidan
    if (entry.sourceLang !== sourceLang || entry.targetLang !== targetLang) {
      localStorage.removeItem(key);
      return null;
    }

    return entry.translated;
  } catch (error) {
    console.error('Error al leer cache del cliente:', error);
    return null;
  }
}

/**
 * Guarda una traducción en el cache del cliente
 */
export function setClientCache(
  text: string | string[],
  sourceLang: string,
  targetLang: string,
  translated: string | string[]
): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const key = getCacheKey(text, sourceLang, targetLang);
    const entry: CacheEntry = {
      translated,
      timestamp: Date.now(),
      sourceLang,
      targetLang,
    };

    localStorage.setItem(key, JSON.stringify(entry));

    // Limpiar cache viejo si hay más de 1000 entradas
    const cacheKeys = Object.keys(localStorage).filter(k => k.startsWith(CACHE_PREFIX));
    if (cacheKeys.length > 1000) {
      // Eliminar las 100 más antiguas
      const entries = cacheKeys.map(k => {
        try {
          const entry = JSON.parse(localStorage.getItem(k) || '{}');
          return { key: k, timestamp: entry.timestamp || 0 };
        } catch {
          return { key: k, timestamp: 0 };
        }
      }).sort((a, b) => a.timestamp - b.timestamp);

      entries.slice(0, 100).forEach(({ key }) => {
        localStorage.removeItem(key);
      });
    }
  } catch (error) {
    console.error('Error al guardar en cache del cliente:', error);
  }
}
