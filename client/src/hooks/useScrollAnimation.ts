/*
 * NEURAL FLUX - Hook d'animation au scroll
 * Utilise GSAP ScrollTrigger pour des animations cinématographiques
 */

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Enregistrer le plugin ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

interface ScrollAnimationOptions {
  trigger?: string | Element;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  markers?: boolean;
  toggleActions?: string;
  onEnter?: () => void;
  onLeave?: () => void;
  onEnterBack?: () => void;
  onLeaveBack?: () => void;
}

export function useScrollAnimation<T extends HTMLElement>(
  animationCallback: (element: T, gsapInstance: typeof gsap) => gsap.core.Timeline | gsap.core.Tween | void,
  options: ScrollAnimationOptions = {},
  deps: React.DependencyList = []
) {
  const elementRef = useRef<T>(null);
  const animationRef = useRef<gsap.core.Timeline | gsap.core.Tween | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Créer le contexte GSAP pour le nettoyage automatique
    const ctx = gsap.context(() => {
      const animation = animationCallback(element, gsap);
      
      if (animation) {
        animationRef.current = animation;
        
        // Créer le ScrollTrigger si des options sont fournies
        if (options.trigger || options.start || options.end) {
          ScrollTrigger.create({
            trigger: options.trigger || element,
            start: options.start || 'top 80%',
            end: options.end || 'bottom 20%',
            scrub: options.scrub ?? false,
            markers: options.markers ?? false,
            toggleActions: options.toggleActions || 'play none none reverse',
            animation: animation,
            onEnter: options.onEnter,
            onLeave: options.onLeave,
            onEnterBack: options.onEnterBack,
            onLeaveBack: options.onLeaveBack,
          });
        }
      }
    }, element);

    return () => {
      ctx.revert();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return elementRef;
}

// Hook simplifié pour les animations de fade-in
export function useFadeIn<T extends HTMLElement>(
  delay: number = 0,
  duration: number = 1,
  y: number = 50
) {
  return useScrollAnimation<T>(
    (element, gsapInstance) => {
      gsapInstance.set(element, { opacity: 0, y });
      return gsapInstance.to(element, {
        opacity: 1,
        y: 0,
        duration,
        delay,
        ease: 'power3.out',
      });
    },
    { start: 'top 85%', toggleActions: 'play none none none' }
  );
}

// Hook pour les animations de révélation de texte
export function useTextReveal<T extends HTMLElement>(delay: number = 0) {
  return useScrollAnimation<T>(
    (element, gsapInstance) => {
      const chars = element.querySelectorAll('.char');
      if (chars.length === 0) {
        // Si pas de caractères individuels, animer l'élément entier
        gsapInstance.set(element, { opacity: 0, y: 30 });
        return gsapInstance.to(element, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay,
          ease: 'power3.out',
        });
      }
      
      gsapInstance.set(chars, { opacity: 0, y: 20 });
      return gsapInstance.to(chars, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        delay,
        stagger: 0.02,
        ease: 'power2.out',
      });
    },
    { start: 'top 80%', toggleActions: 'play none none none' }
  );
}

// Hook pour les animations parallax
export function useParallax<T extends HTMLElement>(speed: number = 0.5) {
  return useScrollAnimation<T>(
    (element, gsapInstance) => {
      return gsapInstance.to(element, {
        y: () => -window.innerHeight * speed,
        ease: 'none',
      });
    },
    { start: 'top bottom', end: 'bottom top', scrub: true }
  );
}

// Hook pour les animations de scale
export function useScaleIn<T extends HTMLElement>(delay: number = 0) {
  return useScrollAnimation<T>(
    (element, gsapInstance) => {
      gsapInstance.set(element, { opacity: 0, scale: 0.8 });
      return gsapInstance.to(element, {
        opacity: 1,
        scale: 1,
        duration: 1,
        delay,
        ease: 'power3.out',
      });
    },
    { start: 'top 85%', toggleActions: 'play none none none' }
  );
}

// Hook pour les animations de ligne
export function useLineReveal<T extends HTMLElement>(delay: number = 0) {
  return useScrollAnimation<T>(
    (element, gsapInstance) => {
      gsapInstance.set(element, { scaleX: 0, transformOrigin: 'left center' });
      return gsapInstance.to(element, {
        scaleX: 1,
        duration: 1.2,
        delay,
        ease: 'power3.inOut',
      });
    },
    { start: 'top 80%', toggleActions: 'play none none none' }
  );
}

export default useScrollAnimation;
