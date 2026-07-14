"use client";

import { useJoystick } from "@/hooks/useJoystick";
import { unlockAudio } from "@/lib/audioEngine";

/**
 * Physical-feeling joystick: a recessed brushed-aluminum base with a
 * matte-plastic knob that translates toward the pointer, clamped to a
 * circular radius, and springs back to center on release.
 */
export function Joystick() {
  const { knobOffset, active, handlers } = useJoystick();

  return (
    <div
      className="no-select relative h-28 w-28 select-none rounded-full"
      style={{
        background:
          "radial-gradient(circle at 32% 28%, #e9e6df 0%, #cfccc3 55%, #b7b4ab 100%)",
        boxShadow:
          "inset 0 2px 6px rgba(0,0,0,0.25), inset 0 -2px 4px rgba(255,255,255,0.5), 0 8px 20px rgba(0,0,0,0.18)",
      }}
      onPointerDown={(e) => {
        unlockAudio();
        handlers.onPointerDown(e);
      }}
      onPointerMove={handlers.onPointerMove}
      onPointerUp={handlers.onPointerUp}
      onPointerCancel={handlers.onPointerUp}
      role="application"
      aria-label="Claw movement joystick"
    >
      <div
        className="absolute left-1/2 top-1/2 h-16 w-16 rounded-full"
        style={{
          transform: `translate(-50%, -50%) translate(${knobOffset.x}px, ${knobOffset.y}px)`,
          transition: active ? "none" : "transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
          background: "linear-gradient(155deg, #2a2a2a 0%, #1b1b1b 60%, #101010 100%)",
          boxShadow:
            "0 4px 10px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.12), inset 0 -2px 3px rgba(0,0,0,0.5)",
        }}
      >
        <div
          className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "#F3D35B", boxShadow: "0 0 6px rgba(243,211,91,0.6)" }}
        />
      </div>
    </div>
  );
}
