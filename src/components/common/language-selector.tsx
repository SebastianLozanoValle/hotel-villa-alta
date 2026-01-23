'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { locales, localeNames } from '@/lib/locales';
import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(dropdownRef.current,
        { opacity: 0, y: -10, display: 'none' },
        { opacity: 1, y: 0, display: 'block', duration: 0.3, ease: "power2.out" }
      );
    } else {
      gsap.to(dropdownRef.current, {
        opacity: 0, y: -10, duration: 0.2, ease: "power2.in",
        onComplete: () => { if (dropdownRef.current) dropdownRef.current.style.display = 'none'; }
      });
    }
  }, [isOpen]);

  return (
    <div className="relative group">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:opacity-70 transition-opacity py-4"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <span className="text-xs uppercase font-source tracking-widest">{language}</span>
      </button>

      <div 
        ref={dropdownRef}
        className="absolute top-full right-0 bg-secondary shadow-2xl z-[100] mt-2 py-2 border border-white/10 hidden min-w-[120px]"
      >
        {locales.map((lang) => (
          <button 
            key={lang}
            onClick={() => {
              setLanguage(lang);
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-xs font-source text-white/80 hover:bg-white/10 hover:text-white transition-colors uppercase tracking-widest"
          >
            {localeNames[lang]}
          </button>
        ))}
      </div>
    </div>
  );
}
