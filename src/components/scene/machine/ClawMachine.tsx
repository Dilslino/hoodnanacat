"use client";

import { Cabinet } from "./Cabinet";
import { ClawController } from "./ClawController";
import { PlushField } from "./PlushField";

/**
 * Visual-first claw machine assembly. Physics is intentionally bypassed for the
 * public build so the premium 3D presentation always renders immediately on
 * Vercel/browser environments, even if Rapier WASM loading is slow or blocked.
 */
export function ClawMachine() {
  return (
    <group>
      <Cabinet />
      <PlushField />
      <ClawController />
    </group>
  );
}
