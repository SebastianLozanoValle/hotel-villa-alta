import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "../globals.css";
import { LanguageProvider } from "@/src/contexts/LanguageContext";
import { locales, type Locale } from "@/src/lib/locales";
import fs from 'fs';
import path from 'path';

const helveticaBdEx = localFont({
  src: "../../public/fonts/HelveticaNeueLTStd-BdEx.otf",
  variable: "--font-helvetica-bdex",
});

const sfPro = localFont({
  src: [
    {
      path: "../../public/fonts/SF-Pro.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/SF-Pro-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/SF-Pro-Display-Medium.otf",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-sf-pro",
});

export const metadata: Metadata = {
  title: "Villa Alta Guest House | Cartagena",
  description: "Hotel Boutique de Lujo en el corazón de Cartagena, Colombia. Experiencia exclusiva y confort inigualable.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;

  // Cargar diccionario en el servidor para evitar flickering y mejorar SEO
  let dictionary = {};
  if (locale !== 'es') {
    try {
      const dictPath = path.join(process.cwd(), 'content', `${locale}.json`);
      if (fs.existsSync(dictPath)) {
        dictionary = JSON.parse(fs.readFileSync(dictPath, 'utf8'));
      }
    } catch (error) {
      console.error(`Error loading dictionary for ${locale}:`, error);
    }
  }

  return (
    <html lang={locale}>
      <body className={`${helveticaBdEx.variable} ${sfPro.variable} relative antialiased`}>
        <LanguageProvider initialLocale={locale} initialDictionary={dictionary}>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
