"use client";

import { useMemo } from "react";
import { MeshReflectorMaterial } from "@react-three/drei";
import { Color } from "three";

const WALL_COLOR = new Color("#efe9df");
const FLOOR_COLOR = new Color("#e3ddd2");

/**
 * A minimal luxury exhibition room: warm concrete floor with a soft
 * reflection, a curved cyc-wall backdrop, and no clutter. The room exists
 * purely to give the machine somewhere premium to sit — it should never
 * compete for attention.
 */
export function ExhibitionRoom() {
  // (radiusTop, radiusBottom, height, radialSegments)
  const wallCurveGeometryArgs = useMemo(() => [9, 9, 12, 64] as const, []);

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[24, 24]} />
        <MeshReflectorMaterial
          blur={[200, 60]}
          resolution={512}
          mixBlur={1}
          mixStrength={35}
          roughness={0.92}
          depthScale={1}
          minDepthThreshold={0.85}
          maxDepthThreshold={1.4}
          color={FLOOR_COLOR}
          metalness={0.1}
          mirror={0}
        />
      </mesh>

      {/* Curved backdrop wall (cyclorama style, no visible seam) */}
      <mesh position={[0, 6, -5]} receiveShadow>
        <cylinderGeometry args={wallCurveGeometryArgs} />
        <meshStandardMaterial color={WALL_COLOR} roughness={0.95} metalness={0.02} side={2} />
      </mesh>

      {/* Soft ceiling plane to bounce fill light, kept out of camera view */}
      <mesh position={[0, 6.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[16, 16]} />
        <meshStandardMaterial color="#f4f0e8" roughness={1} />
      </mesh>
    </group>
  );
}
