'use client';

import React, { useState, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

const MAX_LINES = 40; // Fewer concurrent lines
const LINE_LIFETIME = 2.0; // Seconds a line stays visible
const LINE_SPAWN_RATE = 0.05; // Lower chance to spawn each frame
const GLOBE_RADIUS = 2.5; // Must match the radius in GlobeVisualization
const LINE_SEGMENTS = 16; // Fewer segments reduces geometry complexity
const CURVE_ARC_FACTOR = 1.1; // How much the arc bows outwards

const YELLOW = new THREE.Color('#FFDC00');
const RED = new THREE.Color('#FF4136');

interface AttackLineData {
  id: number;
  points: THREE.Vector3[];
  vertexColors: [number, number, number][]; // Array of color tuples [r, g, b]
  opacity: number;
  birthTime: number;
}

function getRandomSpherePoint(radius: number): THREE.Vector3 {
  const phi = Math.acos(-1 + (2 * Math.random()));
  const theta = Math.random() * 2 * Math.PI;

  return new THREE.Vector3(
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function createArcPoints(start: THREE.Vector3, end: THREE.Vector3, segments = LINE_SEGMENTS): THREE.Vector3[] {
  const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
  const controlPoint = midpoint.setLength(GLOBE_RADIUS * CURVE_ARC_FACTOR);
  const curve = new THREE.QuadraticBezierCurve3(start, controlPoint, end);
  return curve.getPoints(segments);
}

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
  const gradientVertexColors = useMemo(() => createGradientColors(), []);

  useFrame(({ clock }) => {
    const now = clock.elapsedTime;

    // Update existing lines
    const updatedLines = lines
      .map(line => {
        const age = now - line.birthTime;
        const lifeProgress = Math.min(age / LINE_LIFETIME, 1);
        let opacity;
        const fadeInDuration = 0.2;
        const fadeOutStart = 0.7;
        const maxOpacity = 0.75;

        if (lifeProgress < fadeInDuration) {
          opacity = (lifeProgress / fadeInDuration) * maxOpacity;
        } else if (lifeProgress < fadeOutStart) {
          opacity = maxOpacity;
        } else {
          opacity = Math.max(0, (1 - (lifeProgress - fadeOutStart) / (1 - fadeOutStart))) * maxOpacity;
        }

        return { ...line, opacity };
      })
      .filter(line => now - line.birthTime < LINE_LIFETIME);

    // Spawn new line occasionally
    if (updatedLines.length < MAX_LINES && Math.random() < LINE_SPAWN_RATE) {
      const startPoint = getRandomSpherePoint(GLOBE_RADIUS);
      let endPoint = getRandomSpherePoint(GLOBE_RADIUS);

      while (startPoint.distanceTo(endPoint) < GLOBE_RADIUS * 0.5) {
        endPoint = getRandomSpherePoint(GLOBE_RADIUS);
      }

      const linePoints = createArcPoints(startPoint, endPoint);
      updatedLines.push({
        id: lineIdCounter++,
        points: linePoints,
        vertexColors: gradientVertexColors,
        opacity: 0.0,
        birthTime: now,
      });
    }

    setLines(updatedLines);
  });

  return (
    <>
      {lines.map((line) => (
        <Line
          key={line.id}
          points={line.points}
          vertexColors={line.vertexColors}
          lineWidth={1.0}
          transparent
          opacity={line.opacity}
          dashed={false}
        />
      ))}
    </>
  );
}