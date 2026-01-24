"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { TranslatedText } from "../translation/TranslatedText";

interface LuxurySelectProps {
  label: string;
  value: string;
  options: string[];
  onChange: (val: string) => void;
}

const LuxurySelect = ({ label, value, options, onChange }: LuxurySelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<SVGSVGElement>(null);

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

  return (
    <div className="flex flex-col gap-1 w-full md:min-w-[220px] relative group border-b border-white/30 pb-2 cursor-pointer" 
         onClick={() => setIsOpen(!isOpen)}>
      <label className="text-[10px] font-source tracking-[0.2em] uppercase opacity-50 text-white">
        <TranslatedText>{label}</TranslatedText>
      </label>
      <div className="flex justify-between items-center">
        <span className="text-lg font-source text-white tracking-wide">
          <TranslatedText>{value}</TranslatedText>
        </span>
        <svg 
          ref={iconRef}
          width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg"
          className="opacity-70 group-hover:opacity-100 transition-opacity"
        >
          <path d="M1 1L6 6L11 1" stroke="white" strokeWidth="1.5" />
        </svg>
      </div>

      <div 
        ref={dropdownRef}
        className="absolute bottom-full left-0 w-full bg-secondary shadow-2xl z-[100] mb-4 py-2 border border-white/10 hidden"
      >
        {options.map((opt) => (
          <div 
            key={opt}
            onClick={(e) => {
              e.stopPropagation();
              onChange(opt);
              setIsOpen(false);
            }}
            className="px-4 py-3 text-sm font-source text-white/80 hover:bg-white/10 hover:text-white transition-colors"
          >
            <TranslatedText>{opt}</TranslatedText>
          </div>
        ))}
      </div>
    </div>
  );
};

interface BookingEngineProps {
  content: {
    arrival: string;
    rooms: string;
    guests: string;
    rooms_options: string[];
    guests_options: string[];
    cta: string;
  };
}

const BookingEngine = ({ content }: BookingEngineProps) => {
  const [rooms, setRooms] = useState(content.rooms_options[0]);
  const [guests, setGuests] = useState(content.guests_options[0]);

  return (
    <div className='flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 mt-12 md:mt-16 w-full max-w-5xl px-4 mx-auto relative z-10'>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 w-full">
          <div className="flex flex-col gap-1 w-full border-b border-white/30 pb-2 cursor-pointer">
            <label className="text-[10px] font-source tracking-[0.2em] uppercase opacity-50 text-white">
              <TranslatedText>{content.arrival}</TranslatedText>
            </label>
            <div className="flex justify-between items-center">
              <span className="text-lg font-source text-white tracking-wide">23 - 28 Ene</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" className="opacity-70">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
          </div>
          
          <LuxurySelect 
            label={content.rooms} 
            value={rooms}
            options={content.rooms_options}
            onChange={setRooms}
          />

          <LuxurySelect 
            label={content.guests} 
            value={guests}
            options={content.guests_options}
            onChange={setGuests}
          />
        </div>
        
        <button className='w-full md:w-auto flex items-center justify-center gap-6 bg-secondary border border-secondary rounded-full px-10 py-4 hover:bg-white text-white hover:text-secondary transition-all duration-300 group shadow-xl'>
            <span className='font-source tracking-[0.2em] text-sm font-medium'>
              <TranslatedText>{content.cta}</TranslatedText>
            </span>
            <svg width="24" height="12" viewBox="0 0 24 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform group-hover:translate-x-1 transition-transform">
                <path d="M0 6H22M22 6L17 1M22 6L17 11" stroke="currentColor" strokeWidth="1.5" />
            </svg>
        </button>
    </div>
  )
}

export default BookingEngine;
