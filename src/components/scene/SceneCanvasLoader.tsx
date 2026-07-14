"use client";

import dynamic from "next/dynamic";

/**
 * Client-only boundary for the R3F canvas. Isolated into its own file so
 * `page.tsx` can stay a server component while still opting the 3D scene
 * out of SSR (WebGL/Web Audio have no meaningful server-rendered output).
 */
export const SceneCanvas = dynamic(() => import("./SceneCanvas").then((m) => m.SceneCanvas), {
  ssr: false,
});
