// src/components/GlobeVisualization.tsx (MODIFIED - Removed LocationPoints)
'use client';

import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
// Remove Points and PointMaterial if no longer needed
// import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
// Remove imports related to OVH locations if they are no longer used anywhere else
// import { ovhLocations } from '../data/ovhLocations';
// import { latLonToSphereCoords } from '../utils/coordinates';
import { AttackLines } from './AttackLines'; // Ensure this is imported

const GLOBE_RADIUS = 2.5;
// const DOT_SIZE = 0.03; // No longer needed

// --- REMOVE LocationPoints Component ---
// function LocationPoints() { ... }

// --- Component for the faint wireframe globe ---
// (Keep WireframeGlobe component exactly as it was before)
function WireframeGlobe() {
    return (
        <mesh>
        <sphereGeometry args={[GLOBE_RADIUS, 32, 32]} />
        <meshBasicMaterial wireframe color="#374151" transparent opacity={0.1} />
        </mesh>
    );
}

// --- Main Scene component managing camera and rotation ---
function Scene() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock, pointer }) => {
    if (groupRef.current) {
      // Base rotation
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.025;

      // Mouse interaction rotation (smoothed)
      const xRot = (pointer.y * Math.PI * 0.04);
      const yRot = (pointer.x * Math.PI * 0.04);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, xRot, 0.03);
      groupRef.current.rotation.y += THREE.MathUtils.lerp(0, yRot, 0.03);
    }
  });

  return (
    <group ref={groupRef}>
      <WireframeGlobe />
      {/* REMOVE <LocationPoints /> */}
      <AttackLines /> {/* Keep this */}
    </group>
  );
}

// --- The main Canvas wrapper ---
const GlobeVisualization = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-60 md:opacity-70"> {/* Adjust opacity if desired */}
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