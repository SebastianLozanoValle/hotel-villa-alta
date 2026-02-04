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

  // Mapear todas las imágenes de las carpetas del hotel
  const allImages = [
    // HABITACION SUITE BALCON 1
    '/FOTOS HOTEL VILLA ALTA/HABITACION SUITE BALCON 1/SUITE ALCOBA 1.jpg',
    '/FOTOS HOTEL VILLA ALTA/HABITACION SUITE BALCON 1/EXPERIENCIAS VILLA ALTA.jpeg',
    '/FOTOS HOTEL VILLA ALTA/HABITACION SUITE BALCON 1/FACHADA.jpg',
    '/FOTOS HOTEL VILLA ALTA/HABITACION SUITE BALCON 1/LOBBY HUESPEDES.jpg',
    '/FOTOS HOTEL VILLA ALTA/HABITACION SUITE BALCON 1/LOBBY HOTEL.jpg',
    '/FOTOS HOTEL VILLA ALTA/HABITACION SUITE BALCON 1/SUITE DUPLEX 1 ANTESALA.jpg',
    '/FOTOS HOTEL VILLA ALTA/HABITACION SUITE BALCON 1/SUITE SALA.jpg',
    '/FOTOS HOTEL VILLA ALTA/HABITACION SUITE BALCON 1/VISTA.jpg',
    '/FOTOS HOTEL VILLA ALTA/HABITACION SUITE BALCON 1/BAÑO SUITE 1.jpg',
    '/FOTOS HOTEL VILLA ALTA/HABITACION SUITE BALCON 1/HAB SUITE DUPLEX 1.jpg',
    '/FOTOS HOTEL VILLA ALTA/HABITACION SUITE BALCON 1/LOBBY 2PISO.jpg',
    '/FOTOS HOTEL VILLA ALTA/HABITACION SUITE BALCON 1/ENTRADA HOTEL.jpg',
    '/FOTOS HOTEL VILLA ALTA/HABITACION SUITE BALCON 1/LOOBY.jpg',
    
    // HABITACION SUITE BALCON 2
    '/FOTOS HOTEL VILLA ALTA/HABITACION SUITE BALCON 2/SUITE DUPLEX 2.jpg',
    '/FOTOS HOTEL VILLA ALTA/HABITACION SUITE BALCON 2/SUITE DUPLEX -2.jpg',
    '/FOTOS HOTEL VILLA ALTA/HABITACION SUITE BALCON 2/SUITE DUPLEX 2-CAMA HAB.jpg',
    '/FOTOS HOTEL VILLA ALTA/HABITACION SUITE BALCON 2/SUITE DUPLEX 2-CAMA.jpg',
    '/FOTOS HOTEL VILLA ALTA/HABITACION SUITE BALCON 2/HAB SUITE DUPLEX -2.jpg',
    '/FOTOS HOTEL VILLA ALTA/HABITACION SUITE BALCON 2/BAÑO SUITE 2.jpg',
    '/FOTOS HOTEL VILLA ALTA/HABITACION SUITE BALCON 2/UBICACION.jpg',
    
    // HABITACION SUITE BALCON 3
    '/FOTOS HOTEL VILLA ALTA/HABITACION SUITE BALCON 3/SUITE DUPLEX -3.jpg',
    '/FOTOS HOTEL VILLA ALTA/HABITACION SUITE BALCON 3/SUITE DUPLEX -hab 3.jpg',
    '/FOTOS HOTEL VILLA ALTA/HABITACION SUITE BALCON 3/SUITE DUPLEX HAB-3 CAMA.jpg',
    
    // HABITACION SUITE BALCON 4
    '/FOTOS HOTEL VILLA ALTA/HABITACION SUITE BALCON 4/SUITE DUPLEX -4.jpg',
    '/FOTOS HOTEL VILLA ALTA/HABITACION SUITE BALCON 4/SUITE DUPLEX HAB-4 CAMA.jpg',
    '/FOTOS HOTEL VILLA ALTA/HABITACION SUITE BALCON 4/SUITE DUPLEX HAB-4.jpg',
    '/FOTOS HOTEL VILLA ALTA/HABITACION SUITE BALCON 4/BAÑO SUITE 4.jpg',
    
    // HABITACION SUITE BALCON 5
    '/FOTOS HOTEL VILLA ALTA/HABITACION SUITE BALCON 5/SUITE DUPLEX -5.jpg',
    '/FOTOS HOTEL VILLA ALTA/HABITACION SUITE BALCON 5/SUITE DUPLEX -5CAMA.jpg',
    '/FOTOS HOTEL VILLA ALTA/HABITACION SUITE BALCON 5/SUITE DUPLEX HAB 5.jpg',
    '/FOTOS HOTEL VILLA ALTA/HABITACION SUITE BALCON 5/BAÑO SUITE 5.jpg',
    
    // HABITACION SUITE 6
    '/FOTOS HOTEL VILLA ALTA/HABITACION SUITE 6/SUITE DUPLEX HAB-6 CAMA.jpg',
    '/FOTOS HOTEL VILLA ALTA/HABITACION SUITE 6/SUITE DUPLEX -6 SIN BALCON.jpg',
    '/FOTOS HOTEL VILLA ALTA/HABITACION SUITE 6/SUITE DUPLEX -HAB 6 SIN BALCON.jpg',
    '/FOTOS HOTEL VILLA ALTA/HABITACION SUITE 6/BAÑO - HAB 6 Y 7.jpg',
    '/FOTOS HOTEL VILLA ALTA/HABITACION SUITE 6/BAÑO HAB 6 Y 7.jpg',
    
    // HABITACION PREMIUM SENCILLA 7
    '/FOTOS HOTEL VILLA ALTA/HABITACION PREMIUM SENCILLA 7/HABITACION PREMIUM SENCILLA 7.jpg',
    '/FOTOS HOTEL VILLA ALTA/HABITACION PREMIUM SENCILLA 7/HABITACION PREMIUM - SENCILLA 7.jpg',
    '/FOTOS HOTEL VILLA ALTA/HABITACION PREMIUM SENCILLA 7/HAB PREMIUM - SENCILLA 7.jpg',
    '/FOTOS HOTEL VILLA ALTA/HABITACION PREMIUM SENCILLA 7/BAÑO - HAB 6 Y 7.jpg',
    '/FOTOS HOTEL VILLA ALTA/HABITACION PREMIUM SENCILLA 7/BAÑO HAB 6 Y 7.jpg',
  ];

  // Función para organizar las imágenes en bloques variados
  const organizeImagesIntoBlocks = (images: string[]) => {
    const blocks: Array<{ type: string; images: Array<{ src: string; className: string }> }> = [];
    let index = 0;
    
    const blockTypes = [
      { type: 'single', sizes: ['w-[450px] h-[600px]', 'w-[400px] h-[550px]', 'w-[480px] h-[620px]'] },
      { type: 'double-vertical', sizes: [
        ['w-[350px] h-[280px]', 'w-[350px] h-[350px]'],
        ['w-[320px] h-[250px]', 'w-[320px] h-[380px]'],
        ['w-[360px] h-[300px]', 'w-[360px] h-[360px]']
      ]},
      { type: 'wide-over-double', sizes: [
        ['w-[600px] h-[350px] col-span-2', 'w-[290px] h-[300px]', 'w-[290px] h-[300px]'],
        ['w-[550px] h-[320px] col-span-2', 'w-[270px] h-[280px]', 'w-[270px] h-[280px]']
      ]}
    ];
    
    while (index < images.length) {
      const blockTypeIndex = blocks.length % 3;
      const blockType = blockTypes[blockTypeIndex];
      
      if (blockType.type === 'single') {
        const sizes = blockType.sizes as string[];
        const sizeIndex = Math.floor(blocks.length / 3) % sizes.length;
        if (index < images.length) {
          blocks.push({
      type: 'single',
            images: [{ src: images[index], className: sizes[sizeIndex] }]
          });
          index++;
        }
      } else if (blockType.type === 'double-vertical') {
        const sizes = blockType.sizes as string[][];
        const sizeIndex = Math.floor(blocks.length / 3) % sizes.length;
        if (index + 1 < images.length) {
          blocks.push({
      type: 'double-vertical',
      images: [
              { src: images[index], className: sizes[sizeIndex][0] },
              { src: images[index + 1], className: sizes[sizeIndex][1] }
            ]
          });
          index += 2;
        } else if (index < images.length) {
          blocks.push({
            type: 'single',
            images: [{ src: images[index], className: 'w-[400px] h-[550px]' }]
          });
          index++;
        }
      } else if (blockType.type === 'wide-over-double') {
        const sizes = blockType.sizes as string[][];
        const sizeIndex = Math.floor(blocks.length / 3) % sizes.length;
        if (index + 2 < images.length) {
          blocks.push({
      type: 'wide-over-double',
      images: [
              { src: images[index], className: sizes[sizeIndex][0] },
              { src: images[index + 1], className: sizes[sizeIndex][1] },
              { src: images[index + 2], className: sizes[sizeIndex][2] }
            ]
          });
          index += 3;
        } else if (index < images.length) {
          blocks.push({
            type: 'single',
            images: [{ src: images[index], className: 'w-[400px] h-[550px]' }]
          });
          index++;
        }
      }
    }
    
    return blocks;
  };

  const galleryBlocks = organizeImagesIntoBlocks(allImages);

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
