"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { InstancedMesh, Object3D, Quaternion, Vector3 } from "three";
import type { CableSimulation } from "@/lib/rope";

const UP = new Vector3(0, 1, 0);

interface CableProps {
  simulation: CableSimulation;
  radius?: number;
}

/**
 * Renders the rope simulation's control points as a chain of thin brushed
 * steel cylinders. Using an InstancedMesh keeps this to a single draw call
 * regardless of segment count, and orientation/scale are recomputed every
 * frame from the simulation's current point positions.
 */
export function Cable({ simulation, radius = 0.012 }: CableProps) {
  const meshRef = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);
  const segmentVec = useMemo(() => new Vector3(), []);
  const midpoint = useMemo(() => new Vector3(), []);
  const quaternion = useMemo(() => new Quaternion(), []);

  const segmentCount = simulation.points.length - 1;

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    for (let i = 0; i < segmentCount; i++) {
      const a = simulation.points[i];
      const b = simulation.points[i + 1];
      segmentVec.subVectors(b, a);
      const length = Math.max(segmentVec.length(), 1e-5);
      midpoint.addVectors(a, b).multiplyScalar(0.5);
      quaternion.setFromUnitVectors(UP, segmentVec.normalize());
      dummy.position.copy(midpoint);
      dummy.quaternion.copy(quaternion);
      dummy.scale.set(1, length, 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, segmentCount]} castShadow>
      <cylinderGeometry args={[radius, radius, 1, 8]} />
      <meshStandardMaterial color="#c7c9cb" metalness={0.85} roughness={0.35} />
    </instancedMesh>
  );
}
