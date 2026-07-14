/**
 * Shared spatial constants for the claw machine. Keeping these in one place
 * means the cabinet geometry, the claw's travel bounds, and the plush toy
 * spawn positions all agree on the same coordinate system.
 */

export const CABINET = {
  width: 2.6,
  depth: 2.6,
  height: 2.9,
  /** Y position of the cabinet's base/feet. */
  baseY: 0,
  /** Interior play-field floor height (where plush toys rest). */
  floorY: 0.34,
  /** Interior ceiling where the gantry/rail system lives. */
  railY: 2.42,
} as const;

export const CLAW_BOUNDS = {
  xMin: -0.92,
  xMax: 0.92,
  zMin: -0.92,
  zMax: 0.92,
  /** Claw fully retracted (idle/travel height). */
  yTop: 2.3,
  /** Claw fully lowered into the pile. */
  yBottom: 0.55,
} as const;

export const PRIZE_ZONE = {
  /** Where a captured toy is carried to before being dropped down the chute. */
  chute: { x: -0.92, y: CLAW_BOUNDS.yTop, z: 0.92 },
};

export const PLUSH_SPAWNS: Array<{ x: number; z: number; rotationY: number; variant: number }> = [
  { x: -0.35, z: -0.2, rotationY: 0.4, variant: 0 },
  { x: 0.25, z: -0.35, rotationY: -0.6, variant: 1 },
  { x: 0.0, z: 0.15, rotationY: 1.1, variant: 2 },
  { x: -0.55, z: 0.3, rotationY: -1.3, variant: 0 },
  { x: 0.5, z: 0.1, rotationY: 2.1, variant: 1 },
  { x: 0.1, z: -0.55, rotationY: 0.2, variant: 2 },
  { x: -0.15, z: 0.5, rotationY: -0.9, variant: 1 },
  { x: 0.55, z: -0.05, rotationY: 1.6, variant: 0 },
];
