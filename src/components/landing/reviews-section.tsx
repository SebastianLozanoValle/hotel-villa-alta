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
  const barsRef = useRef<HTMLDivElement[]>([]);
  const scoreRef = useRef<HTMLSpanElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
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

      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        gsap.to(".testimonial-col-1", {
          y: -100,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          }
        });

        gsap.to(".testimonial-col-2", {
          y: -200,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          }
        });
      });

    }, sectionRef);

    return () => ctx.revert();
  }, [content]);

  const col1 = content.testimonials.filter((_, i) => i % 2 === 0);
  const col2 = content.testimonials.filter((_, i) => i % 2 !== 0);

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full bg-secondary pt-32 pb-12 px-6 md:px-12 lg:px-20 overflow-hidden text-white"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 text-center">
          <span className="font-source text-[10px] tracking-[0.4em] uppercase opacity-40 block mb-4">
            (03) Testimonios
          </span>
          <h2 className="text-3xl md:text-4xl font-prata text-white uppercase leading-tight">
            {content.title}
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-20 relative">
          <div className="w-full lg:w-[40%]">
            <div className="pt-10">
              <div className="bg-white/5 backdrop-blur-sm p-10 md:p-16 shadow-2xl rounded-sm border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-white/20"></div>
                
                <div className="flex items-center gap-8 mb-16">
                  <div className="bg-accent-rose text-white w-24 h-24 flex items-center justify-center rounded-2xl shadow-xl rotate-3">
                    <span ref={scoreRef} className="text-4xl font-prata font-bold text-white">0.0</span>
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
                      <div className="h-px w-full bg-white/10 relative">
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

          <div className="w-full lg:w-[60%] flex flex-col md:flex-row gap-6 md:gap-12 lg:pt-20">
            <div className="testimonial-col-1 flex flex-col gap-8 flex-1">
              {col1.map((item, idx) => (
                <div 
                  key={`col1-${idx}`} 
                  className="testimonial-card flex flex-col gap-3 p-5 bg-white/5 backdrop-blur-sm shadow-xl rounded-sm border border-white/5 group hover:border-white/20 h-fit"
                >
                  <p className="font-source text-xs md:text-sm leading-relaxed text-white/80 italic">
                    {item.text}
                  </p>
                  <div className="mt-1 pt-3 border-t border-white/5 flex flex-col gap-0.5">
                    <span className="font-prata text-white text-base">{item.author}</span>
                    <span className="font-source text-[7px] tracking-[0.3em] uppercase opacity-30 text-white">{item.country}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="testimonial-col-2 flex flex-col gap-8 flex-1 md:mt-32">
              {col2.map((item, idx) => (
                <div 
                  key={`col2-${idx}`} 
                  className="testimonial-card flex flex-col gap-3 p-5 bg-white/5 backdrop-blur-sm shadow-xl rounded-sm border border-white/5 group hover:border-white/20 h-fit"
                >
                  <p className="font-source text-xs md:text-sm leading-relaxed text-white/80 italic">
                    {item.text}
                  </p>
                  <div className="mt-1 pt-3 border-t border-white/5 flex flex-col gap-0.5">
                    <span className="font-prata text-white text-base">{item.author}</span>
                    <span className="font-source text-[7px] tracking-[0.3em] uppercase opacity-30 text-white">{item.country}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
