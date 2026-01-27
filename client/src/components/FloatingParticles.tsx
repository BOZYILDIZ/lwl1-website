/*
 * NEURAL FLUX - Particules flottantes CSS
 * Effet de particules légères en arrière-plan
 * Optimisé pour les performances (CSS uniquement)
 */

import { useMemo } from 'react';

interface Particle {
  id: number;
  size: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
  opacity: number;
}

interface FloatingParticlesProps {
  count?: number;
  className?: string;
}

export default function FloatingParticles({ count = 50, className = '' }: FloatingParticlesProps) {
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      size: Math.random() * 3 + 1,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 10,
      opacity: Math.random() * 0.5 + 0.1
    }));
  }, [count]);

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`}>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-white"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            opacity: particle.opacity,
            animation: `floatParticle ${particle.duration}s ease-in-out ${particle.delay}s infinite`,
          }}
        />
      ))}
      
      <style>{`
        @keyframes floatParticle {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: var(--particle-opacity, 0.3);
          }
          25% {
            transform: translate(10px, -20px) scale(1.1);
          }
          50% {
            transform: translate(-5px, -40px) scale(0.9);
            opacity: calc(var(--particle-opacity, 0.3) * 1.5);
          }
          75% {
            transform: translate(15px, -20px) scale(1.05);
          }
        }
      `}</style>
    </div>
  );
}
