"use client";

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface CarouselSectionProps {
  content: {
    meta: string;
    heritage: string;
    discover: string;
  };
}

const CarouselSection = ({ content }: CarouselSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(imagesContainerRef.current, 
        { x: '120vw' },
        {
          x: '-45vw',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const images = [
    { src: '/hero-back.png', className: 'w-[250px] md:w-[300px] h-[350px] md:h-[400px] mt-10 md:mt-20' },
    { src: '/hero-back3.png', className: 'w-[400px] md:w-[550px] h-[550px] md:h-[700px] z-10' },
    { src: '/hero-back4.png', className: 'w-[280px] md:w-[350px] h-[380px] md:h-[450px] mt-20 md:mt-40' },
  ];

  return (
    <section 
      ref={sectionRef} 
      className="relative min-h-screen w-full bg-background overflow-hidden py-24 md:py-32 flex flex-col items-center justify-center"
    >
      <div className="absolute top-8 md:top-12 left-4 md:left-12 font-source text-[8px] md:text-[10px] tracking-[0.2em] uppercase opacity-40">
        {content.meta}
      </div>
      <div className="hidden md:block absolute top-12 left-1/2 -translate-x-1/2 font-source text-[10px] tracking-[0.2em] uppercase opacity-40">
        ({content.heritage})
      </div>
      <div className="absolute top-8 md:top-12 right-4 md:right-12 flex gap-6 md:gap-12 font-source text-[8px] md:text-[10px] tracking-[0.2em] uppercase opacity-40 text-right">
        <span>(01)</span>
        <span>Cartagena</span>
      </div>

      <div 
        ref={imagesContainerRef}
        className="relative flex items-center gap-16 md:gap-32 z-10"
      >
        {images.map((img, index) => (
          <div 
            key={index} 
            className={`relative flex-shrink-0 shadow-2xl overflow-hidden rounded-sm transition-transform duration-500 hover:scale-105 pointer-events-auto ${img.className}`}
          >
            <Image 
              src={img.src} 
              alt={`Gallery ${index}`} 
              fill 
              className="object-cover"
            />
          </div>
        ))}
      </div>

      <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none z-20 mix-blend-difference px-4">
        <h2 className="text-[18vw] md:text-[13vw] font-prata leading-[0.85] text-white flex flex-col items-center uppercase text-center">
          <span className='text-center'>Villa Alta</span>
          <span className="text-[0.25em] tracking-[0.5em] opacity-70 mt-[1vw] font-source">Guest House</span>
        </h2>
      </div>

      <div className="mt-12 md:mt-20 z-30">
        <button className="px-8 md:px-10 py-3 md:py-4 border border-black/20 rounded-full font-source text-[10px] md:text-xs tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-all">
          {content.discover}
        </button>
      </div>
    </section>
  );
};

export default CarouselSection;
