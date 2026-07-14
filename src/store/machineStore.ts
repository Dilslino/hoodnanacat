import { create } from "zustand";

export type ClawState =
  | "idle"
  | "descending"
  | "gripping"
  | "ascending"
  | "transporting"
  | "releasing"
  | "returning";

interface MachineState {
  /** Normalized joystick vector, -1..1 on each axis. Updated at pointer rate, not every frame. */
  joystick: { x: number; y: number };
  clawState: ClawState;
  /** Monotonic counter — incrementing it signals the scene to start a grab cycle. */
  grabToken: number;
  /** Whether the grab button accepts input right now (mirrors clawState === 'idle'). */
  grabEnabled: boolean;
  setJoystick: (x: number, y: number) => void;
  requestGrab: () => void;
  setClawState: (state: ClawState) => void;
}

export const useMachineStore = create<MachineState>((set) => ({
  joystick: { x: 0, y: 0 },
  clawState: "idle",
  grabToken: 0,
  grabEnabled: true,
  setJoystick: (x, y) => set({ joystick: { x, y } }),
  requestGrab: () =>
    set((s) => (s.clawState === "idle" ? { grabToken: s.grabToken + 1 } : s)),
  setClawState: (state) =>
    set({ clawState: state, grabEnabled: state === "idle" }),
}));
