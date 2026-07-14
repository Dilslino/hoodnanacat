import { Vector3 } from "three";

/**
 * A lightweight spring-damped cable simulation. Rather than a full particle
 * chain, each interior point is pulled toward its resting position on the
 * straight line between the two anchors, then displaced by:
 *  - a gravity sag proportional to its position along the cable (parabolic,
 *    strongest at the midpoint)
 *  - a lateral sway that lags behind the top anchor's horizontal
 *    acceleration, like a pendulum reacting to the carriage's motion
 *
 * Both effects are critically-damped springs, so the cable settles smoothly
 * and never oscillates forever. This gives the claw's cable real physical
 * weight (tension, sag, sway) without the cost or fragility of a full
 * constraint solver.
 */
export class CableSimulation {
  readonly points: Vector3[];
  private sway = new Vector3();
  private swayVelocity = new Vector3();
  private prevTop = new Vector3();
  private topVelocity = new Vector3();
  private readonly segmentCount: number;

  constructor(segmentCount = 7) {
    this.segmentCount = segmentCount;
    this.points = Array.from({ length: segmentCount + 1 }, () => new Vector3());
  }

  reset(top: Vector3, bottom: Vector3) {
    this.prevTop.copy(top);
    this.sway.set(0, 0, 0);
    this.swayVelocity.set(0, 0, 0);
    for (let i = 0; i <= this.segmentCount; i++) {
      const t = i / this.segmentCount;
      this.points[i].lerpVectors(top, bottom, t);
    }
  }

  update(top: Vector3, bottom: Vector3, dt: number) {
    const clampedDt = Math.min(dt, 1 / 30);

    // Track top anchor velocity to drive pendulum-style sway.
    const topDelta = new Vector3().subVectors(top, this.prevTop);
    const instantVelocity = topDelta.divideScalar(Math.max(clampedDt, 1e-4));
    this.topVelocity.lerp(instantVelocity, 0.6);
    this.prevTop.copy(top);

    // Critically damped spring pulling sway back to zero, driven by the
    // top anchor's lateral velocity as the forcing term.
    const stiffness = 60;
    const damping = 14;
    const drive = new Vector3(this.topVelocity.x, 0, this.topVelocity.z).multiplyScalar(-0.14);
    const springForce = new Vector3().subVectors(drive, this.sway).multiplyScalar(stiffness);
    this.swayVelocity.addScaledVector(springForce, clampedDt);
    this.swayVelocity.multiplyScalar(Math.max(0, 1 - damping * clampedDt));
    this.sway.addScaledVector(this.swayVelocity, clampedDt);

    const totalLength = top.distanceTo(bottom);
    const sagAmount = Math.min(0.05, totalLength * 0.03);

    for (let i = 0; i <= this.segmentCount; i++) {
      const t = i / this.segmentCount;
      const p = this.points[i];
      p.lerpVectors(top, bottom, t);

      const bellCurve = Math.sin(Math.PI * t); // 0 at ends, 1 at middle
      p.y -= bellCurve * sagAmount;
      p.x += this.sway.x * bellCurve;
      p.z += this.sway.z * bellCurve;
    }
  }
}
