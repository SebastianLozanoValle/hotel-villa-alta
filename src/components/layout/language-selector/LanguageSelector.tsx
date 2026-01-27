'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/src/contexts/LanguageContext';
import { locales, localeNames, type Locale } from '@/src/lib/locales';
import gsap from 'gsap';

const languageNames: Record<Locale, string> = {
  es: 'Español',
  en: 'English',
  fr: 'Français',
  de: 'Deutsch',
  it: 'Italiano',
  pt: 'Português',
  ru: 'Русский',
  ja: '日本語',
  zh: '中文',
  pl: 'Polski',
  nl: 'Nederlands'
};

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(dropdownRef.current, 
        { opacity: 0, y: 10, display: 'none' },
        { opacity: 1, y: 0, display: 'block', duration: 0.3, ease: "power2.out" }
      );
      gsap.to(iconRef.current, { rotation: 180, duration: 0.3 });
    } else {
      gsap.to(dropdownRef.current, { 
        opacity: 0, y: 10, duration: 0.2, ease: "power2.in",
        onComplete: () => { if(dropdownRef.current) dropdownRef.current.style.display = 'none'; }
      });
      gsap.to(iconRef.current, { rotation: 0, duration: 0.3 });
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative group">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm font-source tracking-[0.2em] uppercase text-white/80 hover:text-white transition-colors cursor-pointer"
      >
        <span>{language.toUpperCase()}</span>
        <svg 
          ref={iconRef}
          width="10" 
          height="6" 
          viewBox="0 0 10 6" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="opacity-70 group-hover:opacity-100 transition-opacity"
        >
          <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <div 
        ref={dropdownRef}
        className="absolute top-full right-0 mt-2 w-[200px] bg-secondary shadow-2xl z-[100] py-2 border border-white/10 hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {locales.map((lang) => (
          <button
            key={lang}
            onClick={() => {
              setLanguage(lang);
              setIsOpen(false);
            }}
            className={`w-full px-4 py-3 text-left text-sm font-source text-white/80 hover:bg-white/10 hover:text-white transition-colors flex items-center justify-between ${
              language === lang ? 'bg-white/5 text-white' : ''
            }`}
          >
            <span className="uppercase tracking-wider">{lang.toUpperCase()}</span>
            {language === lang && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 6l3 3 5-6" />
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
