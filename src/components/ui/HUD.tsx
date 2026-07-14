"use client";

import { Logo } from "./Logo";
import { Joystick } from "./Joystick";
import { GrabButton } from "./GrabButton";

/**
 * The only DOM overlay in the experience: logo top-left, joystick + grab
 * button bottom-right. Everything else — navbar, roadmap, tokenomics,
 * wallet connect, charts — is intentionally absent.
 */
export function HUD() {
  return (
    <div className="pointer-events-none fixed inset-0 z-10 flex flex-col justify-between p-6 sm:p-8">
      <div className="pointer-events-auto">
        <Logo />
      </div>

      <div className="pointer-events-auto ml-auto flex items-end gap-6 sm:gap-8">
        <GrabButton />
        <Joystick />
      </div>
    </div>
  );
}
