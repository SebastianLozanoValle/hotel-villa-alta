'use client';

import { useEffect } from 'react';
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
  useEffect(() => {
    // Manejar scroll cuando hay hash en la URL (viniendo de otra página)
    const handleHashScroll = () => {
      const hash = window.location.hash;
      if (hash) {
        setTimeout(() => {
          const element = document.querySelector(hash);
          if (element) {
            const rect = element.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const elementTop = rect.top + scrollTop;
            
            let offset = 200;
            if (hash === '#hero') {
              offset = 0;
            } else if (hash === '#rooms') {
              offset = 250;
            } else if (hash === '#gallery') {
              offset = 200;
            } else if (hash === '#reviews') {
              offset = 250;
            } else if (hash === '#contact') {
              offset = 200;
            }
            
            window.scrollTo({
              top: Math.max(0, elementTop - offset),
              behavior: 'smooth'
            });
          }
        }, 500);
      }
    };

    handleHashScroll();
    window.addEventListener('load', handleHashScroll);
    return () => window.removeEventListener('load', handleHashScroll);
  }, []);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    "name": "Villa Alta Guest House",
    "description": "Boutique Luxury Guest House in Cartagena de Indias, Colombia",
    "image": "https://hotelvillaalta.com/hero-back3.png",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "CL Callejon De Los Estribos",
      "addressLocality": "Cartagena",
      "addressRegion": "Centro Histórico",
      "postalCode": "130001",
      "addressCountry": "CO"
    },
    "priceRange": "$$$",
    "telephone": "+57 321 5062187",
    "email": "hotelvillaaltac@gmail.com"
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LuxuryLoader />
      <Navbar content={content.navbar} />
      <div id="hero">
      <Hero content={content.hero} bookingContent={content.booking} />
      </div>
      <div className="relative z-30 mt-[100vh]">
        <CarouselSection content={content.carousel} />
        <section id="rooms">
        <RoomsSection content={content.rooms} />
        </section>
        <section id="gallery">
        <GallerySection content={content.gallery} />
        </section>
        <section id="reviews">
        <ReviewsSection content={content.reviews} />
        </section>
        <footer id="contact">
        <Footer content={content} />
        </footer>
      </div>
    </main>
  );
}
