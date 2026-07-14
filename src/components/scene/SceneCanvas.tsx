"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Group } from "three";
import { usePointerParallax } from "@/hooks/usePointerParallax";

function Plush({ position, color, hood }: { position: [number, number, number]; color: string; hood: string }) {
  const ref = useRef<Group>(null);
  useFrame((_, d) => {
    if (ref.current) ref.current.rotation.y += d * 0.35;
  });
  return (
    <group ref={ref} position={position}>
      <mesh castShadow receiveShadow position={[0, 0.12, 0]}>
        <capsuleGeometry args={[0.12, 0.16, 8, 18]} />
        <meshStandardMaterial color={color} roughness={0.86} />
      </mesh>
      <mesh castShadow position={[0, 0.28, 0]}>
        <sphereGeometry args={[0.12, 24, 24]} />
        <meshStandardMaterial color={color} roughness={0.86} />
      </mesh>
      <mesh castShadow position={[0, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.105, 0.035, 10, 24]} />
        <meshStandardMaterial color={hood} roughness={0.75} />
      </mesh>
      <mesh position={[-0.04, 0.28, 0.105]}><sphereGeometry args={[0.014, 10, 10]} /><meshStandardMaterial color="#111" /></mesh>
      <mesh position={[0.04, 0.28, 0.105]}><sphereGeometry args={[0.014, 10, 10]} /><meshStandardMaterial color="#111" /></mesh>
      <mesh castShadow position={[-0.07, 0.39, 0]}><coneGeometry args={[0.035, 0.09, 14]} /><meshStandardMaterial color={color} /></mesh>
      <mesh castShadow position={[0.07, 0.39, 0]}><coneGeometry args={[0.035, 0.09, 14]} /><meshStandardMaterial color={color} /></mesh>
    </group>
  );
}

function PremiumMachine() {
  const rig = useRef<Group>(null);
  const parallax = usePointerParallax();
  useFrame((_, d) => {
    if (rig.current) {
      rig.current.rotation.y += ((parallax.current.x * 0.08) - rig.current.rotation.y) * d * 2;
      rig.current.rotation.x += ((-parallax.current.y * 0.035) - rig.current.rotation.x) * d * 2;
    }
  });
  return (
    <group ref={rig} position={[0, -0.25, 0]}>
      <mesh receiveShadow position={[0, -0.04, 0]}>
        <boxGeometry args={[7, 0.08, 7]} />
        <meshStandardMaterial color="#efe9dd" roughness={0.9} />
      </mesh>
      <mesh receiveShadow position={[0, 1.35, -1.55]}>
        <boxGeometry args={[7, 3.2, 0.08]} />
        <meshStandardMaterial color="#f6f0e6" roughness={0.95} />
      </mesh>
      <group position={[0, 1.3, 0]}>
        <mesh castShadow receiveShadow position={[0, -0.95, 0]}>
          <boxGeometry args={[2.9, 0.3, 2.6]} />
          <meshStandardMaterial color="#171717" metalness={0.35} roughness={0.32} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 0.38, 0]}>
          <boxGeometry args={[2.7, 2.45, 2.5]} />
          <meshPhysicalMaterial color="#f0ede6" metalness={0.16} roughness={0.22} transmission={0.45} transparent opacity={0.35} />
        </mesh>
        <mesh castShadow position={[0, 1.72, 0]}>
          <boxGeometry args={[2.95, 0.22, 2.75]} />
          <meshStandardMaterial color="#111111" metalness={0.62} roughness={0.22} />
        </mesh>
        <mesh castShadow position={[0, 1.33, 0]}>
          <boxGeometry args={[0.34, 0.08, 0.24]} />
          <meshStandardMaterial color="#d9dad9" metalness={0.8} roughness={0.24} />
        </mesh>
        <mesh castShadow position={[0, 0.92, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.78, 12]} />
          <meshStandardMaterial color="#c8c8c8" metalness={0.9} roughness={0.35} />
        </mesh>
        <mesh castShadow position={[0, 0.5, 0]}>
          <sphereGeometry args={[0.09, 18, 18]} />
          <meshStandardMaterial color="#e6e6e6" metalness={0.9} roughness={0.2} />
        </mesh>
        <Plush position={[-0.45, -0.66, -0.2]} color="#f3d35b" hood="#161616" />
        <Plush position={[0.35, -0.66, -0.35]} color="#7da36d" hood="#303030" />
        <Plush position={[0.05, -0.66, 0.25]} color="#d67b3d" hood="#171717" />
        <Plush position={[0.62, -0.66, 0.08]} color="#f3d35b" hood="#161616" />
      </group>
    </group>
  );
}

export function SceneCanvas() {
  const [dprCeiling] = useState(1.25);
  return (
    <Canvas
      shadows
      dpr={[1, dprCeiling]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ fov: 38, near: 0.1, far: 40, position: [0, 1.65, 5.2] }}
    >
      <color attach="background" args={["#F8F5EF"]} />
      <fog attach="fog" args={["#f4efe4", 7, 15]} />
      <ambientLight intensity={0.65} color="#fff4e2" />
      <directionalLight position={[3.4, 5.8, 4]} intensity={2.3} color="#fff1dd" castShadow />
      <pointLight position={[0, 2.8, 2.2]} intensity={6} color="#ffd8a0" distance={8} />
      <PremiumMachine />
    </Canvas>
  );
}
