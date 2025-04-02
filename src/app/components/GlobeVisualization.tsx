// src/components/GlobeVisualization.tsx (No Changes Needed Here)
'use client';

import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { AttackLines } from './AttackLines'; // Ensure this is imported

const GLOBE_RADIUS = 2.5;

// --- Component for the faint wireframe globe ---
function WireframeGlobe() {
    return (
        <mesh>
            <sphereGeometry args={[GLOBE_RADIUS, 32, 32]} />
            <meshBasicMaterial wireframe={true} color="#374151" transparent opacity={0.15} />
        </mesh>
    );
}

// --- Main Scene component ---
function Scene() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock, pointer }) => {
    if (groupRef.current) {
        // Rotation logic with increased movement
        groupRef.current.rotation.y = clock.getElapsedTime() * 0.1;
        const xRot = pointer.y * Math.PI * 0.08;
        const yRot = pointer.x * Math.PI * 0.08;
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, xRot, 0.05);
        groupRef.current.rotation.y += THREE.MathUtils.lerp(0, yRot, 0.05);
    }
  });

  return (
    <group ref={groupRef}>
      <WireframeGlobe />
      <AttackLines /> {/* Render attack lines */}
    </group>
  );
}

// --- The main Canvas wrapper ---
const GlobeVisualization = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-60 md:opacity-70">
      <Canvas
        camera={{ position: [0, 0, 7.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
      </Canvas>
    </div>
  );
};

export default GlobeVisualization;