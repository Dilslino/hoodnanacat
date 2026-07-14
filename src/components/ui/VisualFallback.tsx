export function VisualFallback() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[1] flex items-center justify-center bg-[#f8f5ef]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(255,255,255,0.95),rgba(248,245,239,0.25)_34%,rgba(229,220,205,0.75)_100%)]" />
      <div className="absolute bottom-[18%] h-[18%] w-[78%] rounded-[50%] bg-black/10 blur-2xl" />
      <div className="relative h-[62vh] min-h-[430px] w-[min(68vw,430px)]">
        <div className="absolute inset-x-[3%] top-0 h-[10%] rounded-[26px] bg-[#111] shadow-[0_22px_60px_rgba(0,0,0,.22)]" />
        <div className="absolute inset-x-0 top-[8%] h-[72%] rounded-[34px] border border-black/10 bg-white/28 shadow-[inset_0_1px_0_rgba(255,255,255,.9),0_30px_80px_rgba(0,0,0,.18)] backdrop-blur-[2px]" />
        <div className="absolute inset-x-[8%] top-[18%] h-[52%] rounded-[24px] border border-white/60 bg-gradient-to-br from-white/45 via-white/12 to-black/5" />
        <div className="absolute left-1/2 top-[15%] h-[7%] w-[28%] -translate-x-1/2 rounded-xl bg-[#d9d9d7] shadow-lg" />
        <div className="absolute left-1/2 top-[20%] h-[30%] w-[3px] -translate-x-1/2 rounded-full bg-[#babec2]" />
        <div className="absolute left-1/2 top-[49%] h-[42px] w-[42px] -translate-x-1/2 rounded-full bg-gradient-to-br from-[#f0f0ee] to-[#9b9c9d] shadow-xl" />
        <div className="absolute left-1/2 top-[56%] h-[72px] w-[92px] -translate-x-1/2">
          <div className="absolute left-1/2 top-0 h-[62px] w-[12px] -translate-x-1/2 origin-top rotate-0 rounded-full bg-[#303030]" />
          <div className="absolute left-[20%] top-2 h-[58px] w-[10px] origin-top rotate-[28deg] rounded-full bg-[#303030]" />
          <div className="absolute right-[20%] top-2 h-[58px] w-[10px] origin-top rotate-[-28deg] rounded-full bg-[#303030]" />
        </div>
        <div className="absolute inset-x-[3%] bottom-[9%] h-[21%] rounded-[28px] bg-[#121212] shadow-[0_24px_60px_rgba(0,0,0,.28)]" />
        <div className="absolute left-[18%] bottom-[24%] h-[70px] w-[58px] rounded-[60%] bg-[#f0cf55] shadow-xl before:absolute before:left-[10px] before:top-[-18px] before:h-[28px] before:w-[18px] before:rotate-[-20deg] before:rounded-full before:bg-[#f0cf55] after:absolute after:right-[10px] after:top-[-18px] after:h-[28px] after:w-[18px] after:rotate-[20deg] after:rounded-full after:bg-[#f0cf55]" />
        <div className="absolute left-[42%] bottom-[22%] h-[74px] w-[62px] rounded-[60%] bg-[#7da36d] shadow-xl before:absolute before:left-[11px] before:top-[-18px] before:h-[30px] before:w-[18px] before:rotate-[-20deg] before:rounded-full before:bg-[#7da36d] after:absolute after:right-[11px] after:top-[-18px] after:h-[30px] after:w-[18px] after:rotate-[20deg] after:rounded-full after:bg-[#7da36d]" />
        <div className="absolute right-[17%] bottom-[25%] h-[64px] w-[54px] rounded-[60%] bg-[#d67b3d] shadow-xl before:absolute before:left-[9px] before:top-[-16px] before:h-[26px] before:w-[16px] before:rotate-[-20deg] before:rounded-full before:bg-[#d67b3d] after:absolute after:right-[9px] after:top-[-16px] after:h-[26px] after:w-[16px] after:rotate-[20deg] after:rounded-full after:bg-[#d67b3d]" />
      </div>
    </div>
  );
}
