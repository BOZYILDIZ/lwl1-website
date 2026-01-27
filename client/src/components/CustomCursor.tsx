/*
 * NEURAL FLUX - Curseur personnalisé
 * Effet de lumière qui suit le curseur
 * Crée une sensation de profondeur et d'interaction
 */

import { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    if (!cursor || !cursorDot) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setIsVisible(true);
      
      // Position immédiate pour le point central
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    // Animation fluide pour le cercle externe
    const animate = () => {
      const dx = mouseX - cursorX;
      const dy = mouseY - cursorY;
      
      cursorX += dx * 0.15;
      cursorY += dy * 0.15;
      
      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;
      
      requestAnimationFrame(animate);
    };

    // Détecter les éléments interactifs
    const handleElementHover = () => {
      const interactiveElements = document.querySelectorAll('button, a, [role="button"]');
      
      interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', () => setIsHovering(true));
        el.addEventListener('mouseleave', () => setIsHovering(false));
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    handleElementHover();
    animate();

    // Observer pour les nouveaux éléments
    const observer = new MutationObserver(handleElementHover);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      observer.disconnect();
    };
  }, []);

  // Ne pas afficher sur mobile/tablette
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <>
      {/* Cercle externe avec glow */}
      <div
        ref={cursorRef}
        className={`fixed pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        } ${isHovering ? 'scale-150' : 'scale-100'}`}
        style={{
          width: '40px',
          height: '40px',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '50%',
          boxShadow: isHovering 
            ? '0 0 20px rgba(255, 255, 255, 0.3), 0 0 40px rgba(255, 255, 255, 0.1)' 
            : '0 0 10px rgba(255, 255, 255, 0.1)',
          mixBlendMode: 'difference',
        }}
      />
      
      {/* Point central */}
      <div
        ref={cursorDotRef}
        className={`fixed pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          width: '6px',
          height: '6px',
          backgroundColor: 'white',
          borderRadius: '50%',
          boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
        }}
      />
    </>
  );
}
