"use client";

/**
 * Lightweight synthesized SFX engine built on the Web Audio API.
 *
 * We intentionally avoid shipping audio asset files — every effect here is
 * generated procedurally (noise buffers + oscillators + envelopes). This
 * keeps the bundle tiny, avoids licensing concerns, and lets us tune the
 * "premium hardware" character of each sound directly in code.
 */

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let noiseBuffer: AudioBuffer | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.55;
    masterGain.connect(ctx.destination);
  }
  return ctx;
}

function getNoiseBuffer(context: AudioContext): AudioBuffer {
  if (!noiseBuffer) {
    const length = context.sampleRate * 2;
    noiseBuffer = context.createBuffer(1, length, context.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
  }
  return noiseBuffer;
}

/** Must be called from a user gesture (pointerdown/click) to unlock audio on mobile Safari/iOS. */
export function unlockAudio() {
  const c = getContext();
  if (c && c.state === "suspended") {
    void c.resume();
  }
}

function envGain(context: AudioContext, destination: AudioNode, attack: number, decay: number, peak: number, delay = 0) {
  const gain = context.createGain();
  const t0 = context.currentTime + delay;
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(peak, t0 + attack);
  gain.gain.exponentialRampToValueAtTime(Math.max(peak * 0.001, 0.0001), t0 + attack + decay);
  gain.connect(destination);
  return { gain, t0 };
}

/** Soft mechanical button click, like a premium aluminum key switch. */
export function playButtonClick() {
  const c = getContext();
  if (!c || !masterGain) return;
  const osc = c.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(720, c.currentTime);
  osc.frequency.exponentialRampToValueAtTime(180, c.currentTime + 0.05);

  const { gain, t0 } = envGain(c, masterGain, 0.002, 0.08, 0.5);
  osc.connect(gain);
  osc.start(t0);
  osc.stop(t0 + 0.15);

  // A short noise transient for the "click" edge.
  const noise = c.createBufferSource();
  noise.buffer = getNoiseBuffer(c);
  const filter = c.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = 3000;
  const { gain: ngain, t0: nt0 } = envGain(c, filter, 0.001, 0.02, 0.35);
  noise.connect(filter);
  filter.connect(ngain);
  ngain.connect(masterGain);
  noise.start(nt0);
  noise.stop(nt0 + 0.04);
}

/** Continuous servo/motor hum — call start/stop around joystick movement or claw travel. */
export class MotorSound {
  private osc: OscillatorNode | null = null;
  private gain: GainNode | null = null;
  private filter: BiquadFilterNode | null = null;

  start(baseFreq = 90) {
    const c = getContext();
    if (!c || !masterGain) return;
    this.stop();
    this.osc = c.createOscillator();
    this.osc.type = "sawtooth";
    this.osc.frequency.value = baseFreq;
    this.filter = c.createBiquadFilter();
    this.filter.type = "lowpass";
    this.filter.frequency.value = 320;
    this.gain = c.createGain();
    this.gain.gain.value = 0;
    this.osc.connect(this.filter);
    this.filter.connect(this.gain);
    this.gain.connect(masterGain);
    this.osc.start();
    this.gain.gain.linearRampToValueAtTime(0.06, c.currentTime + 0.12);
  }

  setIntensity(intensity: number) {
    const c = getContext();
    if (!c || !this.gain || !this.osc) return;
    const clamped = Math.min(1, Math.max(0, intensity));
    this.gain.gain.linearRampToValueAtTime(0.02 + clamped * 0.08, c.currentTime + 0.08);
    this.osc.frequency.linearRampToValueAtTime(80 + clamped * 60, c.currentTime + 0.08);
  }

  stop() {
    const c = getContext();
    if (c && this.gain) {
      this.gain.gain.cancelScheduledValues(c.currentTime);
      this.gain.gain.linearRampToValueAtTime(0, c.currentTime + 0.15);
    }
    const osc = this.osc;
    const t = c ? c.currentTime + 0.2 : 0;
    if (osc) {
      try {
        osc.stop(t);
      } catch {
        /* already stopped */
      }
    }
    this.osc = null;
    this.gain = null;
    this.filter = null;
  }
}

/** Metallic cable-tension tick, used when the rope pulls taut. */
export function playCableTension() {
  const c = getContext();
  if (!c || !masterGain) return;
  const osc = c.createOscillator();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(1400, c.currentTime);
  osc.frequency.exponentialRampToValueAtTime(900, c.currentTime + 0.1);
  const { gain, t0 } = envGain(c, masterGain, 0.001, 0.12, 0.18);
  osc.connect(gain);
  osc.start(t0);
  osc.stop(t0 + 0.2);
}

/** Soft glass vibration when the claw or plush brushes the enclosure. */
export function playGlassTouch() {
  const c = getContext();
  if (!c || !masterGain) return;
  const osc = c.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(2200, c.currentTime);
  const { gain, t0 } = envGain(c, masterGain, 0.001, 0.25, 0.06);
  osc.connect(gain);
  osc.start(t0);
  osc.stop(t0 + 0.3);
}

/** Soft muted thud when the claw makes contact with a plush toy. */
export function playPlushContact() {
  const c = getContext();
  if (!c || !masterGain) return;
  const noise = c.createBufferSource();
  noise.buffer = getNoiseBuffer(c);
  const filter = c.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 500;
  const { gain, t0 } = envGain(c, filter, 0.002, 0.14, 0.4);
  noise.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);
  noise.start(t0);
  noise.stop(t0 + 0.2);
}

/** Gentle mechanical settle when the claw fully closes around its target. */
export function playGripLock() {
  const c = getContext();
  if (!c || !masterGain) return;
  const osc = c.createOscillator();
  osc.type = "square";
  osc.frequency.setValueAtTime(220, c.currentTime);
  osc.frequency.exponentialRampToValueAtTime(140, c.currentTime + 0.08);
  const { gain, t0 } = envGain(c, masterGain, 0.001, 0.1, 0.12);
  osc.connect(gain);
  osc.start(t0);
  osc.stop(t0 + 0.15);
}
