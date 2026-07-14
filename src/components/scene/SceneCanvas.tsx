"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, PerformanceMonitor } from "@react-three/drei";
import { Experience } from "./Experience";
import { usePointerParallax } from "@/hooks/usePointerParallax";

/**
 * Owns the R3F Canvas and its performance guardrails. AdaptiveDpr backs off
 * pixel ratio under load, and PerformanceMonitor steps quality down further
 * (shadow map size, DPR ceiling) if a device consistently drops below the
 * target frame budget — keeping the "60 FPS everywhere" promise honest on
 * mid-range mobile hardware instead of just desktop.
 */
export function SceneCanvas() {
  const parallax = usePointerParallax();
  const [dprCeiling, setDprCeiling] = useState(1.25);

  return (
    <Canvas
      shadows
      dpr={[1, dprCeiling]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ fov: 38, near: 0.1, far: 40, position: [0, 1.55, 4.6] }}
    >
      <color attach="background" args={["#F8F5EF"]} />
      <PerformanceMonitor onDecline={() => setDprCeiling(1)} onIncline={() => setDprCeiling(1.25)} />
      <AdaptiveDpr pixelated={false} />
      <Experience parallax={parallax} />
    </Canvas>
  );
}
