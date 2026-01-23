"use client";

import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
import BookingEngine from './booking-engine'
import gsap from 'gsap'

interface HeroProps {
  content: {
    title: string;
  };
  bookingContent: {
    arrival: string;
    rooms: string;
    guests: string;
    rooms_options: string[];
    guests_options: string[];
    cta: string;
  };
}

const Hero = ({ content, bookingContent }: HeroProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const bookingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      
      tl.from(titleRef.current, {
        y: 100,
        opacity: 0,
        duration: 1.5,
        delay: 0.5
      })
      .from(bookingRef.current, {
        y: 50,
        opacity: 0,
        duration: 1.2
      }, "-=1");
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className='fixed top-0 left-0 w-full h-full'>
        <div className='h-screen w-full relative flex justify-center items-center px-4'>
            <Image 
            className='absolute top-0 left-0 w-full h-full object-cover'
            src="/hero-back3.png"
            alt="Hero"
            fill
            priority
            />
            <div className='absolute top-0 left-0 w-full h-full bg-linear-to-b from-black/0 to-black/50'></div>
            <div className='absolute top-0 left-0 w-full h-full bg-black/40'></div>
            
            <div className='relative z-10 flex flex-col items-center justify-center w-full max-w-6xl'>
                <h2 ref={titleRef} className='text-5xl md:text-8xl font-prata text-center tracking-widest text-white drop-shadow-2xl mb-8 md:mb-0 uppercase'>
                  {content.title}
                </h2>
                <div ref={bookingRef} className='w-full flex justify-center'>
                  <BookingEngine content={bookingContent} />
                </div>
            </div>
        </div>
    </div>
  )
}

export default Hero
