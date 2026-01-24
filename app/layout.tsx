import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Villa Alta Guest House",
  description: "Luxury Boutique Guest House in Cartagena, Colombia",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
