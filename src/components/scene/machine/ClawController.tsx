"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RigidBody, useRapier, type RapierRigidBody } from "@react-three/rapier";
import { Group, Vector3 } from "three";
import { ClawHead, type ClawHeadHandle } from "./ClawHead";
import { Cable } from "./Cable";
import { CableSimulation } from "@/lib/rope";
import { CLAW_BOUNDS, CABINET, PRIZE_ZONE } from "@/lib/machineLayout";
import { clamp } from "@/lib/mathUtils";
import { useMachineStore } from "@/store/machineStore";
import { findNearestPlush, setPlushGrabbed } from "@/lib/plushRegistry";
import {
  MotorSound,
  playCableTension,
  playGripLock,
  playGlassTouch,
  playPlushContact,
} from "@/lib/audioEngine";

const TRAVEL_SPEED = 1.15; // units/sec for joystick-driven X/Z travel
const DESCEND_SPEED = 0.85;
const ASCEND_SPEED = 0.7;
const TRANSPORT_SPEED = 0.9;
const GRIP_DURATION = 0.55;
const RELEASE_DURATION = 0.4;
const GRAB_RADIUS = 0.16;

const railTop = new Vector3();
const clawWorldPos = new Vector3();

/**
 * Owns the entire grab cycle. The claw itself is a kinematic rigid body so
 * it can be positioned deterministically by this state machine while still
 * participating in the physics world (the cable and the grabbed plush react
 * to it, but nothing pushes it around). A joint stiffly welds any captured
 * plush toy to the claw hub for the ascend/transport/release phases.
 */
