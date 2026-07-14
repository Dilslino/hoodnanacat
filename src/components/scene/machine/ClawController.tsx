"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";
import { ClawHead, type ClawHeadHandle } from "./ClawHead";
import { useMachineStore, type ClawState } from "@/store/machineStore";
import { CABINET, CLAW_BOUNDS } from "@/lib/machineLayout";
import { damp } from "@/lib/mathUtils";

/** Visual-only claw controller: no Rapier/WASM dependency, so the machine is guaranteed visible. */
export function ClawController() {
  const carriageRef = useRef<Group>(null);
  const clawRef = useRef<Group>(null);
  const clawHeadRef = useRef<ClawHeadHandle>(null);
  const joystick = useMachineStore((s) => s.joystick);
  const grabToken = useMachineStore((s) => s.grabToken);
  const clawState = useMachineStore((s) => s.clawState);
  const setClawState = useMachineStore((s) => s.setClawState);
  const targetRef = useRef({ x: 0, z: 0 });

  useEffect(() => {
    if (grabToken === 0) return;
    const steps: Array<[ClawState, number]> = [
      ["descending", 650],
      ["gripping", 420],
      ["ascending", 650],
      ["transporting", 650],
      ["releasing", 420],
      ["returning", 500],
      ["idle", 0],
    ];
    let total = 0;
    const timers = steps.map(([state, delay]) => {
      total += delay;
      return window.setTimeout(() => setClawState(state), total);
    });
    return () => timers.forEach(window.clearTimeout);
  }, [grabToken, setClawState]);

  useFrame((_, delta) => {
    const carriage = carriageRef.current;
    const claw = clawRef.current;
    if (!carriage || !claw) return;

    if (clawState === "idle") {
      targetRef.current.x = Math.max(CLAW_BOUNDS.xMin, Math.min(CLAW_BOUNDS.xMax, targetRef.current.x + joystick.x * delta * 0.9));
      targetRef.current.z = Math.max(CLAW_BOUNDS.zMin, Math.min(CLAW_BOUNDS.zMax, targetRef.current.z + joystick.y * delta * 0.9));
    }

    carriage.position.x = damp(carriage.position.x, targetRef.current.x, 7, delta);
    carriage.position.z = damp(carriage.position.z, targetRef.current.z, 7, delta);

    let drop = 0;
    let grip = 0;
    if (clawState === "descending") drop = 1.15;
    if (clawState === "gripping") { drop = 1.15; grip = 1; }
    if (clawState === "ascending") { drop = 0.45; grip = 1; }
    if (clawState === "transporting") { drop = 0.15; grip = 1; carriage.position.x = damp(carriage.position.x, 0, 5, delta); }
    if (clawState === "releasing") { drop = 0.45; grip = 0; }
    if (clawState === "returning") { targetRef.current.x = 0; targetRef.current.z = 0; }

    claw.position.y = damp(claw.position.y, -drop, 8, delta);
    claw.rotation.y += delta * (clawState === "idle" ? 0.08 : 0.8);
    clawHeadRef.current?.setOpenAmount(grip);
  });

  return (
    <group ref={carriageRef} position={[0, CABINET.height - 0.38, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.34, 0.08, 0.22]} />
        <meshStandardMaterial color="#d9dad9" metalness={0.75} roughness={0.28} />
      </mesh>
      <group ref={clawRef} position={[0, 0, 0]}>
        <mesh position={[0, -0.31, 0]} castShadow>
          <cylinderGeometry args={[0.012, 0.012, 0.62, 10]} />
          <meshStandardMaterial color="#c7c9cb" metalness={0.85} roughness={0.35} />
        </mesh>
        <group position={[0, -0.66, 0]}>
          <ClawHead ref={clawHeadRef} />
        </group>
      </group>
    </group>
  );
}
