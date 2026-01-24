"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const LuxuryLoader = () => {
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      gsap.to(loaderRef.current, {
        opacity: 0,
        duration: 1,
        ease: "power2.inOut",
        onComplete: () => {
          if (loaderRef.current) loaderRef.current.style.display = "none";
        },
      });
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[1000] bg-secondary backdrop-blur-xl flex items-center justify-center flex-col gap-8 text-white"
    >
      <div className="relative w-24 h-24 flex items-center justify-center">
        <div className="absolute inset-0 border border-white/10 rounded-full"></div>
        <div className="absolute inset-0 border-t border-white rounded-full animate-spin [animation-duration:2s]"></div>
        
        <span className="font-prata text-2xl tracking-widest text-white">V A</span>
      </div>
      
      <div className="flex flex-col items-center gap-2">
        <span className="font-source tracking-[0.4em] text-[10px] uppercase opacity-60 text-white">
          Villa Alta Guest House
        </span>
        <div className="h-[1px] w-12 bg-white/20"></div>
      </div>
    </div>
  );
};

export default LuxuryLoader;