export function ClawController() {
  const clawBodyRef = useRef<RapierRigidBody>(null);
  const clawHeadRef = useRef<ClawHeadHandle>(null);
  const carriageGroupRef = useRef<Group>(null);
  const { rapier, world } = useRapier();

  const cableSim = useMemo(() => new CableSimulation(7), []);
  const motorSound = useMemo(() => new MotorSound(), []);

  const position = useRef(new Vector3(0, CLAW_BOUNDS.yTop, 0));
  const openAmount = useRef(0); // 0 open, 1 closed
  const phaseTimer = useRef(0);
  const grabbedId = useRef<number | null>(null);
  const grabbedJoint = useRef<{ remove: () => void } | null>(null);
  const wasMovingRef = useRef(false);

  const clawState = useMachineStore((s) => s.clawState);
  const setClawState = useMachineStore((s) => s.setClawState);
  const grabToken = useMachineStore((s) => s.grabToken);
  const lastHandledToken = useRef(grabToken);

  useEffect(() => {
    if (grabToken !== lastHandledToken.current) {
      lastHandledToken.current = grabToken;
      if (clawState === "idle") {
        setClawState("descending");
        phaseTimer.current = 0;
      }
    }
  }, [grabToken, clawState, setClawState]);

  useEffect(() => {
    cableSim.reset(new Vector3(0, CABINET.railY, 0), new Vector3(0, CLAW_BOUNDS.yTop, 0));
    return () => motorSound.stop();
  }, [cableSim, motorSound]);

  const releaseGrabbedJoint = () => {
    if (grabbedJoint.current) {
      grabbedJoint.current.remove();
      grabbedJoint.current = null;
    }
    if (grabbedId.current !== null) {
      setPlushGrabbed(grabbedId.current, false);
      grabbedId.current = null;
    }
  };

  useFrame((frameState, rawDelta) => {
    const delta = Math.min(rawDelta, 1 / 30);
    const body = clawBodyRef.current;
    if (!body) return;

    const { joystick } = useMachineStore.getState();
    const joyMagnitude = Math.hypot(joystick.x, joystick.y);
    const isTraveling = clawState === "idle" && joyMagnitude > 0.02;

    // --- Horizontal travel (idle state only, joystick-driven) ---
    if (clawState === "idle") {
      const targetX = clamp(
        position.current.x + joystick.x * TRAVEL_SPEED * delta,
        CLAW_BOUNDS.xMin,
        CLAW_BOUNDS.xMax
      );
      const targetZ = clamp(
        position.current.z + joystick.y * TRAVEL_SPEED * delta,
        CLAW_BOUNDS.zMin,
        CLAW_BOUNDS.zMax
      );
      position.current.x = targetX;
      position.current.z = targetZ;
    }

    // --- State machine ---
    phaseTimer.current += delta;

    switch (clawState) {
      case "descending": {
        position.current.y = Math.max(position.current.y - DESCEND_SPEED * delta, CLAW_BOUNDS.yBottom);
        if (position.current.y <= CLAW_BOUNDS.yBottom + 0.001) {
          setClawState("gripping");
          phaseTimer.current = 0;
        }
        break;
      }
      case "gripping": {
        const t = clamp(phaseTimer.current / GRIP_DURATION, 0, 1);
        openAmount.current = t;
        if (phaseTimer.current >= GRIP_DURATION) {
          clawWorldPos.set(position.current.x, position.current.y, position.current.z);
          const target = findNearestPlush(clawWorldPos, GRAB_RADIUS);
          if (target) {
            setPlushGrabbed(target.id, true);
            grabbedId.current = target.id;
            const joint = world.createImpulseJoint(
              rapier.JointData.fixed(
                { x: 0, y: -0.05, z: 0 },
                { w: 1, x: 0, y: 0, z: 0 },
                { x: 0, y: 0, z: 0 },
                { w: 1, x: 0, y: 0, z: 0 }
              ),
              body,
              target.api,
              true
            );
            grabbedJoint.current = {
              remove: () => world.removeImpulseJoint(joint, true),
            };
            playGripLock();
          }
          setClawState("ascending");
          phaseTimer.current = 0;
        }
        break;
      }
      case "ascending": {
        position.current.y = Math.min(position.current.y + ASCEND_SPEED * delta, CLAW_BOUNDS.yTop);
        if (position.current.y >= CLAW_BOUNDS.yTop - 0.001) {
          setClawState("transporting");
          phaseTimer.current = 0;
          playCableTension();
        }
        break;
      }
      case "transporting": {
        const dx = PRIZE_ZONE.chute.x - position.current.x;
        const dz = PRIZE_ZONE.chute.z - position.current.z;
        const dist = Math.hypot(dx, dz);
        if (dist < 0.02) {
          setClawState("releasing");
          phaseTimer.current = 0;
        } else {
          const step = Math.min(TRANSPORT_SPEED * delta, dist);
          position.current.x += (dx / dist) * step;
          position.current.z += (dz / dist) * step;
        }
        break;
      }
      case "releasing": {
        const t = clamp(phaseTimer.current / RELEASE_DURATION, 0, 1);
        openAmount.current = 1 - t;
        if (phaseTimer.current >= RELEASE_DURATION) {
          releaseGrabbedJoint();
          setClawState("returning");
          phaseTimer.current = 0;
        }
        break;
      }
      case "returning": {
        const dx = 0 - position.current.x;
        const dz = 0 - position.current.z;
        const dist = Math.hypot(dx, dz);
        if (dist < 0.02) {
          setClawState("idle");
          phaseTimer.current = 0;
        } else {
          const step = Math.min(TRAVEL_SPEED * delta, dist);
          position.current.x += (dx / dist) * step;
          position.current.z += (dz / dist) * step;
        }
        break;
      }
      default:
        break;
    }

    // --- Apply kinematic transform ---
    body.setNextKinematicTranslation({ x: position.current.x, y: position.current.y, z: position.current.z });
    if (carriageGroupRef.current) {
      carriageGroupRef.current.position.set(position.current.x, 0, position.current.z);
    }
    clawHeadRef.current?.setOpenAmount(openAmount.current);

    // --- Cable simulation: top anchor follows carriage under the rail, bottom follows claw ---
    railTop.set(position.current.x, CABINET.railY, position.current.z);
    cableSim.update(railTop, position.current, delta);

    // --- Motor sound: active while traveling or in a powered phase ---
    const isPowered = clawState !== "idle" || isTraveling;
    if (isPowered && !wasMovingRef.current) {
      motorSound.start();
      wasMovingRef.current = true;
    } else if (!isPowered && wasMovingRef.current) {
      motorSound.stop();
      wasMovingRef.current = false;
    }
    if (isPowered) {
      const intensity = clawState === "idle" ? joyMagnitude : 0.7;
      motorSound.setIntensity(intensity);
    }

    // Subtle glass-touch cue when the claw nears the enclosure walls while traveling.
    if (isTraveling) {
      const nearEdge =
        Math.abs(position.current.x - CLAW_BOUNDS.xMax) < 0.03 ||
        Math.abs(position.current.x - CLAW_BOUNDS.xMin) < 0.03 ||
        Math.abs(position.current.z - CLAW_BOUNDS.zMax) < 0.03 ||
        Math.abs(position.current.z - CLAW_BOUNDS.zMin) < 0.03;
      if (nearEdge && frameState.clock.elapsedTime % 1 < delta) {
        playGlassTouch();
      }
    }

    // Contact cue right as the claw reaches the pile bottom.
    if (clawState === "gripping" && phaseTimer.current < delta * 2) {
      playPlushContact();
    }
  });

  return (
    <group>
      <RigidBody
        ref={clawBodyRef}
        type="kinematicPosition"
        colliders={false}
        position={[0, CLAW_BOUNDS.yTop, 0]}
      >
        <ClawHead ref={clawHeadRef} />
      </RigidBody>
      <Cable simulation={cableSim} />
      {/* Carriage visual: the small housing that rides the rail, purely cosmetic */}
      <group ref={carriageGroupRef} position={[0, 0, 0]}>
        <mesh position={[0, CABINET.railY, 0]} castShadow>
          <boxGeometry args={[0.12, 0.06, 0.12]} />
          <meshStandardMaterial color="#3d3e40" metalness={0.7} roughness={0.4} />
        </mesh>
      </group>
    </group>
  );
}
