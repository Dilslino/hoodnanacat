"use client";

import { Suspense } from "react";
import { CameraRig } from "./CameraRig";
import { ExhibitionRoom } from "./ExhibitionRoom";
import { StudioLighting } from "./StudioLighting";
import { ClawMachine } from "./machine/ClawMachine";
import type { ParallaxTarget } from "@/hooks/usePointerParallax";

interface ExperienceProps {
  parallax: ParallaxTarget;
}

export function Experience({ parallax }: ExperienceProps) {
  return (
    <>
      <CameraRig parallax={parallax} />
      <StudioLighting />
      <ExhibitionRoom />
      <Suspense fallback={null}>
        <ClawMachine />
      </Suspense>
      <fog attach="fog" args={["#f4efe4", 6, 16]} />
    </>
  );
}
