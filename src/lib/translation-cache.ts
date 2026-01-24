/**
 * Sistema de cache para traducciones
 * Evita traducir el mismo texto múltiples veces
 */

interface CacheEntry {
  translated: string | string[];
  timestamp: number;
}

// Cache en memoria del servidor (se resetea al reiniciar)
const serverCache = new Map<string, CacheEntry>();
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 horas

/**
 * Genera una clave única para el cache basada en texto, idioma origen y destino
 */
function getCacheKey(text: string | string[], sourceLang: string, targetLang: string): string {
  const textKey = Array.isArray(text) ? text.join('|||') : text;
  return `${sourceLang}:${targetLang}:${textKey}`;
}

/**
 * Obtiene una traducción del cache si existe y no ha expirado
 */
export function getFromCache(
  text: string | string[],
  sourceLang: string,
  targetLang: string
): string | string[] | null {
  const key = getCacheKey(text, sourceLang, targetLang);
  const entry = serverCache.get(key);

  if (!entry) {
    return null;
  }

  // Verificar si el cache ha expirado
  const now = Date.now();
  if (now - entry.timestamp > CACHE_TTL) {
    serverCache.delete(key);
    return null;
  }

  return entry.translated;
}

/**
 * Guarda una traducción en el cache
 */
export function setCache(
  text: string | string[],
  sourceLang: string,
  targetLang: string,
  translated: string | string[]
): void {
  const key = getCacheKey(text, sourceLang, targetLang);
  serverCache.set(key, {
    translated,
    timestamp: Date.now(),
  });
}

/**
 * Limpia el cache (útil para desarrollo)
 */
export function clearCache(): void {
  serverCache.clear();
}
