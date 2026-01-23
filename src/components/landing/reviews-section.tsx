"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Testimonial {
  text: string;
  author: string;
  country: string;
}

interface Category {
  label: string;
  score: number;
}

interface ReviewsSectionProps {
  content: {
    title: string;
    overall_score: string;
    overall_label: string;
    comments_count: string;
    categories_title: string;
    categories: Category[];
    testimonials: Testimonial[];
  };
}

const ReviewsSection = ({ content }: ReviewsSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<HTMLDivElement[]>([]);
  const scoreRef = useRef<HTMLSpanElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Animación del Score Principal (Incremento de número)
      const scoreObj = { value: 0 };
      const targetScore = parseFloat(content.overall_score);
      
      gsap.to(scoreObj, {
        value: targetScore,
        duration: 3,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
        onUpdate: () => {
          if (scoreRef.current) {
            scoreRef.current.innerText = scoreObj.value.toFixed(1);
          }
        }
      });

      // 2. Animación del Contador de Comentarios
      const countObj = { value: 0 };
      const targetCount = parseInt(content.comments_count.split(' ')[0]);
      
      gsap.to(countObj, {
        value: targetCount,
        duration: 3,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
        onUpdate: () => {
          if (countRef.current) {
            countRef.current.innerText = Math.floor(countObj.value).toString();
          }
        }
      });

      // 3. Barras de Progreso
      barsRef.current.forEach((bar, index) => {
        const targetWidth = (content.categories[index].score / 10) * 100;
        gsap.fromTo(bar, 
          { width: "0%" },
          { 
            width: `${targetWidth}%`, 
            duration: 2, 
            delay: 0.2 + (index * 0.1),
            ease: "expo.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
            }
          }
        );
      });

      // 4. Se ha eliminado el efecto Sticky por solicitud del usuario
      
      // 5. Animación de Testimonios (Entrada + Parallax por Columnas)
      const cards = gsap.utils.toArray<HTMLElement>(".testimonial-card");
      
      cards.forEach((card, i) => {
        // Entrada inicial suave
        gsap.from(card, {
          opacity: 0,
          y: 30,
          rotation: i % 2 === 0 ? -1 : 1,
          duration: 0.4,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 95%",
          }
        });
      });

      // 6. Parallax por COLUMNAS (Evita colisiones entre tarjetas)
      gsap.to(".testimonial-col-1", {
        y: -50,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });

      gsap.to(".testimonial-col-2", {
        y: -150,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, [content]);

  // Dividir testimonios en dos columnas para el desorden
  const col1 = content.testimonials.filter((_, i) => i % 2 === 0);
  const col2 = content.testimonials.filter((_, i) => i % 2 !== 0);

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full bg-secondary pt-32 pb-12 px-6 md:px-12 lg:px-20 overflow-hidden text-white"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-32 text-center">
          <span className="font-source text-[10px] tracking-[0.4em] uppercase opacity-40 block mb-4">
            (03) Testimonios
          </span>
          <h2 className="text-5xl md:text-7xl font-prata text-white uppercase leading-tight">
            {content.title}
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-20 relative">
          
          {/* Lado Izquierdo: Score */}
          <div className="w-full lg:w-[40%]">
            <div ref={stickyRef} className="pt-10">
              <div className="bg-white/5 backdrop-blur-sm p-10 md:p-16 shadow-2xl rounded-sm border border-white/10 relative overflow-hidden">
                {/* Sutil gradiente de fondo */}
                <div className="absolute top-0 left-0 w-full h-1 bg-white/20"></div>
                
                <div className="flex items-center gap-8 mb-16">
                  <div className="bg-white text-secondary w-24 h-24 flex items-center justify-center rounded-2xl shadow-xl rotate-3">
                    <span ref={scoreRef} className="text-4xl font-prata font-bold text-secondary">0.0</span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-prata text-white leading-none mb-3">{content.overall_label}</h3>
                    <p className="font-source text-xs opacity-50 uppercase tracking-[0.2em] text-white">
                      <span ref={countRef} className="font-bold">0</span> {content.comments_count.split(' ')[1]}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-10">
                  <h4 className="font-source text-[10px] uppercase tracking-[0.3em] font-bold text-white/30">
                    {content.categories_title}
                  </h4>
                  {content.categories.map((cat, idx) => (
                    <div key={idx} className="flex flex-col gap-4">
                      <div className="flex justify-between items-center font-source text-[10px] tracking-widest uppercase">
                        <span className="text-white/60">{cat.label}</span>
                        <span className="font-bold text-white">{cat.score}</span>
                      </div>
                      <div className="h-[1px] w-full bg-white/10 relative">
                        <div 
                          ref={(el) => { if (el) barsRef.current[idx] = el; }}
                          className="absolute top-0 left-0 h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Lado Derecho: Testimonios en Desorden Ordenado */}
          <div className="w-full lg:w-[60%] flex flex-col md:flex-row gap-8 lg:pt-20">
            {/* Columna 1 */}
            <div className="testimonial-col-1 flex flex-col gap-12 flex-1">
              {col1.map((item, idx) => (
                <div 
                  key={`col1-${idx}`} 
                  className="testimonial-card flex flex-col gap-8 p-10 bg-white/5 backdrop-blur-sm shadow-xl rounded-sm border border-white/5 group hover:border-white/20 transition-all duration-500 h-fit"
                >
                  <div className="opacity-10 group-hover:opacity-40 transition-opacity duration-700">
                    <svg width="40" height="30" viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0 24V11.2C0 7.73333 0.866667 4.93333 2.6 2.8C4.33333 0.666667 7.13333 -0.266667 11 0L11.8 4.2C9.53333 4.2 7.8 4.8 6.6 6C5.4 7.2 4.8 8.8 4.8 10.8H11V24H0ZM18.2 24V11.2C18.2 7.73333 19.0667 4.93333 20.8 2.8C22.5333 0.666667 25.3333 -0.266667 29.2 0L30 4.2C27.7333 4.2 26 4.8 24.8 6C23.6 7.2 23 8.8 23 10.8H29.2V24H18.2Z" fill="white" />
                    </svg>
                  </div>
                  <p className="font-source text-base leading-relaxed text-white/80 italic">
                    {item.text}
                  </p>
                  <div className="mt-4 pt-8 border-t border-white/5 flex flex-col gap-2">
                    <span className="font-prata text-white text-xl">{item.author}</span>
                    <span className="font-source text-[9px] tracking-[0.3em] uppercase opacity-30 text-white">{item.country}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Columna 2 - Offset natural */}
            <div className="testimonial-col-2 flex flex-col gap-12 flex-1 md:mt-32">
              {col2.map((item, idx) => (
                <div 
                  key={`col2-${idx}`} 
                  className="testimonial-card flex flex-col gap-8 p-10 bg-white/5 backdrop-blur-sm shadow-xl rounded-sm border border-white/5 group hover:border-white/20 transition-all duration-500 h-fit"
                >
                  <div className="opacity-10 group-hover:opacity-40 transition-opacity duration-700">
                    <svg width="40" height="30" viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0 24V11.2C0 7.73333 0.866667 4.93333 2.6 2.8C4.33333 0.666667 7.13333 -0.266667 11 0L11.8 4.2C9.53333 4.2 7.8 4.8 6.6 6C5.4 7.2 4.8 8.8 4.8 10.8H11V24H0ZM18.2 24V11.2C18.2 7.73333 19.0667 4.93333 20.8 2.8C22.5333 0.666667 25.3333 -0.266667 29.2 0L30 4.2C27.7333 4.2 26 4.8 24.8 6C23.6 7.2 23 8.8 23 10.8H29.2V24H18.2Z" fill="white" />
                    </svg>
                  </div>
                  <p className="font-source text-base leading-relaxed text-white/80 italic">
                    {item.text}
                  </p>
                  <div className="mt-4 pt-8 border-t border-white/5 flex flex-col gap-2">
                    <span className="font-prata text-white text-xl">{item.author}</span>
                    <span className="font-source text-[9px] tracking-[0.3em] uppercase opacity-30 text-white">{item.country}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Decoración */}
      <div className="absolute top-0 right-0 w-1/3 h-full border-l border-white/[0.02] pointer-events-none -z-10"></div>
      <div className="absolute top-0 left-0 w-1/3 h-full border-r border-white/[0.02] pointer-events-none -z-10"></div>
    </section>
  );
};

export default ReviewsSection;
