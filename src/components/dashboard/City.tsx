'use client';

import React, { useMemo, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { useCityStore } from '@/lib/store';
import { Building } from './Building';

export function City() {
  const repos = useCityStore((state) => state.repos);
  const setSelectedRepo = useCityStore((state) => state.setSelectedRepo);

  useEffect(() => {
    console.log("3D Metropolis: Rendering with", repos.length, "repositories");
  }, [repos.length]);

  return (
    <div className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
      <Canvas
        shadows
        camera={{ position: [60, 60, 60], fov: 45 }}
        onPointerMissed={() => setSelectedRepo(null)}
        gl={{ antialias: true, alpha: true }}
      >
        <Sky 
          sunPosition={[100, 20, 100]} 
          turbidity={0.1} 
          rayleigh={0.5} 
        />
        <Environment preset="night" />
        
        <ambientLight intensity={0.5} />
        <pointLight position={[50, 50, 50]} intensity={1.5} castShadow />
        <directionalLight
          position={[-50, 50, -50]}
          intensity={0.8}
          castShadow
        />

        {/* The Grid / Ground */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
          <planeGeometry args={[1000, 1000]} />
          <meshStandardMaterial 
            color="#09090b"
            roughness={1}
            metalness={0}
          />
        </mesh>

        {/* Grid Helper for scale verification */}
        <gridHelper args={[200, 20, '#ffb84d', '#27272a']} position={[0, -0.4, 0]} />

        {/* Buildings */}
        {repos.map((repo) => (
          <Building key={repo.id} repo={repo} />
        ))}

        {/* Fallback Building if empty (Ghost Building) */}
        {repos.length === 0 && (
          <mesh position={[0, 10, 0]} rotation={[0, Math.PI / 4, 0]}>
            <boxGeometry args={[10, 20, 10]} />
            <meshStandardMaterial color="#ffb84d" wireframe transparent opacity={0.1} />
          </mesh>
        )}

        <ContactShadows 
          position={[0, -0.45, 0]} 
          opacity={0.5} 
          scale={200} 
          blur={2} 
          far={10} 
        />

        <OrbitControls
          makeDefault
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2 - 0.1}
          maxDistance={300}
          minDistance={20}
          dampingFactor={0.05}
          enableDamping
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  );
}
