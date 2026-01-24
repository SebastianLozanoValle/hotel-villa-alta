import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/src/components/layout/navbar";
import { LanguageProvider } from "@/contexts/LanguageContext";
import LuxuryLoader from "@/src/components/common/luxury-loader";
import { getPageContent } from "@/lib/i18n";

const helveticaBdEx = localFont({
  src: "../public/fonts/HelveticaNeueLTStd-BdEx.otf",
  variable: "--font-helvetica-bdex",
});

const sfPro = localFont({
  src: [
    {
      path: "../public/fonts/SF-Pro.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/SF-Pro-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/SF-Pro-Display-Medium.otf",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-sf-pro",
});

export const metadata: Metadata = {
  title: "Villa Alta Guest House | Cartagena",
  description: "Luxury Boutique Guest House in Cartagena, Colombia",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://hotelvillaalta.com'), 
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale?: string }>;
}) {
  const { locale } = await params;
  const currentLocale = locale || 'es';
  const content = await getPageContent(currentLocale);
  
  return (
    <html lang={currentLocale}>
      <body
        className={`${helveticaBdEx.variable} ${sfPro.variable} relative`}
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
