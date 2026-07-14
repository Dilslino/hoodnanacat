export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Frame-rate independent damping toward a target, à la Freya Holmér's
 * exponential decay smoothing. `lambda` controls the speed of the decay.
 */
export function damp(current: number, target: number, lambda: number, dt: number): number {
  return lerp(current, target, 1 - Math.exp(-lambda * dt));
}

export function damp3(
  current: [number, number, number],
  target: [number, number, number],
  lambda: number,
  dt: number
): [number, number, number] {
  return [
    damp(current[0], target[0], lambda, dt),
    damp(current[1], target[1], lambda, dt),
    damp(current[2], target[2], lambda, dt),
  ];
}

export function randomRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}
