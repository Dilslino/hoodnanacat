import Image from "next/image";

export default function Home() {
  return (
    <main className="coming-soon-page min-h-dvh overflow-hidden bg-[#080807] text-[#f7f0df]">
      <div className="noise-layer" />
      <div className="orb orb-a" />
      <div className="orb orb-b" />
      <div className="orb orb-c" />

      <section className="relative z-10 flex min-h-svh flex-col items-center justify-center px-4 py-[max(2rem,env(safe-area-inset-top))] text-center sm:min-h-dvh sm:px-8 sm:py-10">
        <div className="art-stage" aria-hidden="true">
          <div className="art-ring ring-one" />
          <div className="art-ring ring-two" />
          <div className="image-orbit image-orbit-a">
            <Image
              src="/gambarnanacat.jpg"
              alt=""
              width={360}
              height={360}
              priority
              className="h-full w-full object-cover"
            />
          </div>
          <div className="image-orbit image-orbit-b">
            <Image
              src="/gambarnanacat.jpg"
              alt=""
              width={260}
              height={260}
              priority
              className="h-full w-full object-cover"
            />
          </div>
          <div className="image-orbit image-orbit-c">
            <Image
              src="/gambarnanacat.jpg"
              alt=""
              width={180}
              height={180}
              priority
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <p className="mb-4 max-w-[92vw] font-mono-ui text-[10px] uppercase tracking-[0.32em] text-[#f7f0df]/58 sm:mb-6 sm:text-[11px] sm:tracking-[0.42em]">
          Claw machine loading soon
        </p>
        <h1 className="hero-title max-w-[min(1150px,94vw)] text-balance font-sans text-[clamp(3.05rem,16vw,10.5rem)] font-black uppercase leading-[0.79] tracking-[-0.045em] sm:leading-[0.76] sm:tracking-[-0.055em]">
          HoodNanaCat
        </h1>
        <div className="mt-3 max-w-[94vw] text-balance font-serif text-[clamp(2.15rem,10vw,7.2rem)] italic leading-[0.92] tracking-[-0.035em] text-[#e7c770] sm:mt-1 sm:tracking-[-0.045em]">
          The Hood Machine
        </div>

        <div className="soon-badge mt-8 font-mono-ui text-[clamp(2.2rem,13vw,6rem)] font-semibold uppercase tracking-[-0.075em] text-[#080807] sm:mt-12 sm:tracking-[-0.08em]">
          SOON
        </div>

        <p className="mt-7 max-w-[min(620px,88vw)] text-pretty text-sm leading-6 text-[#f7f0df]/66 sm:mt-8 sm:text-base sm:leading-7">
          The machine is under the hood. No tickets yet — just signal, fur, and banana static.
        </p>
      </section>
    </main>
  );
}
