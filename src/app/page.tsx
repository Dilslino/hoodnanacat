import Image from "next/image";

export default function Home() {
  return (
    <main className="coming-soon-page min-h-dvh overflow-hidden bg-[#080807] text-[#f7f0df]">
      <div className="noise-layer" />
      <div className="orb orb-a" />
      <div className="orb orb-b" />
      <div className="orb orb-c" />

      <section className="relative z-10 flex min-h-svh flex-col items-center justify-center px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(2rem,env(safe-area-inset-top))] text-center sm:min-h-dvh sm:px-8 sm:py-10">
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

        <p className="mb-3 w-full max-w-[92vw] font-mono-ui text-[10px] uppercase tracking-[0.32em] text-[#f7f0df]/58 sm:mb-6 sm:text-[11px] sm:tracking-[0.42em]">
          Claw machine loading soon
        </p>
        <h1 className="hero-title w-full max-w-[min(1150px,92vw)] whitespace-nowrap text-center font-sans text-[clamp(1.85rem,9.2vw,10.5rem)] font-black uppercase leading-[0.84] tracking-[-0.04em] sm:leading-[0.76] sm:tracking-[-0.055em]">
          HoodNanaCat
        </h1>
        <div className="mt-2 w-full max-w-[92vw] text-center font-serif text-[clamp(1.45rem,7.6vw,7.2rem)] italic leading-[0.96] tracking-[-0.03em] text-[#e7c770] sm:mt-1 sm:tracking-[-0.045em]">
          The Hood Machine
        </div>

        <div className="soon-badge mt-7 font-mono-ui text-[clamp(1.85rem,10.5vw,6rem)] font-semibold uppercase tracking-[-0.06em] text-[#080807] sm:mt-12 sm:tracking-[-0.08em]">
          SOON
        </div>

        <p className="mt-6 w-full max-w-[min(620px,86vw)] text-pretty text-sm leading-6 text-[#f7f0df]/66 sm:mt-8 sm:text-base sm:leading-7">
          The machine is under the hood. No tickets yet — just signal, fur, and banana static.
        </p>
      </section>
    </main>
  );
}
