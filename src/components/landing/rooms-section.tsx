"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { TranslatedText } from '../translation/TranslatedText';

interface Room {
  id: string;
  titleTop: string;
  titleBottom: string;
  description: string;
  images: string[];
  services: string[];
}

interface RoomsSectionProps {
  content: {
    meta_rooms: string;
    label: string;
    next: string;
    reserveNow: string;
    list: Room[];
  };
}

const RoomsSection = ({ content }: RoomsSectionProps) => {
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);

  const roomsData = content?.list || [];
  const room = roomsData[currentRoomIndex];

  const handleNext = () => {
    if (roomsData.length === 0) return;
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
      setCurrentImageIndex(0);
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

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = room?.images || [];

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (images.length === 0) return;
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (images.length === 0) return;
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!room) return null;

  return (
    <section className="relative min-h-screen w-full bg-secondary text-white pt-8 pb-20 px-6 md:px-12 lg:px-20 overflow-hidden flex flex-col justify-center">
      <div className="absolute top-8 md:top-12 left-6 md:left-12 flex flex-col md:flex-row gap-4 md:gap-20 font-source text-[8px] md:text-[10px] tracking-[0.2em] uppercase opacity-40 z-10">
        <span>Villa Alta Guest House, 2026</span>
        <span className="hidden sm:inline">(<TranslatedText>{content.meta_rooms}</TranslatedText>)</span>
      </div>
      
      <div ref={metaRef} className="absolute top-8 md:top-12 right-6 md:right-12 font-source text-[8px] md:text-[10px] tracking-[0.2em] uppercase opacity-40 z-10 flex gap-8">
        <span>({room.id})</span>
        <span><TranslatedText>{content.label}</TranslatedText></span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center mt-12 md:mt-0">
        <div ref={imageRef} className="lg:col-span-5 relative aspect-4/5 w-full max-w-[500px] mx-auto lg:mx-0 shadow-2xl rounded-sm overflow-hidden group">
          {images.length > 0 && (
            <Image 
              src={images[currentImageIndex] || images[0]} 
              alt={room.titleTop} 
              fill 
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          )}
          <div className="absolute bottom-6 left-0 w-full flex justify-between px-6 items-center text-[9px] font-source tracking-widest uppercase z-20">
            <button onClick={prevImage} className="cursor-pointer transition-all bg-black/60 hover:bg-black/80 backdrop-blur-sm border border-white/20 hover:border-white/40 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white text-lg md:text-xl font-bold shadow-lg hover:scale-110 active:scale-95">←</button>
            <span className="bg-black/60 backdrop-blur-sm border border-white/20 px-3 py-1 rounded-full text-white">{currentImageIndex + 1}/0{images.length}</span>
            <button onClick={nextImage} className="cursor-pointer transition-all bg-black/60 hover:bg-black/80 backdrop-blur-sm border border-white/20 hover:border-white/40 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white text-lg md:text-xl font-bold shadow-lg hover:scale-110 active:scale-95">→</button>
          </div>
        </div>

        <div ref={contentRef} className="lg:col-span-7 flex flex-col relative pt-10 md:pt-0">
          <div ref={titleRef} className="relative mb-8 md:mb-16">
                   <h2 
                     className="text-xl sm:text-2xl lg:text-3xl font-prata leading-[0.8] absolute -top-[4vw] -left-[2vw] md:-top-[3vw] md:-left-[4vw] z-20 pointer-events-none whitespace-nowrap opacity-90 uppercase text-rose-400"
                   >
                     <TranslatedText>{room.titleTop}</TranslatedText>
                   </h2>
                   <div className="flex flex-col ml-[4vw] md:ml-[8vw]">
                     <h2 
                       className="text-2xl sm:text-4xl lg:text-5xl font-prata leading-[0.9] uppercase text-background"
                     >
                       <TranslatedText>{room.titleBottom}</TranslatedText>
                     </h2>
                     <h2 
                       className="text-2xl sm:text-4xl lg:text-5xl font-prata leading-[0.9] opacity-80 uppercase text-background"
                     >
                       <TranslatedText>{content.meta_rooms}</TranslatedText>
                     </h2>
                   </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
            <div className="flex flex-col gap-6 md:gap-8 order-2 md:order-1">
              <p className="font-source text-xs md:text-sm leading-relaxed opacity-70 max-w-[320px]">
                <TranslatedText>{room.description}</TranslatedText>
              </p>
                     <div className="flex items-center">
                       <a 
                         href="https://example.com/reservations" 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="px-6 py-3 bg-accent-rose text-white border border-accent-rose rounded-full font-source text-[9px] md:text-[10px] tracking-widest uppercase hover:bg-transparent hover:text-white transition-all duration-500 cursor-pointer inline-block"
                       >
                         <TranslatedText>{content.reserveNow}</TranslatedText>
                       </a>
                     </div>
            </div>

            <div className={`border-l border-white/10 pl-6 md:pl-8 order-1 md:order-2 ${room.services.length > 8 ? 'grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4' : 'flex flex-col gap-3 md:gap-4'}`}>
              {room.services.length > 8 ? (
                <>
                  <div className="flex flex-col gap-3 md:gap-4">
                    {room.services.slice(0, Math.ceil(room.services.length / 2)).map((service, idx) => (
                      <div key={idx} className="flex items-center gap-3 font-source text-[8px] md:text-[9px] tracking-[0.2em] uppercase opacity-50 hover:opacity-100 transition-opacity">
                        <span className="w-1 h-1 bg-white rounded-full flex-shrink-0"></span>
                        <TranslatedText>{service}</TranslatedText>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col gap-3 md:gap-4">
                    {room.services.slice(Math.ceil(room.services.length / 2)).map((service, idx) => (
                      <div key={idx} className="flex items-center gap-3 font-source text-[8px] md:text-[9px] tracking-[0.2em] uppercase opacity-50 hover:opacity-100 transition-opacity">
                        <span className="w-1 h-1 bg-white rounded-full flex-shrink-0"></span>
                        <TranslatedText>{service}</TranslatedText>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                room.services.map((service, idx) => (
                  <div key={idx} className="flex items-center gap-3 font-source text-[8px] md:text-[9px] tracking-[0.2em] uppercase opacity-50 hover:opacity-100 transition-opacity">
                    <span className="w-1 h-1 bg-white rounded-full flex-shrink-0"></span>
                    <TranslatedText>{service}</TranslatedText>
                  </div>
                ))
              )}
            </div>
          </div>

          <button 
            onClick={handleNext}
            className="absolute -top-12 right-0 md:top-0 md:-right-4 lg:right-0 group w-20 h-20 md:w-24 md:h-24 aspect-square flex-shrink-0 rounded-full border border-white/10 flex items-center justify-center bg-accent-rose text-white transition-all duration-700 z-30 overflow-hidden hover:text-white hover:bg-secondary"
          >
            <div className="relative z-10 flex flex-col items-center">
              <span className="font-source text-[8px] md:text-[10px] tracking-[0.3em] uppercase group-hover:scale-110 transition-transform">
                <TranslatedText>{content.next}</TranslatedText>
              </span>
              <span className="text-[10px] md:text-[12px] mt-1 group-hover:translate-x-2 transition-transform">→</span>
            </div>
            <div className="absolute inset-0 bg-secondary translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-expo"></div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default RoomsSection;
