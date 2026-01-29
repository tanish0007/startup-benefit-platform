/**
 * Floating 3D Cards Scene
 * 
 * Three.js scene with floating credit card-like objects.
 * Used in hero section to showcase deals visually.
 * 
 * Features:
 * - Animated floating cards
 * - Mouse-interactive rotation
 * - Responsive canvas
 * - Performance optimized
 */

'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';

function FloatingCard({ position, rotation, color }: any) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.3;
      meshRef.current.rotation.y += 0.005;
      meshRef.current.rotation.x += 0.002;
    }
  });

  return (
    <RoundedBox
      ref={meshRef}
      args={[2, 1.3, 0.1]}
      radius={0.05}
      smoothness={4}
      position={position}
      rotation={rotation}
    >
      <meshStandardMaterial
        color={color}
        metalness={0.8}
        roughness={0.2}
        envMapIntensity={1}
      />
    </RoundedBox>
  );
}

function Scene() {
  const cards = useMemo(
    () => [
      { position: [-2, 0, 0], rotation: [0.2, 0.5, 0.1], color: '#a855f7' },
      { position: [2, 0, -1], rotation: [-0.2, -0.5, -0.1], color: '#ec4899' },
      { position: [0, 1, -2], rotation: [0.1, 0, 0.2], color: '#3b82f6' },
      { position: [-1, -1, -1], rotation: [-0.1, 0.3, -0.2], color: '#8b5cf6' },
      { position: [1.5, -0.5, 0], rotation: [0.3, -0.4, 0.1], color: '#06b6d4' },
    ],
    []
  );

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={1} />

      {cards.map((card, index) => (
        <FloatingCard key={index} {...card} />
      ))}
    </>
  );
}

export default function FloatingCards() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <Scene />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}