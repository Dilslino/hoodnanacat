"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import type { ParallaxTarget } from "@/hooks/usePointerParallax";
import { damp } from "@/lib/mathUtils";

const BASE_POSITION = new Vector3(0, 1.55, 4.6);
const LOOK_TARGET = new Vector3(0, 1.05, 0);

interface CameraRigProps {
  parallax: ParallaxTarget;
}

/**
 * Slow cinematic float + subtle parallax drift. The camera never snaps —
 * every offset is exponentially damped so the room always feels like it's
 * breathing rather than reacting.
 */
export function CameraRig({ parallax }: CameraRigProps) {
  const { camera } = useThree();
  const elapsed = useRef(0);
  const current = useRef(new Vector3().copy(BASE_POSITION));

  useFrame((_, delta) => {
    elapsed.current += delta;
    const t = elapsed.current;

    const breatheX = Math.sin(t * 0.12) * 0.06;
    const breatheY = Math.sin(t * 0.09 + 1.3) * 0.035;

    const px = parallax.current.x * 0.32;
    const py = -parallax.current.y * 0.18;

    const targetX = BASE_POSITION.x + breatheX + px;
    const targetY = BASE_POSITION.y + breatheY + py;
    const targetZ = BASE_POSITION.z + Math.sin(t * 0.07) * 0.05;

    current.current.x = damp(current.current.x, targetX, 2.2, delta);
    current.current.y = damp(current.current.y, targetY, 2.2, delta);
    current.current.z = damp(current.current.z, targetZ, 2.2, delta);

    camera.position.copy(current.current);
    camera.lookAt(LOOK_TARGET.x + px * 0.15, LOOK_TARGET.y + py * 0.1, LOOK_TARGET.z);
  });

  return null;
}
