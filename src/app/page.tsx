import Image from "next/image";

export default function Home() {
  return (
    <main className="coming-soon-page min-h-dvh overflow-hidden bg-[#080807] text-[#f7f0df]">
      <div className="noise-layer" />
      <div className="orb orb-a" />
      <div className="orb orb-b" />
      <div className="orb orb-c" />

      <section className="relative z-10 flex min-h-dvh flex-col items-center justify-center px-5 py-10 text-center sm:px-8">
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

        <p className="mb-5 font-mono-ui text-[11px] uppercase tracking-[0.42em] text-[#f7f0df]/58 sm:mb-6">
          Claw machine loading soon
        </p>
        <h1 className="hero-title max-w-[1150px] text-balance font-sans text-[clamp(3.9rem,13vw,10.5rem)] font-black uppercase leading-[0.76] tracking-[-0.055em]">
          HoodNanaCat
        </h1>
        <div className="mt-3 text-balance font-serif text-[clamp(2.6rem,8vw,7.2rem)] italic leading-[0.9] tracking-[-0.045em] text-[#e7c770] sm:mt-1">
          The Hood Machine
        </div>

        <div className="soon-badge mt-10 font-mono-ui text-[clamp(2rem,7vw,6rem)] font-semibold uppercase tracking-[-0.08em] text-[#080807] sm:mt-12">
          SOON
        </div>

        <p className="mt-8 max-w-[620px] text-pretty text-sm leading-7 text-[#f7f0df]/64 sm:text-base">
          The machine is under the hood. No tickets yet — just signal, fur, and banana static.
        </p>
      </section>
    </main>
  );
}
