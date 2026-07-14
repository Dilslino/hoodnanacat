"use client";

import { Physics, RigidBody } from "@react-three/rapier";
import { Cabinet } from "./Cabinet";
import { ClawController } from "./ClawController";
import { PlushField } from "./PlushField";
import { CABINET } from "@/lib/machineLayout";

/**
 * The complete claw machine assembly: physical shell, physics world, plush
 * pile, and the claw rig. Isolated as its own component so the Experience
 * tree stays readable — this is the one thing the whole scene revolves
 * around.
 */
export function ClawMachine() {
  return (
    <group>
      <Cabinet />
      <Physics gravity={[0, -9.81, 0]}>
        {/* Invisible floor collider for the play field so dropped plush settle naturally */}
        <RigidBody type="fixed" colliders="cuboid" position={[0, CABINET.floorY + 0.02, 0]}>
          <mesh visible={false}>
            <boxGeometry args={[CABINET.width - 0.14, 0.02, CABINET.depth - 0.14]} />
          </mesh>
        </RigidBody>
        <PlushField />
        <ClawController />
      </Physics>
    </group>
  );
}
