import Hero from "@/src/components/landing/hero";
import CarouselSection from "@/src/components/landing/carousel-section";
import RoomsSection from "@/src/components/landing/rooms-section";
import GallerySection from "@/src/components/landing/gallery-section";
import ReviewsSection from "@/src/components/landing/reviews-section";
import Footer from "@/src/components/layout/footer";
import { getPageContent } from "@/lib/i18n";
import { locales } from "@/lib/locales";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const content = await getPageContent(locale);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://hotelvillaalta.com';

  return {
    title: `${content.hero.title} | Cartagena`,
    description: locale === 'es' 
      ? "Hotel Boutique de Lujo en el corazón de Cartagena, Colombia. Experiencia exclusiva y confort inigualable."
      : `Luxury Boutique Hotel in Cartagena. ${content.hero.title} offers an exclusive experience.`,
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: locales.reduce((acc, l) => ({
        ...acc,
        [l]: `${baseUrl}/${l}`,
      }), {}),
    },
    openGraph: {
      title: content.hero.title,
      description: "Luxury Boutique Hotel in Cartagena, Colombia",
      images: ['/hero-back3.png'],
    }
  };
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const content = await getPageContent(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    "name": "Hotel Villa Alta",
    "description": "Boutique Luxury Hotel in Cartagena de Indias, Colombia",
    "image": "https://hotelvillaalta.com/hero-back3.png",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Calle del Arsenal #10-23, Getsemaní",
      "addressLocality": "Cartagena",
      "addressRegion": "Bolívar",
      "addressCountry": "CO"
    },
    "priceRange": "$$$",
    "telephone": "+57 123 456 7890"
  };

  return (
    <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Hero content={content.hero} bookingContent={content.booking} />
        <div className="relative z-30 mt-[100vh]">
          <CarouselSection content={content.carousel} />
          <RoomsSection content={content.rooms} />
          <GallerySection content={content.gallery} />
          <ReviewsSection content={content.reviews} />
          <Footer content={content} />
        </div>
    </main>
  );
}
