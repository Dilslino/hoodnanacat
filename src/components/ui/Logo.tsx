/**
 * Minimal wordmark, top-left. No nav, no menu — just enough presence to
 * identify the experience without competing with the machine.
 */
export function Logo() {
  return (
    <div className="pointer-events-none select-none font-mono-ui text-[11px] font-medium uppercase tracking-[0.28em] text-[#1B1B1B]/80">
      HoodNanaCat
      <span className="ml-2 text-[#1B1B1B]/35">The Hood Machine</span>
    </div>
  );
}
