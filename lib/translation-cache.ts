/**
 * Sistema de cache en memoria para traducciones
 * Reemplaza SQLite para compatibilidad con Vercel
 */

interface CacheEntry {
  translated: string;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 1000 * 60 * 60 * 24 * 7; // 7 días

function getCacheKey(text: string, targetLang: string): string {
  return `${targetLang}:${text}`;
}

export function getFromCache(text: string, targetLang: string): string | null {
  const key = getCacheKey(text, targetLang);
  const entry = cache.get(key);
  
  if (!entry) return null;
  
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  
  return entry.translated;
}

export function setCache(text: string, targetLang: string, translated: string): void {
  const key = getCacheKey(text, targetLang);
  cache.set(key, {
    translated,
    timestamp: Date.now(),
  });
}
