"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

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
      gastronomy: string;
      contact: string;
      location_label: string;
      reservations_label: string;
      rights: string;
    };
  };
}

const Footer = ({ content }: FooterProps) => {
  return (
    <footer className="relative w-full bg-secondary overflow-hidden text-white">
      {/* Imagen de fondo con filtro muy oscuro */}
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
        
        {/* Columna 1: Branding y Descripción */}
        <div className="flex flex-col gap-8 max-w-[400px]">
          <h2 className="text-3xl font-prata tracking-wider">Hotel Villa Alta</h2>
          <p className="font-source text-sm opacity-60 leading-relaxed italic">
            {content.footer.description}
          </p>
          <div className="flex gap-8 pt-4">
            <a href="#" className="text-xs font-source tracking-[0.2em] uppercase hover:opacity-50 transition-opacity">Instagram</a>
            <a href="#" className="text-xs font-source tracking-[0.2em] uppercase hover:opacity-50 transition-opacity">Facebook</a>
          </div>
        </div>

        {/* Columna 2: Navegación Rápida */}
        <div className="flex flex-col gap-8 min-w-[150px]">
          <span className="font-source text-[10px] tracking-[0.3em] uppercase opacity-40">{content.footer.navigation}</span>
          <nav className="flex flex-col gap-4">
            <Link href="/" className="text-xl font-prata hover:opacity-50 transition-opacity">
              {content.navbar.inicio}
            </Link>
            <Link href="/rooms" className="text-xl font-prata hover:opacity-50 transition-opacity">
              {content.footer.suites}
            </Link>
            <Link href="/dining" className="text-xl font-prata hover:opacity-50 transition-opacity">
              {content.footer.gastronomy}
            </Link>
            <Link href="/about" className="text-xl font-prata hover:opacity-50 transition-opacity">
              {content.navbar.reserva}
            </Link>
          </nav>
        </div>

        {/* Columna 3: Contacto y Ubicación */}
        <div className="flex flex-col gap-8">
          <span className="font-source text-[10px] tracking-[0.3em] uppercase opacity-40">{content.footer.contact}</span>
          <div className="flex flex-col gap-6 font-source text-sm opacity-80">
            <div>
              <p className="tracking-widest uppercase text-[10px] opacity-40 mb-2">{content.footer.location_label}</p>
              <p>Calle del Arsenal #10-23, Getsemaní<br/>Cartagena de Indias, Colombia</p>
            </div>
            <div>
              <p className="tracking-widest uppercase text-[10px] opacity-40 mb-2">{content.footer.reservations_label}</p>
              <p>+57 123 456 7890<br/>reservas@hotelvillaalta.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="relative z-10 border-t border-white/5 py-8 text-center px-6">
        <p className="font-source text-[9px] tracking-[0.3em] uppercase flex items-center justify-center gap-2">
          <span className="opacity-30">&copy; 2026 Hotel Villa Alta. {content.footer.rights}</span>
          <span className="opacity-30">|</span>
          <span className="opacity-30">Developed by</span>
          <a href="https://sledevelopment.co" className="text-white font-bold hover:opacity-70 transition-opacity tracking-[0.4em]">SLE Development</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
