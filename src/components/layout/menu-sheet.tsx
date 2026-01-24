"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import { TranslatedText } from "../translation/TranslatedText";

interface MenuSheetProps {
  isOpen: boolean;
  onClose: () => void;
  content: {
    menu: string;
    inicio: string;
    reserva: string;
    close: string;
  };
}

const MenuSheet = ({ isOpen, onClose, content }: MenuSheetProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      const tl = gsap.timeline();
      tl.to(overlayRef.current, {
        display: "block",
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
      })
      .to(contentRef.current, {
        x: 0,
        duration: 0.6,
        ease: "expo.out",
      }, "-=0.2")
      .fromTo(
        linksRef.current?.querySelectorAll("a") || [],
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
        },
        "-=0.4"
      );
    } else {
      const tl = gsap.timeline();
      tl.to(linksRef.current?.querySelectorAll("a") || [], {
        y: -20,
        opacity: 0,
        duration: 0.3,
        stagger: 0.05,
        ease: "power2.in",
      })
      .to(contentRef.current, {
        x: "-100%",
        duration: 0.5,
        ease: "expo.in",
      }, "-=0.1")
      .to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          if (overlayRef.current) overlayRef.current.style.display = "none";
        },
      }, "-=0.3");
    }
  }, [isOpen]);

  const menuItems = [
    { name: content.inicio, href: "/" },
    { name: "Suites", href: "/" },
    { name: "Gastronomía", href: "/" },
    { name: "Experiencias", href: "/" },
    { name: "Galería", href: "/" },
    { name: "Contacto", href: "/" },
  ];

  return (
    <>
      <div
        ref={overlayRef}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 z-[60] hidden opacity-0 backdrop-blur-sm"
      />

      <div
        ref={contentRef}
        className="fixed top-0 left-0 h-screen w-full md:w-[450px] bg-secondary z-[70] translate-x-[-100%] flex flex-col p-8 md:p-12 text-white"
      >
        <div className="flex justify-between items-center mb-12 md:mb-16">
          <span className="font-source tracking-[0.3em] text-[10px] md:text-xs uppercase opacity-50">
            <TranslatedText>{content.menu}</TranslatedText>
          </span>
          <button 
            onClick={onClose}
            className="group flex items-center gap-4 hover:opacity-70 transition-opacity"
          >
            <span className="text-[10px] tracking-[0.2em] uppercase font-source">
              <TranslatedText>{content.close}</TranslatedText>
            </span>
            <div className="relative w-6 h-6">
              <span className="absolute top-1/2 left-0 w-full h-[1px] bg-white rotate-45"></span>
              <span className="absolute top-1/2 left-0 w-full h-[1px] bg-white -rotate-45"></span>
            </div>
          </button>
        </div>

        <nav ref={linksRef} className="flex flex-col gap-6 md:gap-8">
          {menuItems.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              onClick={onClose}
              className="text-3xl md:text-4xl font-prata hover:pl-4 transition-all duration-300 group flex items-center gap-4 uppercase"
            >
              <span className="text-[10px] md:text-xs font-source opacity-0 group-hover:opacity-30 transition-opacity italic">0{idx + 1}</span>
              <TranslatedText>{item.name}</TranslatedText>
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-12 border-t border-white/10 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] tracking-[0.2em] uppercase opacity-40 font-source">
              <TranslatedText>Ubicación</TranslatedText>
            </span>
            <p className="font-source text-sm opacity-80 italic">
              Calle Callejon los Estribos 2-116 p2 AT1<br/>Barrio Centro, Centro, 130001<br/>Cartagena de Indias, Colombia
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default MenuSheet;
