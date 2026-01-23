import type { Metadata } from "next";
import { Geist, Geist_Mono, Prata, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import Navbar from "@/src/components/layout/navbar";
import { LanguageProvider } from "@/contexts/LanguageContext";
import LuxuryLoader from "@/src/components/common/luxury-loader";
import { getPageContent } from "@/lib/i18n";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const prata = Prata({
  variable: "--font-prata",
  subsets: ["latin"],
  weight: "400",
});

const sourceSerif4 = Source_Serif_4({
  variable: "--font-source-serif-4",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hotel Villa Alta | Cartagena",
  description: "Luxury Boutique Hotel in Cartagena, Colombia",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://hotelvillaalta.com'),
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const content = await getPageContent(locale || 'es');
  
  return (
    <html lang={locale || 'es'}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${prata.variable} ${sourceSerif4.variable} relative`}
      >
        <LanguageProvider>
          <LuxuryLoader />
          <Navbar content={content.navbar} />
          <>
            {children}
          </>
        </LanguageProvider>
      </body>
    </html>
  );
}
