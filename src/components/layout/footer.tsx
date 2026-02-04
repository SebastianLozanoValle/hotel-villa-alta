"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { TranslatedText } from '../translation/TranslatedText';

interface FooterProps {
  content: {
    navbar: {
      inicio: string;
      reserva: string;
    };
    footer: {
      description: string;
      navigation: string;
      suites: string;
      reviews: string;
      contact: string;
      location_label: string;
      reservations_label: string;
      rights: string;
      terms: string;
      rnt: string;
    };
  };
}

const Footer = ({ content }: FooterProps) => {
  const params = useParams();
  const locale = params?.locale as string || 'es';

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.querySelector(targetId);
    if (element) {
      let offset = 200;
      if (targetId === '#hero') {
        offset = 0;
      } else if (targetId === '#rooms') {
        offset = 250;
      } else if (targetId === '#gallery') {
        offset = 200;
      } else if (targetId === '#reviews') {
        offset = 250;
      } else if (targetId === '#contact') {
        offset = 200;
      }
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
    }
  };

  return (
    <footer className="relative w-full bg-secondary overflow-hidden text-white">
      <div className="absolute inset-0 z-0">
        <Image 
          src="/hero-back4.png" 
          alt="Footer Background" 
          fill 
          className="object-cover opacity-20 grayscale brightness-50"
        />
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-20 flex flex-col md:flex-row justify-between gap-16 md:gap-8">
        <div className="flex flex-col gap-8 max-w-[400px]">
          <div className="flex flex-col">
            <h2 className="text-3xl font-prata tracking-wider leading-none">Villa Alta</h2>
            <span className="text-xs font-source tracking-[0.4em] uppercase opacity-60 mt-2">Guest House</span>
          </div>
          <p className="font-source text-sm opacity-60 leading-relaxed italic">
            <TranslatedText>{content.footer.description}</TranslatedText>
          </p>
          <div className="flex gap-8 pt-4">
            <a href="https://www.instagram.com/villaalta.ctg/" target="_blank" rel="noopener noreferrer" className="text-xs font-source tracking-[0.2em] uppercase hover:opacity-50 transition-opacity">Instagram</a>
          </div>
        </div>

        <div className="flex flex-col gap-8 min-w-[150px]">
          <span className="font-source text-[10px] tracking-[0.3em] uppercase opacity-40">
            <TranslatedText>{content.footer.navigation}</TranslatedText>
          </span>
          <nav className="flex flex-col gap-4">
            <a href={`/${locale}#hero`} onClick={(e) => handleScrollTo(e, '#hero')} className="text-xl font-prata hover:opacity-50 transition-opacity cursor-pointer">
              <TranslatedText>{content.navbar.inicio}</TranslatedText>
            </a>
            <a href={`/${locale}#rooms`} onClick={(e) => handleScrollTo(e, '#rooms')} className="text-xl font-prata hover:opacity-50 transition-opacity cursor-pointer">
              <TranslatedText>{content.footer.suites}</TranslatedText>
            </a>
            <a href={`/${locale}#reviews`} onClick={(e) => handleScrollTo(e, '#reviews')} className="text-xl font-prata hover:opacity-50 transition-opacity cursor-pointer">
              <TranslatedText>{content.footer.reviews}</TranslatedText>
            </a>
            <a href={`/${locale}#hero`} onClick={(e) => handleScrollTo(e, '#hero')} className="text-xl font-prata hover:opacity-50 transition-opacity cursor-pointer">
              <TranslatedText>{content.navbar.reserva}</TranslatedText>
            </a>
          </nav>
        </div>

        <div className="flex flex-col gap-8">
          <span className="font-source text-[10px] tracking-[0.3em] uppercase opacity-40">
            <TranslatedText>{content.footer.contact}</TranslatedText>
          </span>
          <div className="flex flex-col gap-6 font-source text-sm opacity-80">
            <div>
              <p className="tracking-widest uppercase text-[10px] opacity-40 mb-2">
                <TranslatedText>{content.footer.location_label}</TranslatedText>
              </p>
              <p>Centro Histórico, CL Callejon De Los Estribos<br/>Cartagena, Colombia 130001</p>
            </div>
            <div>
              <p className="tracking-widest uppercase text-[10px] opacity-40 mb-2">
                <TranslatedText>{content.footer.reservations_label}</TranslatedText>
              </p>
              <p>
                <a href="tel:+573215062187" className="hover:opacity-70 transition-opacity">+57 321 5062187</a><br/>
                <a href="mailto:hotelvillaaltac@gmail.com" className="hover:opacity-70 transition-opacity">hotelvillaaltac@gmail.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 border-t border-white/5 py-8 text-center px-6">
        <p className="font-source text-[9px] tracking-[0.3em] uppercase flex flex-wrap items-center justify-center gap-2">
          <span className="opacity-30">&copy; 2026 Villa Alta Guest House. <TranslatedText>{content.footer.rights}</TranslatedText></span>
          <span className="opacity-30">|</span>
          <Link href={`/${locale}/terms`} className="opacity-30 hover:opacity-70 transition-opacity">
            <TranslatedText>{content.footer.terms}</TranslatedText>
          </Link>
          <span className="opacity-30">|</span>
          <Link href={`/${locale}/rnt`} className="opacity-30 hover:opacity-70 transition-opacity">
            <TranslatedText>{content.footer.rnt}</TranslatedText>
          </Link>
          <span className="opacity-30">|</span>
          <span className="opacity-30">Developed by</span>
          <a href="https://sledevelopment.com" target="_blank" className="text-white font-bold hover:opacity-70 transition-opacity tracking-[0.4em]">SLE Development</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
