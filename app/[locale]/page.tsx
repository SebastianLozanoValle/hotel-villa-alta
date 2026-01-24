'use client';

import Hero from "@/src/components/landing/hero";
import CarouselSection from "@/src/components/landing/carousel-section";
import RoomsSection from "@/src/components/landing/rooms-section";
import GallerySection from "@/src/components/landing/gallery-section";
import ReviewsSection from "@/src/components/landing/reviews-section";
import Footer from "@/src/components/layout/footer";
import Navbar from "@/src/components/layout/navbar";
import LuxuryLoader from "@/src/components/common/luxury-loader";
import content from "@/content/es.json";

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    "name": "Villa Alta Guest House",
    "description": "Boutique Luxury Guest House in Cartagena de Indias, Colombia",
    "image": "https://hotelvillaalta.com/hero-back3.png",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Calle Callejon los Estribos 2-116 p2 AT1 Barrio Centro",
      "addressLocality": "Cartagena",
      "addressRegion": "Bolívar",
      "postalCode": "130001",
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
      <LuxuryLoader />
      <Navbar content={content.navbar} />
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
