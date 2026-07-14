"use client";

import { useMemo } from "react";
import { RoundedBox } from "@react-three/drei";
import { CABINET } from "@/lib/machineLayout";

const ALUMINUM = { color: "#d9dadb", metalness: 0.92, roughness: 0.28 };
const MATTE_PLASTIC = { color: "#232323", metalness: 0.1, roughness: 0.75 };
const GLASS = {
  color: "#eef4f2",
  metalness: 0,
  roughness: 0.02,
  transmission: 0.96,
  thickness: 0.08,
  ior: 1.45,
  clearcoat: 1,
  clearcoatRoughness: 0.05,
  transparent: true,
  opacity: 0.35,
};

const HALF_W = CABINET.width / 2;
const HALF_D = CABINET.depth / 2;

/**
 * The claw machine's physical shell: matte plastic base, brushed aluminum
 * frame posts, clear glass enclosure panels, and a warm internal LED strip.
 * Pure presentation — no physics colliders here beyond a simple invisible
 * boundary the claw logic already respects via CLAW_BOUNDS.
 */
export function Cabinet() {
  const framePosts = useMemo(
    () => [
      [-HALF_W, HALF_D],
      [HALF_W, HALF_D],
      [-HALF_W, -HALF_D],
      [HALF_W, -HALF_D],
    ] as const,
    []
  );

  return (
    <group>
      {/* Base plinth — matte plastic, rounded, soft rubber feet implied by contact shadow */}
      <RoundedBox
        args={[CABINET.width + 0.16, 0.34, CABINET.depth + 0.16]}
        radius={0.05}
        smoothness={4}
        position={[0, 0.17, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial {...MATTE_PLASTIC} />
      </RoundedBox>

      {/* Rubber feet */}
      {framePosts.map(([x, z], i) => (
        <mesh key={`foot-${i}`} position={[x * 0.94, 0.03, z * 0.94]} castShadow>
          <cylinderGeometry args={[0.05, 0.06, 0.06, 16]} />
          <meshStandardMaterial color="#111111" roughness={0.9} metalness={0} />
        </mesh>
      ))}

      {/* Aluminum corner posts */}
      {framePosts.map(([x, z], i) => (
        <mesh key={`post-${i}`} position={[x, CABINET.height / 2 + 0.34, z]} castShadow>
          <boxGeometry args={[0.09, CABINET.height, 0.09]} />
          <meshStandardMaterial {...ALUMINUM} />
        </mesh>
      ))}

      {/* Glass enclosure panels (front + 2 sides visible, back is solid for backdrop contrast) */}
      <mesh position={[0, CABINET.height / 2 + 0.34, HALF_D]} castShadow>
        <boxGeometry args={[CABINET.width - 0.1, CABINET.height - 0.14, 0.02]} />
        <meshPhysicalMaterial {...GLASS} />
      </mesh>
      <mesh position={[-HALF_D + 0.005, CABINET.height / 2 + 0.34, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[CABINET.depth - 0.1, CABINET.height - 0.14, 0.02]} />
        <meshPhysicalMaterial {...GLASS} />
      </mesh>
      <mesh position={[HALF_D - 0.005, CABINET.height / 2 + 0.34, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[CABINET.depth - 0.1, CABINET.height - 0.14, 0.02]} />
        <meshPhysicalMaterial {...GLASS} />
      </mesh>

      {/* Solid back panel — matte plastic, hides gantry motor housing */}
      <mesh position={[0, CABINET.height / 2 + 0.34, -HALF_D]} receiveShadow>
        <boxGeometry args={[CABINET.width - 0.1, CABINET.height - 0.14, 0.03]} />
        <meshStandardMaterial {...MATTE_PLASTIC} />
      </mesh>

      {/* Top canopy — brushed aluminum with a soft recessed warm LED strip */}
      <RoundedBox
        args={[CABINET.width + 0.1, 0.14, CABINET.depth + 0.1]}
        radius={0.04}
        position={[0, CABINET.height + 0.34 + 0.07, 0]}
        castShadow
      >
        <meshStandardMaterial {...ALUMINUM} />
      </RoundedBox>

      <mesh position={[0, CABINET.height + 0.34 + 0.005, 0]}>
        <boxGeometry args={[CABINET.width - 0.3, 0.02, CABINET.depth - 0.3]} />
        <meshStandardMaterial
          color="#ffdca0"
          emissive="#ffb35c"
          emissiveIntensity={1.6}
          toneMapped={false}
        />
      </mesh>
      <pointLight
        position={[0, CABINET.height + 0.15, 0]}
        intensity={2.2}
        color="#ffcf8f"
        distance={3.4}
        decay={2}
      />

      {/* Floor of the play field — matte warm surface where plush toys rest */}
      <mesh position={[0, CABINET.floorY, 0]} receiveShadow>
        <boxGeometry args={[CABINET.width - 0.14, 0.04, CABINET.depth - 0.14]} />
        <meshStandardMaterial color="#f1ece0" roughness={0.85} metalness={0} />
      </mesh>

      {/* Chute cutout marker — subtle recessed panel bottom-left where prizes drop */}
      <mesh position={[-0.92, 0.19, 0.92]} receiveShadow>
        <boxGeometry args={[0.62, 0.02, 0.62]} />
        <meshStandardMaterial color="#e2ddce" roughness={0.9} />
      </mesh>
    </group>
  );
}
