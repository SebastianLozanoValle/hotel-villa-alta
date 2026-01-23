export const locales = ['es', 'en', 'fr', 'de', 'it', 'pt'] as const;
export type Locale = typeof locales[number];

export const defaultLocale: Locale = 'es';

export const localeNames: Record<Locale, string> = {
  es: 'Español',
  en: 'English',
  fr: 'Français',
  de: 'Deutsch',
  it: 'Italiano',
  pt: 'Português',
};

export const localeCodes: Record<Locale, string> = {
  es: 'es-CO',
  en: 'en-US',
  fr: 'fr-FR',
  de: 'de-DE',
  it: 'it-IT',
  pt: 'pt-BR',
};
