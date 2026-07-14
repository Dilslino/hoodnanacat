"use client";

import { motion } from "framer-motion";
import { useMachineStore } from "@/store/machineStore";
import { playButtonClick, unlockAudio } from "@/lib/audioEngine";

/**
 * Brushed-aluminum GRAB button. Physically presses down and settles back
 * with a soft spring on release; disabled (visually recessed + inert)
 * whenever the claw is mid-cycle so a player can't queue up overlapping
 * grabs.
 */
export function GrabButton() {
  const grabEnabled = useMachineStore((s) => s.grabEnabled);
  const requestGrab = useMachineStore((s) => s.requestGrab);

  const handlePress = () => {
    if (!grabEnabled) return;
    unlockAudio();
    playButtonClick();
    requestGrab();
  };

  return (
    <motion.button
      type="button"
      aria-label="Grab"
      disabled={!grabEnabled}
      onPointerDown={handlePress}
      className="no-select relative flex h-20 w-20 select-none items-center justify-center rounded-full font-mono-ui text-[11px] font-medium uppercase tracking-[0.18em]"
      style={{
        background: grabEnabled
          ? "linear-gradient(160deg, #f2f2f0 0%, #d8d9d8 55%, #c2c3c2 100%)"
          : "linear-gradient(160deg, #d9d6cd 0%, #c4c1b8 100%)",
        color: "#1B1B1B",
        boxShadow: grabEnabled
          ? "0 10px 22px rgba(0,0,0,0.22), inset 0 1px 1px rgba(255,255,255,0.7), inset 0 -3px 5px rgba(0,0,0,0.15)"
          : "inset 0 2px 5px rgba(0,0,0,0.25)",
        opacity: grabEnabled ? 1 : 0.55,
      }}
      whileTap={grabEnabled ? { scale: 0.9, y: 2 } : undefined}
      transition={{ type: "spring", stiffness: 500, damping: 22 }}
    >
      GRAB
    </motion.button>
  );
}
