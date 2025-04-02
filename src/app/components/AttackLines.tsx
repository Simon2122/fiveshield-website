// src/components/AttackLines.tsx (MODIFIED for random-to-random attacks)
'use client';

import React, { useState, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
// We don't need ovhLocations or latLonToSphereCoords anymore for this version

const MAX_LINES = 70; // Max concurrent attack lines (adjust for performance/density)
const LINE_LIFETIME = 2.0; // Seconds a line stays visible
const LINE_SPAWN_RATE = 0.1; // Chance to spawn a line each frame (lower = fewer)
const GLOBE_RADIUS = 2.5; // Must match the radius in GlobeVisualization
const LINE_SEGMENTS = 10; // Number of segments for the curve and gradient
const CURVE_ARC_FACTOR = 1.1; // How much the arc bows outwards

// Define start and end colors for the gradient
const YELLOW = new THREE.Color('#FFDC00');
const RED = new THREE.Color('#FF4136');

interface AttackLineData {
  id: number;
  points: THREE.Vector3[];
  vertexColors: [number, number, number][]; // Array of color tuples [r, g, b]
  opacity: number;
  birthTime: number;
}

// Helper to generate a random point on the sphere surface
function getRandomSpherePoint(radius: number): THREE.Vector3 {
  const phi = Math.acos(-1 + (2 * Math.random()));
  const theta = Math.random() * 2 * Math.PI;

  return new THREE.Vector3(
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

// Helper to create points for a curved arc between two points on the sphere
function createArcPoints(start: THREE.Vector3, end: THREE.Vector3, segments = LINE_SEGMENTS): THREE.Vector3[] {
    const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    // Ensure the control point is pushed outwards relative to the sphere center
    const controlPoint = midpoint.setLength(GLOBE_RADIUS * CURVE_ARC_FACTOR);
    const curve = new THREE.QuadraticBezierCurve3(start, controlPoint, end);
    return curve.getPoints(segments);
}

// Helper to create vertex colors for the gradient (Yellow to Red)
function createGradientColors(segments = LINE_SEGMENTS): [number, number, number][] {
    const colors: [number, number, number][] = [];
    const startColor = YELLOW;
    const endColor = RED;

    for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const color = startColor.clone().lerp(endColor, t);
        colors.push([color.r, color.g, color.b]);
    }
    return colors;
}

let lineIdCounter = 0;

export function AttackLines() {
  const [lines, setLines] = useState<AttackLineData[]>([]);

  // Pre-calculate the yellow-to-red gradient colors
  const gradientVertexColors = useMemo(() => createGradientColors(), []);

  useFrame(({ clock }) => {
    const now = clock.elapsedTime;

    // 1. Update existing lines (opacity) and filter out old lines
    const updatedLines = lines.map(line => {
      const age = now - line.birthTime;
      const lifeProgress = Math.min(age / LINE_LIFETIME, 1);

      // Opacity: Fade in quickly, hold, then fade out
      let opacity;
      const fadeInDuration = 0.2; // 20% of lifetime
      const fadeOutStart = 0.7; // Start fade out at 70% of lifetime
      const maxOpacity = 0.75; // Peak opacity

      if (lifeProgress < fadeInDuration) {
        opacity = (lifeProgress / fadeInDuration) * maxOpacity;
      } else if (lifeProgress < fadeOutStart) {
        opacity = maxOpacity;
      } else {
        opacity = Math.max(0, (1 - (lifeProgress - fadeOutStart) / (1 - fadeOutStart))) * maxOpacity;
      }

      return { ...line, opacity };
    }).filter(line => (now - line.birthTime) < LINE_LIFETIME);

    // 2. Spawn new lines occasionally
    if (updatedLines.length < MAX_LINES && Math.random() < LINE_SPAWN_RATE) {
      const startPoint = getRandomSpherePoint(GLOBE_RADIUS);
      let endPoint = getRandomSpherePoint(GLOBE_RADIUS);

      // Optional: Ensure start and end points are reasonably far apart
      while (startPoint.distanceTo(endPoint) < GLOBE_RADIUS * 0.5) { // Avoid tiny lines
          endPoint = getRandomSpherePoint(GLOBE_RADIUS);
      }

      const linePoints = createArcPoints(startPoint, endPoint);

      updatedLines.push({
        id: lineIdCounter++,
        points: linePoints,
        vertexColors: gradientVertexColors,
        opacity: 0.0, // Start transparent
        birthTime: now,
      });
    }

    // 3. Update state
    setLines(updatedLines);
  });

  return (
    <>
      {lines.map((line) => (
        <Line
          key={line.id}
          points={line.points}
          vertexColors={line.vertexColors} // Use the yellow-to-red gradient
          lineWidth={1.0} // Thinner lines might look more numerous/chaotic
          transparent
          opacity={line.opacity}
          dashed={false}
        />
      ))}
    </>
  );
}