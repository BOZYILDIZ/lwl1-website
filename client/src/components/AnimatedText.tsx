/*
 * NEURAL FLUX - Texte animé
 * Effet de révélation caractère par caractère
 * Animation cinématographique pour les titres
 */

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface AnimatedTextProps {
  children: string;
  className?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  delay?: number;
  stagger?: number;
  triggerOnScroll?: boolean;
}

export default function AnimatedText({
  children,
  className = '',
  tag: Tag = 'span',
  delay = 0,
  stagger = 0.03,
  triggerOnScroll = true
}: AnimatedTextProps) {
  const containerRef = useRef<HTMLElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Diviser le texte en mots et caractères
    const words = children.split(' ');
    container.innerHTML = words.map(word => 
      `<span class="word inline-block">${
        word.split('').map(char => 
          `<span class="char inline-block opacity-0">${char === ' ' ? '&nbsp;' : char}</span>`
        ).join('')
      }</span>`
    ).join('<span class="space inline-block">&nbsp;</span>');

    const chars = container.querySelectorAll('.char');
    
    setIsReady(true);

    if (triggerOnScroll) {
      // Animation au scroll
      gsap.to(chars, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: stagger,
        delay: delay,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });

      // État initial
      gsap.set(chars, { opacity: 0, y: 20 });
    } else {
      // Animation immédiate
      gsap.fromTo(chars, 
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.5, 
          stagger: stagger,
          delay: delay,
          ease: 'power2.out'
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === container) {
          trigger.kill();
        }
      });
    };
  }, [children, delay, stagger, triggerOnScroll]);

  return (
    <Tag 
      ref={containerRef as React.RefObject<never>} 
      className={`${className} ${!isReady ? 'opacity-0' : ''}`}
    >
      {children}
    </Tag>
  );
}

// Composant pour les lignes qui se révèlent
export function RevealLine({ className = '', delay = 0 }: { className?: string; delay?: number }) {
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const line = lineRef.current;
    if (!line) return;

    gsap.fromTo(line,
      { scaleX: 0, transformOrigin: 'left center' },
      {
        scaleX: 1,
        duration: 1.2,
        delay: delay,
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: line,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  }, [delay]);

  return <div ref={lineRef} className={`h-0.5 bg-white ${className}`} />;
}

// Composant pour les compteurs animés
export function AnimatedCounter({ 
  end, 
  duration = 2, 
  suffix = '',
  className = '' 
}: { 
  end: number; 
  duration?: number; 
  suffix?: string;
  className?: string;
}) {
  const counterRef = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const counter = counterRef.current;
    if (!counter || hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            
            gsap.to({ value: 0 }, {
              value: end,
              duration: duration,
              ease: 'power2.out',
              onUpdate: function() {
                if (counter) {
                  counter.textContent = Math.round(this.targets()[0].value) + suffix;
                }
              }
            });
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(counter);

    return () => observer.disconnect();
  }, [end, duration, suffix, hasAnimated]);

  return <span ref={counterRef} className={className}>0{suffix}</span>;
}
