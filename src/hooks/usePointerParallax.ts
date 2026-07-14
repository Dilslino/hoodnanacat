"use client";

import { useEffect, useRef } from "react";
import { clamp } from "@/lib/mathUtils";

export interface ParallaxTarget {
  current: { x: number; y: number };
}

/**
 * Tracks a normalized -1..1 parallax vector from mouse movement on desktop
 * and device orientation (gyroscope) on mobile. Consumed inside the R3F
 * render loop via a ref so we avoid re-rendering React on every sample.
 */
export function usePointerParallax(): ParallaxTarget {
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      target.current = { x: clamp(nx, -1, 1), y: clamp(ny, -1, 1) };
    };

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma === null || e.beta === null) return;
      // gamma: left-right tilt (-90..90), beta: front-back tilt (-180..180)
      const nx = clamp(e.gamma / 25, -1, 1);
      const ny = clamp((e.beta - 45) / 25, -1, 1);
      target.current = { x: nx, y: ny };
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("deviceorientation", handleOrientation, true);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("deviceorientation", handleOrientation, true);
    };
  }, []);

  return target;
}

/** Requests iOS 13+ motion permission from a user gesture. Safe no-op elsewhere. */
export async function requestGyroPermission(): Promise<void> {
  type MotionEventWithPermission = typeof DeviceOrientationEvent & {
    requestPermission?: () => Promise<"granted" | "denied">;
  };
  const DOE = DeviceOrientationEvent as unknown as MotionEventWithPermission;
  if (typeof DOE?.requestPermission === "function") {
    try {
      await DOE.requestPermission();
    } catch {
      /* permission denied or unsupported — parallax simply stays mouse-only */
    }
  }
}
