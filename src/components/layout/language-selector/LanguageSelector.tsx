'use client';

import { useLanguage } from '@/src/contexts/LanguageContext';
import { locales, localeNames, type Locale } from '@/src/lib/locales';

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="relative group">
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Locale)}
        className="appearance-none bg-transparent border-none text-white/80 hover:text-white cursor-pointer py-1 pl-2 pr-6 text-sm font-medium focus:outline-none transition-colors uppercase"
      >
        {locales.map((lang) => (
          <option key={lang} value={lang} className="bg-neutral-900 text-white">
            {lang.toUpperCase()}
          </option>
        ))}
      </select>
      <div className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg 
          width="10" 
          height="6" 
          viewBox="0 0 10 6" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="text-white/60"
        >
          <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
}
