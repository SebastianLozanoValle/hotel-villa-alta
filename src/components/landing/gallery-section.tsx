"use client";

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface GallerySectionProps {
  content: {
    title: string;
    subtitle: string;
    view_all: string;
  };
}

const GallerySection = ({ content }: GallerySectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const horizontalWidth = horizontalRef.current?.scrollWidth || 0;
      const windowWidth = window.innerWidth;
      
      gsap.to(horizontalRef.current, {
        x: -(horizontalWidth - windowWidth),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${horizontalWidth}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Definimos la galería por "bloques" para lograr el efecto Bento/Pinterest
  const galleryBlocks = [
    {
      type: 'single',
      images: [{ src: '/hero-back.png', className: 'w-[450px] h-[600px]' }]
    },
    {
      type: 'double-vertical',
      images: [
        { src: '/hero-back2.png', className: 'w-[350px] h-[280px]' },
        { src: '/hero-back3.png', className: 'w-[350px] h-[350px]' }
      ]
    },
    {
      type: 'wide-over-double',
      images: [
        { src: '/hero-back4.png', className: 'w-[600px] h-[350px] col-span-2' },
        { src: '/hero-back.png', className: 'w-[290px] h-[300px]' },
        { src: '/hero-back2.png', className: 'w-[290px] h-[300px]' }
      ]
    },
    {
      type: 'single',
      images: [{ src: '/hero-back3.png', className: 'w-[400px] h-[550px] mt-20' }]
    },
    {
      type: 'double-vertical',
      images: [
        { src: '/hero-back4.png', className: 'w-[300px] h-[350px]' },
        { src: '/hero-back.png', className: 'w-[300px] h-[250px]' }
      ]
    }
  ];

  return (
    <section 
      ref={sectionRef} 
      className="relative h-screen w-full bg-[#e5e1da] overflow-hidden"
    >
      <div 
        ref={horizontalRef}
        className="flex items-center h-full px-[10vw] gap-16"
      >
        {/* Header de la Galería */}
        <div className="flex-shrink-0 w-[35vw] mr-10">
          <span className="font-source text-[10px] tracking-[0.4em] uppercase opacity-40 block mb-6">
            (02) Galería
          </span>
          <h2 className="text-[6vw] font-prata leading-[0.9] text-secondary mb-8 uppercase">
            {content.title}
          </h2>
          <p className="font-source text-sm text-secondary/60 max-w-[320px] leading-relaxed italic">
            {content.subtitle}
          </p>
          <div className="mt-12">
            <button className="px-8 py-3 border border-secondary/20 rounded-full font-source text-[10px] tracking-widest uppercase text-secondary hover:bg-secondary hover:text-white transition-all">
              {content.view_all}
            </button>
          </div>
        </div>

        {/* Mapeo de Bloques Bento */}
        {galleryBlocks.map((block, bIdx) => (
          <div key={bIdx} className={`flex-shrink-0 flex flex-col gap-8 ${block.type === 'wide-over-double' ? 'grid grid-cols-2 max-w-[600px]' : ''}`}>
            {block.images.map((img, iIdx) => (
              <div 
                key={`${bIdx}-${iIdx}`} 
                className={`relative shadow-2xl overflow-hidden rounded-sm group transition-transform duration-700 hover:z-20 ${img.className}`}
              >
                <Image 
                  src={img.src} 
                  alt={`Gallery image ${bIdx}-${iIdx}`} 
                  fill 
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            ))}
          </div>
        ))}

        {/* Cierre Visual */}
        <div className="flex-shrink-0 w-[20vw] flex items-center justify-center">
           <div className="w-[1px] h-32 bg-secondary/20"></div>
        </div>
      </div>

      {/* Decoración: Líneas curvas de fondo */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M-10,20 Q40,80 110,20" fill="none" stroke="black" strokeWidth="0.03" />
        <path d="M-10,50 Q50,10 110,50" fill="none" stroke="black" strokeWidth="0.03" />
      </svg>
    </section>
  );
};

export default GallerySection;
