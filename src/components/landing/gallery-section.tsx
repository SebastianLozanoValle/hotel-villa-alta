"use client";

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { TranslatedText } from '../translation/TranslatedText';

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
  const textContainerRef = useRef<HTMLDivElement>(null);
  const dragIndicatorRef = useRef<HTMLDivElement>(null);
  const [isDraggableActive, setIsDraggableActive] = useState(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const animationRef = useRef<gsap.core.Tween | null>(null);


  useEffect(() => {
    if (!isDraggableActive || !horizontalRef.current || !textContainerRef.current) return;

    const element = horizontalRef.current;
    const textElement = textContainerRef.current;
    
    const horizontalWidth = element.scrollWidth;
    const windowWidth = window.innerWidth;
    const textWidth = textElement.offsetWidth;
    const paddingLeft = windowWidth * 0.1; // px-[10vw] = 10% del ancho
    
    // Calcular cuánto mover para que la primera imagen quede alineada a la izquierda
    // Necesitamos mover: padding izquierdo + ancho del texto + gap
    const initialScrollAmount = paddingLeft + textWidth + 64; // 64 es el gap-16
    
    const maxDrag = -(horizontalWidth - windowWidth);

    // Animar el texto completamente fuera de la vista izquierda
    gsap.to(textElement, {
      x: -textWidth - 100,
      opacity: 0,
      duration: 1,
      ease: "power2.inOut"
    });

    // Animar las imágenes para que la primera quede alineada a la izquierda
    gsap.to(element, {
      x: -initialScrollAmount,
      duration: 1,
      ease: "power2.inOut",
      onComplete: () => {
        scrollLeftRef.current = -initialScrollAmount;
        currentX = -initialScrollAmount;
      }
    });

    let currentX = 0; // Empezar en 0, se actualizará cuando termine la animación
    let isDraggingLocal = false;

    const handleMouseDown = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Cancelar cualquier animación en curso
      if (animationRef.current) {
        animationRef.current.kill();
      }
      
      isDraggingLocal = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      startXRef.current = clientX;
      
      const currentXValue = gsap.getProperty(element, "x") as number || 0;
      scrollLeftRef.current = currentXValue;
      currentX = currentXValue;
      
      element.style.cursor = 'grabbing';
      element.style.userSelect = 'none';
      
      // Agregar listeners al documento para capturar movimiento fuera del elemento
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('touchmove', handleMouseMove, { passive: false });
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchend', handleMouseUp);
    };

    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!isDraggingLocal) return;
      
      e.preventDefault();
      e.stopPropagation();
      
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const walk = (clientX - startXRef.current) * 1.2;
      currentX = scrollLeftRef.current + walk;
      
      // Limitar el rango de movimiento
      currentX = Math.max(maxDrag, Math.min(0, currentX));
      
      gsap.set(element, { x: currentX, immediateRender: true });
      
      // Si el usuario vuelve hacia la derecha, mostrar el texto gradualmente
      // Cuando currentX = -initialScrollAmount: texto oculto
      // Cuando currentX se acerca a 0: texto aparece y vuelve a su posición
      if (currentX <= -initialScrollAmount) {
        // Ocultar el texto cuando está en la posición inicial o más a la izquierda
        gsap.set(textElement, {
          x: -textWidth - 100,
          opacity: 0
        });
      } else if (currentX < 0) {
        // Calcular progreso: 0 cuando currentX = -initialScrollAmount, 1 cuando currentX = 0
        const progress = (currentX + initialScrollAmount) / initialScrollAmount;
        const textOpacity = Math.max(0, Math.min(1, progress));
        // El texto vuelve gradualmente a su posición original (x = 0)
        const textX = -textWidth - 100 + (textWidth + 100) * progress;
        
        gsap.set(textElement, {
          x: textX,
          opacity: textOpacity
        });
      } else {
        // Cuando currentX >= 0, texto en posición original
        gsap.set(textElement, {
          x: 0,
          opacity: 1
        });
      }
    };

    const handleMouseUp = () => {
      if (!isDraggingLocal) return;
      
      isDraggingLocal = false;
      element.style.cursor = 'grab';
      element.style.userSelect = '';
      
      // Remover listeners del documento
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleMouseUp);
      
      // Cancelar cualquier animación en curso - sin inercia automática
      if (animationRef.current) {
        animationRef.current.kill();
      }
      
      // Mantener la posición actual sin animación adicional
      scrollLeftRef.current = currentX;
    };

    // Agregar listeners solo al elemento para iniciar el drag
    element.addEventListener('mousedown', handleMouseDown);
    element.addEventListener('touchstart', handleMouseDown, { passive: false });

    return () => {
      element.removeEventListener('mousedown', handleMouseDown);
      element.removeEventListener('touchstart', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleMouseUp);
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [isDraggableActive]);

  const handleEnableDrag = () => {
    setIsDraggableActive(true);
  };

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
      images: [{ src: '/hero-back3.png', className: 'w-[400px] h-[550px]' }]
    },
    {
      type: 'double-vertical',
      images: [
        { src: '/hero-back4.png', className: 'w-[320px] h-[250px]' },
        { src: '/hero-back.png', className: 'w-[320px] h-[380px]' }
      ]
    },
    {
      type: 'single',
      images: [{ src: '/hero-back2.png', className: 'w-[480px] h-[620px]' }]
    },
    {
      type: 'wide-over-double',
      images: [
        { src: '/hero-back3.png', className: 'w-[550px] h-[320px] col-span-2' },
        { src: '/hero-back4.png', className: 'w-[270px] h-[280px]' },
        { src: '/hero-back.png', className: 'w-[270px] h-[280px]' }
      ]
    },
    {
      type: 'double-vertical',
      images: [
        { src: '/hero-back2.png', className: 'w-[360px] h-[300px]' },
        { src: '/hero-back3.png', className: 'w-[360px] h-[360px]' }
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
        className={`flex items-center h-full px-[10vw] gap-16 ${isDraggableActive ? 'cursor-grab active:cursor-grabbing' : ''}`}
      >
        <div ref={textContainerRef} className="flex-shrink-0 w-[35vw] mr-10 transition-all duration-1000">
          <span className="font-source text-[10px] tracking-[0.4em] uppercase opacity-40 block mb-6">
            (02) <TranslatedText>Galería</TranslatedText>
          </span>
          <h2 className="text-[6vw] font-prata leading-[0.9] text-secondary mb-8 uppercase">
            <TranslatedText>{content.title}</TranslatedText>
          </h2>
          <p className="font-source text-sm text-secondary/60 max-w-[320px] leading-relaxed italic">
            <TranslatedText>{content.subtitle}</TranslatedText>
          </p>
          <div className="mt-12">
            <button 
              onClick={handleEnableDrag}
              disabled={isDraggableActive}
              className={`px-8 py-3 border border-secondary/20 rounded-full font-source text-[10px] tracking-widest uppercase text-secondary hover:bg-secondary hover:text-white transition-all ${isDraggableActive ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <TranslatedText>{content.view_all}</TranslatedText>
            </button>
          </div>
        </div>

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
      </div>

      {/* Indicador visual de drag */}
      {isDraggableActive && (
        <div 
          ref={dragIndicatorRef}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3"
        >
          <div className="flex items-center gap-2 text-secondary/70">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            <span className="font-source text-[9px] tracking-[0.3em] uppercase">Arrastra para explorar</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      )}
    </section>
  );
};

export default GallerySection;
