// Configuración de idiomas para SEO
export const locales = ['es', 'en', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'zh', 'pl', 'nl'] as const;
export type Locale = typeof locales[number];

export const defaultLocale: Locale = 'es';

// Nombres de idiomas para SEO
export const localeNames: Record<Locale, string> = {
  es: 'Español',
  en: 'English',
  fr: 'Français',
  de: 'Deutsch',
  it: 'Italiano',
  pt: 'Português',
  ru: 'Русский',
  ja: '日本語',
  zh: '中文',
  pl: 'Polski',
  nl: 'Nederlands',
};

// Códigos de idioma para hreflang
export const localeCodes: Record<Locale, string> = {
  es: 'es-CO', // Español de Colombia
  en: 'en-US',
  fr: 'fr-FR',
  de: 'de-DE',
  it: 'it-IT',
  pt: 'pt-BR',
  ru: 'ru-RU',
  ja: 'ja-JP',
  zh: 'zh-CN',
  pl: 'pl-PL',
  nl: 'nl-NL',
};
