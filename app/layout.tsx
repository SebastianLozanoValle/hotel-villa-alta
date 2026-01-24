import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

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
  description: "Hotel Boutique de Lujo en el corazón de Cartagena, Colombia. Experiencia exclusiva y confort inigualable.",
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
  return (
    <html lang="es">
      <body className={`${helveticaBdEx.variable} ${sfPro.variable} relative`}>
        {children}
      </body>
    </html>
  );
}
