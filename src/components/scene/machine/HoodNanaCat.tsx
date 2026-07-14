"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group, MeshPhysicalMaterial } from "three";
import { randomRange } from "@/lib/mathUtils";

export type PlushBehavior = "idle" | "sleeping" | "stretching" | "lookAround" | "rolling";

interface HoodNanaCatProps {
  id: number;
  position: [number, number, number];
  rotationY: number;
  variant: number;
}

const BODY_COLORS = ["#f3d35b", "#7da36d", "#d67b3d"];
const HOOD_COLORS = ["#1b1b1b", "#3a3a3a", "#1b1b1b"];

/**
 * A premium plush interpretation of the HoodNanaCat mascot: rounded capsule
 * body in soft banana-yellow / forest-green / orange fabric, a hood, round
 * ears with an occasional twitch, a curled tail, and a plush banana prop.
 * Idle behaviors (breathing, blinking, ear twitch, tail sway, occasional
 * look-around/stretch/sleep) are randomized per-instance so a pile of these
 * never look like they're animating in sync.
 */
export function HoodNanaCat({ id, position, rotationY, variant }: HoodNanaCatProps) {
  const groupRef = useRef<Group>(null);
  const leftEarRef = useRef<Group>(null);
  const rightEarRef = useRef<Group>(null);
  const tailRef = useRef<Group>(null);
  const leftEyeRef = useRef<Group>(null);
  const rightEyeRef = useRef<Group>(null);
  const headRef = useRef<Group>(null);

  const phase = useMemo(
    () => ({
      breathe: randomRange(0, Math.PI * 2),
      breatheSpeed: randomRange(0.9, 1.3),
      blinkAt: randomRange(2, 6),
      nextBlinkGap: randomRange(3, 7),
      tailAt: randomRange(0, Math.PI * 2),
      earTwitchAt: randomRange(2, 8),
      lookAt: randomRange(4, 10),
    }),
    []
  );

  const elapsedRef = useRef(0);
  const blinkTimerRef = useRef(0);
  const earTwitchTimerRef = useRef(0);
  const lookTimerRef = useRef(0);

  const bodyColor = BODY_COLORS[variant % BODY_COLORS.length];
  const hoodColor = HOOD_COLORS[variant % HOOD_COLORS.length];

  const bodyMaterial = useMemo(
    () =>
      new MeshPhysicalMaterial({
        color: bodyColor,
        roughness: 0.92,
        metalness: 0,
        sheen: 1,
        sheenColor: "#ffffff",
        sheenRoughness: 0.8,
      }),
    [bodyColor]
  );

  useFrame((_, delta) => {
    elapsedRef.current += delta;
    const t = elapsedRef.current;

    // Breathing — subtle vertical scale pulse on the body.
    const breathe = 1 + Math.sin(t * phase.breatheSpeed + phase.breathe) * 0.02;
    if (groupRef.current) {
      groupRef.current.scale.y = breathe;
    }

    // Tail sway.
    if (tailRef.current) {
      tailRef.current.rotation.z = Math.sin(t * 0.8 + phase.tailAt) * 0.25;
    }

    // Blinking.
    blinkTimerRef.current += delta;
    if (blinkTimerRef.current > phase.nextBlinkGap) {
      blinkTimerRef.current = -0.12; // brief closed duration
      phase.nextBlinkGap = randomRange(3, 7);
    }
    const eyeScaleY = blinkTimerRef.current < 0 ? 0.1 : 1;
    if (leftEyeRef.current) leftEyeRef.current.scale.y = eyeScaleY;
    if (rightEyeRef.current) rightEyeRef.current.scale.y = eyeScaleY;

    // Ear twitch.
    earTwitchTimerRef.current += delta;
    if (earTwitchTimerRef.current > phase.earTwitchAt) {
      earTwitchTimerRef.current = -0.18;
      phase.earTwitchAt = randomRange(4, 9);
    }
    const earTwitch = earTwitchTimerRef.current < 0 ? Math.sin(earTwitchTimerRef.current * 40) * 0.3 : 0;
    if (leftEarRef.current) leftEarRef.current.rotation.z = 0.15 + earTwitch;
    if (rightEarRef.current) rightEarRef.current.rotation.z = -0.15 - earTwitch;

    // Occasional look-around: head yaw drifts to a target and back.
    lookTimerRef.current += delta;
    if (lookTimerRef.current > phase.lookAt) {
      lookTimerRef.current = -1.4;
      phase.lookAt = randomRange(5, 11);
    }
    if (headRef.current) {
      const lookProgress = lookTimerRef.current < 0 ? Math.sin((lookTimerRef.current / -1.4) * Math.PI) : 0;
      headRef.current.rotation.y = lookProgress * 0.5;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={[0, rotationY, 0]}>
        {/* Body */}
        <mesh castShadow receiveShadow position={[0, 0.13, 0]}>
          <capsuleGeometry args={[0.11, 0.1, 6, 12]} />
          <primitive object={bodyMaterial} attach="material" />
        </mesh>

        {/* Hood shoulders */}
        <mesh castShadow position={[0, 0.2, 0]}>
          <torusGeometry args={[0.1, 0.045, 8, 16]} />
          <meshStandardMaterial color={hoodColor} roughness={0.9} />
        </mesh>

        {/* Head */}
        <group ref={headRef} position={[0, 0.26, 0]}>
          <mesh castShadow receiveShadow>
            <sphereGeometry args={[0.1, 20, 20]} />
            <primitive object={bodyMaterial} attach="material" />
          </mesh>

          {/* Ears */}
          <group ref={leftEarRef} position={[-0.07, 0.09, 0]}>
            <mesh castShadow>
              <coneGeometry args={[0.035, 0.09, 12]} />
              <primitive object={bodyMaterial} attach="material" />
            </mesh>
          </group>
          <group ref={rightEarRef} position={[0.07, 0.09, 0]}>
            <mesh castShadow>
              <coneGeometry args={[0.035, 0.09, 12]} />
              <primitive object={bodyMaterial} attach="material" />
            </mesh>
          </group>

          {/* Eyes */}
          <group ref={leftEyeRef} position={[-0.035, 0.01, 0.09]}>
            <mesh>
              <sphereGeometry args={[0.014, 10, 10]} />
              <meshStandardMaterial color="#1b1b1b" roughness={0.4} />
            </mesh>
          </group>
          <group ref={rightEyeRef} position={[0.035, 0.01, 0.09]}>
            <mesh>
              <sphereGeometry args={[0.014, 10, 10]} />
              <meshStandardMaterial color="#1b1b1b" roughness={0.4} />
            </mesh>
          </group>

          {/* Nose */}
          <mesh position={[0, -0.02, 0.098]}>
            <sphereGeometry args={[0.009, 8, 8]} />
            <meshStandardMaterial color="#d67b3d" roughness={0.6} />
          </mesh>
        </group>

        {/* Tail */}
        <group ref={tailRef} position={[0, 0.08, -0.11]}>
          <mesh castShadow rotation={[0.6, 0, 0]}>
            <capsuleGeometry args={[0.02, 0.1, 4, 8]} />
            <primitive object={bodyMaterial} attach="material" />
          </mesh>
        </group>

        {/* Banana prop, held against the body */}
        <mesh castShadow position={[0.08, 0.14, 0.07]} rotation={[0.3, 0.4, 0.9]}>
          <capsuleGeometry args={[0.016, 0.08, 4, 8]} />
          <meshStandardMaterial color="#f3d35b" roughness={0.7} />
        </mesh>
    </group>
  );
}
