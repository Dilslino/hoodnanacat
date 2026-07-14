import type { RapierRigidBody } from "@react-three/rapier";
import { Vector3 } from "three";

export interface PlushEntry {
  id: number;
  api: RapierRigidBody;
  grabbed: boolean;
}

const registry = new Map<number, PlushEntry>();

export function registerPlush(entry: PlushEntry) {
  registry.set(entry.id, entry);
}

export function unregisterPlush(id: number) {
  registry.delete(id);
}

export function setPlushGrabbed(id: number, grabbed: boolean) {
  const entry = registry.get(id);
  if (entry) entry.grabbed = grabbed;
}

const tmpPos = new Vector3();

/**
 * Finds the closest un-grabbed plush toy within `radius` of `point`.
 * Used by the claw controller when it closes its fingers at the bottom of
 * a descent, deciding what (if anything) gets picked up.
 */
export function findNearestPlush(point: Vector3, radius: number): PlushEntry | null {
  let closest: PlushEntry | null = null;
  let closestDist = radius;

  for (const entry of registry.values()) {
    if (entry.grabbed) continue;
    const translation = entry.api.translation();
    tmpPos.set(translation.x, translation.y, translation.z);
    const dist = tmpPos.distanceTo(point);
    if (dist <= closestDist) {
      closestDist = dist;
      closest = entry;
    }
  }

  return closest;
}
