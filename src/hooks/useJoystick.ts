"use client";

import { useCallback, useRef, useState } from "react";
import { useMachineStore } from "@/store/machineStore";

interface JoystickHandlers {
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerUp: (e: React.PointerEvent) => void;
}

const MAX_RADIUS = 40; // px the knob can travel from center

/**
 * Drives the on-screen joystick knob and writes a normalized -1..1 vector
 * into the machine store. Pointer Events unify mouse + touch handling.
 */
export function useJoystick(): {
  knobOffset: { x: number; y: number };
  active: boolean;
  handlers: JoystickHandlers;
} {
  const [knobOffset, setKnobOffset] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);
  const originRef = useRef({ x: 0, y: 0 });
  const pointerIdRef = useRef<number | null>(null);
  const setJoystick = useMachineStore((s) => s.setJoystick);

  const updateFromPointer = useCallback(
    (clientX: number, clientY: number) => {
      const dx = clientX - originRef.current.x;
      const dy = clientY - originRef.current.y;
      const dist = Math.hypot(dx, dy);
      const clampedDist = Math.min(dist, MAX_RADIUS);
      const angle = Math.atan2(dy, dx);
      const ox = Math.cos(angle) * clampedDist;
      const oy = Math.sin(angle) * clampedDist;
      setKnobOffset({ x: ox, y: oy });
      setJoystick(ox / MAX_RADIUS, oy / MAX_RADIUS);
    },
    [setJoystick]
  );

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    pointerIdRef.current = e.pointerId;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    originRef.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    setActive(true);
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (pointerIdRef.current !== e.pointerId) return;
      updateFromPointer(e.clientX, e.clientY);
    },
    [updateFromPointer]
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (pointerIdRef.current !== e.pointerId) return;
      pointerIdRef.current = null;
      setActive(false);
      setKnobOffset({ x: 0, y: 0 });
      setJoystick(0, 0);
    },
    [setJoystick]
  );

  return { knobOffset, active, handlers: { onPointerDown, onPointerMove, onPointerUp } };
}
