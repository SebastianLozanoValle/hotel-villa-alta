"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { useLanguage } from "@/contexts/LanguageContext";

const LuxuryLoader = () => {
  const { isTranslating, activeTranslations } = useLanguage();
  const loaderRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isTranslating) {
      gsap.to(loaderRef.current, {
        display: "flex",
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
      });
      
      gsap.to(textRef.current, {
        opacity: 0.4,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    } else {
      timeout = setTimeout(() => {
        gsap.to(loaderRef.current, {
          opacity: 0,
          duration: 0.8,
          ease: "power2.inOut",
          onComplete: () => {
            if (loaderRef.current) loaderRef.current.style.display = "none";
          },
        });
      }, 500);
    }

    return () => clearTimeout(timeout);
  }, [isTranslating]);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[1000] bg-secondary backdrop-blur-xl hidden items-center justify-center flex-col gap-8 text-white opacity-0"
    >
      <div className="relative w-24 h-24 flex items-center justify-center">
        <div className="absolute inset-0 border border-white/10 rounded-full"></div>
        <div className="absolute inset-0 border-t border-white rounded-full animate-spin [animation-duration:2s]"></div>
        
        <span className="font-prata text-2xl tracking-widest text-white">V A</span>
      </div>
      
      <div ref={textRef} className="flex flex-col items-center gap-2">
        <span className="font-source tracking-[0.4em] text-[10px] uppercase opacity-60 text-white">
          Traduciendo experiencia {activeTranslations > 0 ? `(${activeTranslations})` : ''}
        </span>
        <div className="h-[1px] w-12 bg-white/20"></div>
      </div>
    </div>
  );
};

export default LuxuryLoader;
