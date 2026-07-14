"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { Group } from "three";

const ALUMINUM = { color: "#e2e3e4", metalness: 0.9, roughness: 0.22 };
const DARK_METAL = { color: "#4a4b4d", metalness: 0.85, roughness: 0.3 };

export interface ClawHeadHandle {
  setOpenAmount: (amount: number) => void;
}

interface ClawHeadProps {
  radius?: number;
}

/**
 * The claw's gripping mechanism: a brushed-aluminum hub with three hinged
 * fingers. `setOpenAmount(0..1)` drives the hinge rotation directly, so the
 * controller can animate open/close without touching React state every
 * frame.
 */
export const ClawHead = forwardRef<ClawHeadHandle, ClawHeadProps>(function ClawHead(
  { radius = 0.09 },
  ref
) {
  const finger0 = useRef<Group>(null);
  const finger1 = useRef<Group>(null);
  const finger2 = useRef<Group>(null);

  useImperativeHandle(
    ref,
    () => ({
      setOpenAmount(amount: number) {
        // amount: 0 = fully open, 1 = fully closed
        const openAngle = 0.15; // fingers splayed outward when open
        const closeAngle = 1.05; // fingers curled inward when closed
        const angle = openAngle + (closeAngle - openAngle) * amount;
        [finger0, finger1, finger2].forEach((f) => {
          if (f.current) f.current.rotation.x = -angle;
        });
      },
    }),
    []
  );

  const fingerRefs = [finger0, finger1, finger2];

  return (
    <group>
      {/* Hub */}
      <mesh castShadow>
        <cylinderGeometry args={[radius * 0.55, radius * 0.55, 0.07, 20]} />
        <meshStandardMaterial {...ALUMINUM} />
      </mesh>

      {/* Cable attachment eyelet */}
      <mesh position={[0, 0.045, 0]} castShadow>
        <torusGeometry args={[0.02, 0.007, 8, 16]} />
        <meshStandardMaterial {...DARK_METAL} />
      </mesh>

      {/* Three hinged fingers, spaced 120deg apart */}
      {fingerRefs.map((fingerRef, i) => {
        const angle = (i / 3) * Math.PI * 2;
        const x = Math.cos(angle) * radius * 0.55;
        const z = Math.sin(angle) * radius * 0.55;
        return (
          <group key={i} position={[x, -0.02, z]} rotation={[0, -angle, 0]}>
            <group ref={fingerRef} rotation={[-0.15, 0, 0]}>
              <mesh castShadow position={[0, -0.045, 0]}>
                <boxGeometry args={[0.018, 0.09, 0.03]} />
                <meshStandardMaterial {...DARK_METAL} />
              </mesh>
              {/* Curled tip */}
              <mesh castShadow position={[0, -0.09, 0.015]} rotation={[0.9, 0, 0]}>
                <boxGeometry args={[0.016, 0.045, 0.024]} />
                <meshStandardMaterial {...DARK_METAL} />
              </mesh>
            </group>
          </group>
        );
      })}
    </group>
  );
});
