"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';

interface Room {
  id: string;
  titleTop: string;
  titleBottom: string;
  description: string;
  price: string;
  services: string[];
}

interface RoomsSectionProps {
  content: {
    meta_rooms: string;
    label: string;
    next: string;
    list: Room[];
  };
}

const RoomsSection = ({ content }: RoomsSectionProps) => {
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);

  const roomsData = content.list;
  const room = roomsData[currentRoomIndex];

  const handleNext = () => {
    const nextIndex = (currentRoomIndex + 1) % roomsData.length;
    
    const tl = gsap.timeline();

    tl.to([imageRef.current, contentRef.current, titleRef.current, metaRef.current], { 
      opacity: 0, 
      y: 15, 
      duration: 0.4, 
      ease: "power2.in",
      stagger: 0.05
    })
    .add(() => {
      setCurrentRoomIndex(nextIndex);
    })
    .set([imageRef.current, contentRef.current, titleRef.current, metaRef.current], { y: -15 })
    .to([imageRef.current, contentRef.current, titleRef.current, metaRef.current], { 
      opacity: 1, 
      y: 0, 
      duration: 0.7, 
      ease: "power3.out",
      stagger: 0.08
    });
  };

  // Imágenes fijas por ID (podrían estar en el JSON también)
  const roomImages: Record<string, string> = {
    "01": "/hero-back.png",
    "02": "/hero-back3.png",
    "03": "/hero-back4.png"
  };

  return (
    <section className="relative min-h-screen w-full bg-secondary text-white py-20 px-6 md:px-12 lg:px-20 overflow-hidden flex flex-col justify-center">
      {/* Metadatos superiores */}
      <div className="absolute top-8 md:top-12 left-6 md:left-12 flex flex-col md:flex-row gap-4 md:gap-20 font-source text-[8px] md:text-[10px] tracking-[0.2em] uppercase opacity-40 z-10">
        <span>Hotel Villa Alta, 2026</span>
        <span className="hidden sm:inline">({content.meta_rooms})</span>
      </div>
      
      <div ref={metaRef} className="absolute top-8 md:top-12 right-6 md:right-12 font-source text-[8px] md:text-[10px] tracking-[0.2em] uppercase opacity-40 z-10 flex gap-8">
        <span>({room.id})</span>
        <span>{content.label}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center mt-12 md:mt-0">
        <div ref={imageRef} className="lg:col-span-5 relative aspect-[4/5] w-full max-w-[500px] mx-auto lg:mx-0 shadow-2xl rounded-sm overflow-hidden group">
          <Image 
            src={roomImages[room.id] || "/hero-back.png"} 
            alt={room.titleTop} 
            fill 
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute bottom-6 left-0 w-full flex justify-between px-6 items-center text-[9px] font-source tracking-widest opacity-60 uppercase">
            <span className="cursor-pointer hover:opacity-100 transition-opacity">←</span>
            <span>{room.id}/0{roomsData.length}</span>
            <span className="cursor-pointer hover:opacity-100 transition-opacity">→</span>
          </div>
        </div>

        <div ref={contentRef} className="lg:col-span-7 flex flex-col relative pt-10 md:pt-0">
          <div ref={titleRef} className="relative mb-8 md:mb-16">
            <h2 className="text-[12vw] sm:text-[8vw] lg:text-[5vw] font-prata leading-[0.8] mix-blend-difference absolute -top-[6vw] -left-[4vw] md:-top-[4vw] md:-left-[8vw] z-20 pointer-events-none whitespace-nowrap opacity-80 uppercase">
              {room.titleTop}
            </h2>
            <div className="flex flex-col ml-[4vw] md:ml-[8vw]">
              <h2 className="text-[14vw] sm:text-[10vw] lg:text-[7vw] font-prata leading-[0.9] uppercase">
                {room.titleBottom}
              </h2>
              <h2 className="text-[14vw] sm:text-[10vw] lg:text-[7vw] font-prata leading-[0.9] opacity-90 uppercase">
                {content.meta_rooms}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
            <div className="flex flex-col gap-6 md:gap-8 order-2 md:order-1">
              <p className="font-source text-xs md:text-sm leading-relaxed opacity-70 max-w-[320px]">
                {room.description}
              </p>
              <div className="flex items-center">
                <div className="px-6 py-3 bg-white text-secondary border border-white rounded-full font-source text-[9px] md:text-[10px] tracking-widest uppercase hover:bg-transparent hover:text-white transition-all duration-500 cursor-default">
                  {room.price}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 md:gap-4 border-l border-white/10 pl-6 md:pl-8 order-1 md:order-2">
              {room.services.map((service, idx) => (
                <div key={idx} className="flex items-center gap-3 font-source text-[8px] md:text-[9px] tracking-[0.2em] uppercase opacity-50 hover:opacity-100 transition-opacity">
                  <span className="w-1 h-1 bg-white rounded-full"></span>
                  {service}
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={handleNext}
            className="absolute -top-10 right-0 md:top-0 md:-right-4 lg:right-0 group w-20 h-24 md:w-28 md:h-28 rounded-full border border-white/10 flex items-center justify-center bg-white text-secondary transition-all duration-700 z-30 overflow-hidden hover:text-white hover:bg-secondary"
          >
            <div className="relative z-10 flex flex-col items-center">
              <span className="font-source text-[8px] md:text-[10px] tracking-[0.3em] uppercase group-hover:scale-110 transition-transform">
                {content.next}
              </span>
              <span className="text-[10px] md:text-[12px] mt-1 group-hover:translate-x-2 transition-transform">→</span>
            </div>
            <div className="absolute inset-0 bg-secondary translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-expo"></div>
          </button>
        </div>
      </div>

      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.07]" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M-10,80 Q30,20 70,80 T110,80" fill="none" stroke="white" strokeWidth="0.03" />
        <path d="M-10,40 Q40,90 80,40 T110,40" fill="none" stroke="white" strokeWidth="0.03" />
      </svg>
    </section>
  );
};

export default RoomsSection;
