"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useMachineStore, type ClawState } from "@/store/machineStore";

const cycle: Array<[ClawState, number]> = [
  ["descending", 520],
  ["gripping", 420],
  ["ascending", 520],
  ["transporting", 520],
  ["releasing", 420],
  ["returning", 520],
  ["idle", 0],
];

export function VisualFallback() {
  const joystick = useMachineStore((s) => s.joystick);
  const grabToken = useMachineStore((s) => s.grabToken);
  const clawState = useMachineStore((s) => s.clawState);
  const setClawState = useMachineStore((s) => s.setClawState);
  const [pos, setPos] = useState({ x: 0, z: 0 });
  const posRef = useRef(pos);

  useEffect(() => {
    posRef.current = pos;
  }, [pos]);

  useEffect(() => {
    if (clawState !== "idle") return;
    const id = window.setInterval(() => {
      setPos((p) => ({
        x: Math.max(-78, Math.min(78, p.x + joystick.x * 4)),
        z: Math.max(-30, Math.min(30, p.z + joystick.y * 2)),
      }));
    }, 16);
    return () => window.clearInterval(id);
  }, [joystick.x, joystick.y, clawState]);

  useEffect(() => {
    if (grabToken === 0) return;
    setClawState("descending");
    let total = 0;
    const timers = cycle.slice(1).map(([state, delay]) => {
      total += delay;
      return window.setTimeout(() => setClawState(state), total);
    });
    return () => timers.forEach(window.clearTimeout);
  }, [grabToken, setClawState]);

  const isDrop = clawState === "descending" || clawState === "gripping";
  const isCarry = clawState === "ascending" || clawState === "transporting";
  const isRelease = clawState === "releasing";
  const clawX = clawState === "transporting" || clawState === "releasing" ? -84 : clawState === "returning" ? 0 : pos.x;
  const clawDrop = isDrop ? 126 : isCarry ? 46 : isRelease ? 96 : 0;
  const clawClosed = clawState === "gripping" || isCarry;

  return (
    <div className="pointer-events-none fixed inset-0 z-[1] flex items-center justify-center overflow-hidden bg-[#f8f5ef]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,#fff_0%,#faf7f1_35%,#e5ded2_100%)]" />
      <div className="absolute left-1/2 top-[12%] h-[70%] w-[min(760px,92vw)] -translate-x-1/2 rounded-[46px] border border-black/5 bg-white/20 shadow-[0_40px_120px_rgba(30,25,18,.16)]" />

      <div className="relative h-[min(700px,72vh)] min-h-[520px] w-[min(510px,78vw)]">
        <div className="absolute -bottom-8 left-1/2 h-16 w-[115%] -translate-x-1/2 rounded-full bg-black/12 blur-2xl" />

        {/* premium cabinet */}
        <div className="absolute inset-x-0 top-[7%] h-[75%] rounded-[36px] bg-[#151515] shadow-[0_34px_90px_rgba(0,0,0,.28)]" />
        <div className="absolute inset-x-[5%] top-[11%] h-[58%] rounded-[30px] border border-white/55 bg-gradient-to-br from-white/55 via-white/20 to-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,.95)] backdrop-blur-[1px]" />
        <div className="absolute inset-x-[9%] bottom-[18%] h-[17%] rounded-[26px] bg-[#111] shadow-[inset_0_1px_0_rgba(255,255,255,.12)]" />
        <div className="absolute inset-x-[7%] top-[5%] h-[10%] rounded-[28px] bg-[#111] shadow-lg" />
        <div className="absolute left-1/2 top-[8.5%] -translate-x-1/2 font-mono-ui text-[10px] uppercase tracking-[.36em] text-white/70">The Hood Machine</div>

        {/* playfield */}
        <div className="absolute left-[10%] right-[10%] top-[44%] h-[19%] rounded-[50%] bg-black/10 blur-md" />
        <Cat className="left-[22%] top-[52%]" color="#f0cf55" hood="#151515" />
        <Cat className="left-[43%] top-[55%]" color="#7da36d" hood="#2e2e2e" />
        <Cat className="left-[62%] top-[52%]" color="#d67b3d" hood="#151515" />
        <Cat className="left-[33%] top-[60%] scale-90" color="#f0cf55" hood="#151515" />

        {/* claw gantry */}
        <div
          className="absolute left-1/2 top-[17%] h-[44%] w-[130px] -translate-x-1/2 transition-transform duration-300 ease-out"
          style={{ transform: `translateX(calc(-50% + ${clawX}px)) translateY(${pos.z}px)` }}
        >
          <div className="absolute left-1/2 top-0 h-10 w-32 -translate-x-1/2 rounded-2xl bg-gradient-to-b from-[#f1f1ef] to-[#b8bab9] shadow-xl" />
          <div
            className="absolute left-1/2 top-8 w-[3px] -translate-x-1/2 rounded-full bg-[#bfc2c4] transition-all duration-500"
            style={{ height: `${90 + clawDrop}px` }}
          />
          <div
            className="absolute left-1/2 top-[96px] h-24 w-24 -translate-x-1/2 transition-transform duration-500"
            style={{ transform: `translateX(-50%) translateY(${clawDrop}px)` }}
          >
            <div className="absolute left-1/2 top-0 h-12 w-12 -translate-x-1/2 rounded-full bg-gradient-to-br from-[#f1f1ef] to-[#909293] shadow-xl" />
            <div className="absolute left-1/2 top-9 h-16 w-3 -translate-x-1/2 origin-top rounded-full bg-[#252525] transition-transform" style={{ transform: `rotate(${clawClosed ? 0 : 12}deg)` }} />
            <div className="absolute left-[22px] top-10 h-16 w-3 origin-top rounded-full bg-[#252525] transition-transform" style={{ transform: `rotate(${clawClosed ? 18 : 42}deg)` }} />
            <div className="absolute right-[22px] top-10 h-16 w-3 origin-top rounded-full bg-[#252525] transition-transform" style={{ transform: `rotate(${clawClosed ? -18 : -42}deg)` }} />
          </div>
        </div>

        {isCarry && (
          <Cat className="left-1/2 top-[44%] opacity-95 transition-all" color="#f0cf55" hood="#151515" style={{ transform: `translateX(calc(-50% + ${clawX}px)) translateY(${clawDrop + 42}px) scale(.75)` }} />
        )}
      </div>
    </div>
  );
}

function Cat({ className, color, hood, style }: { className: string; color: string; hood: string; style?: CSSProperties }) {
  return (
    <div className={`absolute h-[78px] w-[64px] ${className}`} style={style}>
      <div className="absolute left-1/2 top-6 h-14 w-12 -translate-x-1/2 rounded-[55%] shadow-xl" style={{ background: color }} />
      <div className="absolute left-1/2 top-1 h-14 w-14 -translate-x-1/2 rounded-full shadow-lg" style={{ background: color }} />
      <div className="absolute left-2 top-0 h-7 w-4 -rotate-12 rounded-full" style={{ background: color }} />
      <div className="absolute right-2 top-0 h-7 w-4 rotate-12 rounded-full" style={{ background: color }} />
      <div className="absolute left-2 top-10 h-7 w-12 rounded-full border-[10px] border-solid bg-transparent" style={{ borderColor: hood }} />
      <div className="absolute left-[22px] top-[24px] h-2 w-2 rounded-full bg-[#111]" />
      <div className="absolute right-[22px] top-[24px] h-2 w-2 rounded-full bg-[#111]" />
    </div>
  );
}
