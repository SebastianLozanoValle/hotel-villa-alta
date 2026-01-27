import { MetadataRoute } from 'next';
import { locales } from '@/src/lib/locales';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://hotelvillaalta.com';
  const currentDate = new Date();
  
  const routes = [
    '',
    '/terms',
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Generar entradas para cada locale y ruta
  locales.forEach((locale) => {
    routes.forEach((route) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: currentDate,
        changeFrequency: route === '/terms' ? 'yearly' : 'monthly',
        priority: route === '' ? 1 : 0.8,
      });
    });
  });

  return sitemapEntries;
}
