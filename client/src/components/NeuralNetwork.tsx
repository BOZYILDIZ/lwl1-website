/*
 * NEURAL FLUX - Composant 3D WebGL
 * Réseau neuronal interactif avec particules et connexions
 * Réagit au scroll et au mouvement de la souris
 */

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Configuration du réseau neuronal
const PARTICLE_COUNT = 150;
const CONNECTION_DISTANCE = 2.5;
const MOUSE_INFLUENCE = 0.3;

interface ParticleSystemProps {
  scrollProgress: number;
  mousePosition: { x: number; y: number };
}

function ParticleSystem({ scrollProgress, mousePosition }: ParticleSystemProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const { viewport } = useThree();
  
  // Générer les positions initiales des particules
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const vel = new Float32Array(PARTICLE_COUNT * 3);
    
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      // Distribution sphérique avec variation
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 3 + Math.random() * 4;
      
      pos[i3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i3 + 2] = radius * Math.cos(phi);
      
      // Vélocités aléatoires pour le mouvement organique
      vel[i3] = (Math.random() - 0.5) * 0.02;
      vel[i3 + 1] = (Math.random() - 0.5) * 0.02;
      vel[i3 + 2] = (Math.random() - 0.5) * 0.02;
    }
    
    return [pos, vel];
  }, []);
  
  // Géométrie des points
  const pointsGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, [positions]);
  
  // Géométrie des lignes pour les connexions
  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const maxConnections = PARTICLE_COUNT * PARTICLE_COUNT;
    const linePositions = new Float32Array(maxConnections * 6);
    const lineColors = new Float32Array(maxConnections * 6);
    geometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));
    geometry.setDrawRange(0, 0);
    return geometry;
  }, []);
  
  // Animation frame
  useFrame((state) => {
    if (!pointsRef.current || !linesRef.current) return;
    
    const time = state.clock.elapsedTime;
    const positionAttribute = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const posArray = positionAttribute.array as Float32Array;
    
    // Mettre à jour les positions des particules
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      
      // Mouvement organique basé sur le bruit
      posArray[i3] += velocities[i3] + Math.sin(time * 0.5 + i) * 0.003;
      posArray[i3 + 1] += velocities[i3 + 1] + Math.cos(time * 0.3 + i) * 0.003;
      posArray[i3 + 2] += velocities[i3 + 2] + Math.sin(time * 0.4 + i) * 0.003;
      
      // Influence de la souris
      const dx = mousePosition.x * viewport.width * 0.5 - posArray[i3];
      const dy = mousePosition.y * viewport.height * 0.5 - posArray[i3 + 1];
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 3) {
        const force = (3 - dist) / 3 * MOUSE_INFLUENCE;
        posArray[i3] += dx * force * 0.01;
        posArray[i3 + 1] += dy * force * 0.01;
      }
      
      // Contraindre les particules dans une sphère
      const currentDist = Math.sqrt(
        posArray[i3] ** 2 + posArray[i3 + 1] ** 2 + posArray[i3 + 2] ** 2
      );
      
      if (currentDist > 8) {
        const scale = 8 / currentDist;
        posArray[i3] *= scale;
        posArray[i3 + 1] *= scale;
        posArray[i3 + 2] *= scale;
      }
    }
    
    positionAttribute.needsUpdate = true;
    
    // Mettre à jour les connexions
    const linePositions = lineGeometry.attributes.position.array as Float32Array;
    const lineColors = lineGeometry.attributes.color.array as Float32Array;
    let lineIndex = 0;
    
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      for (let j = i + 1; j < PARTICLE_COUNT; j++) {
        const i3 = i * 3;
        const j3 = j * 3;
        
        const dx = posArray[i3] - posArray[j3];
        const dy = posArray[i3 + 1] - posArray[j3 + 1];
        const dz = posArray[i3 + 2] - posArray[j3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        if (dist < CONNECTION_DISTANCE) {
          const alpha = 1 - dist / CONNECTION_DISTANCE;
          const li6 = lineIndex * 6;
          
          // Position de la ligne
          linePositions[li6] = posArray[i3];
          linePositions[li6 + 1] = posArray[i3 + 1];
          linePositions[li6 + 2] = posArray[i3 + 2];
          linePositions[li6 + 3] = posArray[j3];
          linePositions[li6 + 4] = posArray[j3 + 1];
          linePositions[li6 + 5] = posArray[j3 + 2];
          
          // Couleur avec alpha
          lineColors[li6] = alpha;
          lineColors[li6 + 1] = alpha;
          lineColors[li6 + 2] = alpha;
          lineColors[li6 + 3] = alpha;
          lineColors[li6 + 4] = alpha;
          lineColors[li6 + 5] = alpha;
          
          lineIndex++;
        }
      }
    }
    
    lineGeometry.setDrawRange(0, lineIndex * 2);
    lineGeometry.attributes.position.needsUpdate = true;
    lineGeometry.attributes.color.needsUpdate = true;
    
    // Rotation basée sur le scroll
    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.1 + scrollProgress * Math.PI * 2;
      pointsRef.current.rotation.x = Math.sin(time * 0.05) * 0.2;
    }
    
    if (linesRef.current) {
      linesRef.current.rotation.y = time * 0.1 + scrollProgress * Math.PI * 2;
      linesRef.current.rotation.x = Math.sin(time * 0.05) * 0.2;
    }
  });
  
  return (
    <>
      {/* Particules */}
      <points ref={pointsRef} geometry={pointsGeometry}>
        <pointsMaterial
          size={0.08}
          color="#ffffff"
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
      
      {/* Connexions */}
      <lineSegments ref={linesRef} geometry={lineGeometry}>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </>
  );
}

// Composant principal exporté
export default function NeuralNetwork() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? scrollTop / docHeight : 0);
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      });
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  return (
    <div className="three-canvas">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 60 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance'
        }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#000000']} />
        <fog attach="fog" args={['#000000', 10, 25]} />
        <ambientLight intensity={0.5} />
        <ParticleSystem 
          scrollProgress={scrollProgress} 
          mousePosition={mousePosition} 
        />
      </Canvas>
    </div>
  );
}
