import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Villa Alta Guest House",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Este es el layout raíz obligatorio de Next.js
  // Solo pasamos el contenido, el HTML real está en app/[locale]/layout.tsx
  return children;
}
