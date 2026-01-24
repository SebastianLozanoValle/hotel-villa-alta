import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Villa Alta Guest House | Cartagena",
  description: "Luxury Boutique Guest House in Cartagena, Colombia",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://hotelvillaalta.com'), 
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Layout raíz mínimo, la magia ocurre en [locale]/layout.tsx
  return children;
}
