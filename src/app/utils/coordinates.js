// src/utils/coordinates.js
import * as THREE from 'three';

// Function to convert Latitude/Longitude to 3D Cartesian coordinates on a sphere
export function latLonToSphereCoords(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}