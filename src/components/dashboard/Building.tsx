'use client';

import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { Repository, useCityStore } from '@/lib/store';

// Procedural window texture generator
function createBuildingTexture() {
  if (typeof document === 'undefined') return null; // SSR safety
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // Base glass color
    ctx.fillStyle = '#0f172a'; // slate-900
    ctx.fillRect(0, 0, 512, 512);
    
    // Draw window grid
    const rows = 16;
    const cols = 16;
    const cellW = 512 / cols;
    const cellH = 512 / rows;
    
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        // Window frame
        ctx.strokeStyle = '#1e293b'; // slate-800
        ctx.lineWidth = 4;
        ctx.strokeRect(x * cellW, y * cellH, cellW, cellH);
        
        // Window glass
        const isLit = Math.random() > 0.8;
        if (isLit) {
          // Warm interior light
          ctx.fillStyle = Math.random() > 0.5 ? '#fef08a' : '#fde047';
          ctx.globalAlpha = 0.6 + Math.random() * 0.4;
          ctx.fillRect(x * cellW + 2, y * cellH + 2, cellW - 4, cellH - 4);
          ctx.globalAlpha = 1.0;
        } else {
          // Reflection/dark glass
          ctx.fillStyle = '#020617';
          ctx.fillRect(x * cellW + 2, y * cellH + 2, cellW - 4, cellH - 4);
          
          // Add subtle diagonal reflection
          ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
          ctx.beginPath();
          ctx.moveTo(x * cellW + 2, y * cellH + 2);
          ctx.lineTo(x * cellW + cellW - 2, y * cellH + cellH - 2);
          ctx.lineTo(x * cellW + 2, y * cellH + cellH - 2);
          ctx.fill();
        }
      }
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

let baseTexture: THREE.CanvasTexture | null = null;

export function Building({ repo }: { repo: Repository }) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const selectedRepo = useCityStore((state) => state.selectedRepo);
  const setSelectedRepo = useCityStore((state) => state.setSelectedRepo);

  const isSelected = selectedRepo === repo.id;

  // Calculate dimensions based on commits and stars
  // Height is purely based on commits as requested
  const width = Math.max(2, 2 + Math.log10(repo.stars + 1) * 2);
  const height = Math.max(4, repo.commits * 0.5); // 0.5 units per commit for dramatic scale
  const depth = width;

  // Generate materials
  const materials = useMemo(() => {
    if (!baseTexture) {
      baseTexture = createBuildingTexture();
    }
    
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: '#ffffff',
      roughness: 0.1,
      metalness: 0.9,
    });

    if (baseTexture) {
      const texClone = baseTexture.clone();
      texClone.repeat.set(Math.max(1, width / 2), Math.max(1, height / 2));
      texClone.needsUpdate = true;
      
      wallMaterial.map = texClone;
      wallMaterial.emissiveMap = texClone;
      wallMaterial.emissive = new THREE.Color('#ffffff');
      wallMaterial.emissiveIntensity = 0.4;
    }

    const roofMaterial = new THREE.MeshStandardMaterial({
      color: '#0a0a0a',
      roughness: 1,
      metalness: 0,
    });

    return [wallMaterial, wallMaterial, roofMaterial, roofMaterial, wallMaterial, wallMaterial];
  }, [width, height]);

  const highlightColor = isSelected ? '#ffa500' : hovered ? '#ffd700' : '#ffffff';

  useFrame((state) => {
    if (groupRef.current && isSelected) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 3) * 0.2;
    } else if (groupRef.current) {
      groupRef.current.position.y = 0;
    }
  });

  return (
    <group 
      position={[repo.x, 0, repo.z]} 
      ref={groupRef}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
      onClick={(e) => { e.stopPropagation(); setSelectedRepo(repo.id); }}
    >
      {/* The Building */}
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow material={materials}>
        <boxGeometry args={[width, height, depth]} />
      </mesh>

      {/* Selection/Hover Highlight */}
      {(isSelected || hovered) && (
        <mesh position={[0, height / 2, 0]}>
          <boxGeometry args={[width + 0.1, height + 0.1, depth + 0.1]} />
          <meshBasicMaterial color={highlightColor} wireframe transparent opacity={0.3} />
        </mesh>
      )}

      {/* Label */}
      <Text
        position={[0, height + 1, 0]}
        fontSize={height * 0.1 > 1 ? height * 0.1 : 1}
        color={highlightColor}
        anchorX="center"
        anchorY="middle"
      >
        {repo.name}
      </Text>
    </group>
  );
}
