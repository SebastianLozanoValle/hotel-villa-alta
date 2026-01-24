import type { Metadata } from "next";
import { getPageContent } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Villa Alta Guest House | Cartagena",
  description: "Luxury Boutique Guest House in Cartagena, Colombia",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://hotelvillaalta.com'), 
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // El layout raíz DEBE tener html y body en Next.js
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  );
}
