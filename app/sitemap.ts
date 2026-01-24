import { MetadataRoute } from 'next';
import { locales } from '@/lib/locales';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://hotelvillaalta.com';
  
  return locales.map((locale) => ({
    url: `${baseUrl}/${locale}`,
    lastModified: new URLSearchParams().get('date') || new Date(),
    changeFrequency: 'monthly',
    priority: locale === 'es' ? 1 : 0.8,
  }));
}
