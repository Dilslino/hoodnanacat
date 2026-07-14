"use client";

import { HoodNanaCat } from "./HoodNanaCat";
import { CABINET, PLUSH_SPAWNS } from "@/lib/machineLayout";

/**
 * Spawns the pile of HoodNanaCat plush toys resting on the machine floor.
 */
export function PlushField() {
  return (
    <group>
      {PLUSH_SPAWNS.map((spawn, i) => (
        <HoodNanaCat
          key={i}
          id={i}
          position={[spawn.x, CABINET.floorY + 0.14, spawn.z]}
          rotationY={spawn.rotationY}
          variant={spawn.variant}
        />
      ))}
    </group>
  );
}
