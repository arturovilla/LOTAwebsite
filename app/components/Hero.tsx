/* eslint-disable @next/next/no-img-element */

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-hero"
    >
      <div className="relative z-10 text-center px-6 pt-24 pb-48 sm:pb-56 max-w-3xl mx-auto">
        {/* Logo */}
        <div className="flex justify-center mb-8 animate-fade-in-up">
          <img
            src="https://pub-42e3bdd794c24301bd74d193c44417c6.r2.dev/LOTA-dark.jpg"
            alt="LOTA app icon"
            width={96}
            height={96}
            className="rounded-[22px] shadow-2xl shadow-purple-500/10"
          />
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight animate-fade-in-up-delay">
          LiDAR Over the Air
        </h1>

        <p className="text-lg sm:text-xl text-zinc-400 mt-6 max-w-2xl mx-auto leading-relaxed animate-fade-in-up-delay-2">
          Turn your iPhone into a professional spatial capture tool.
          Stream depth, color, and point cloud data over the network in real time —
          no expensive hardware required.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 animate-fade-in-up-delay-3">
          <span
            className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-white/10 text-white border border-white/[0.15] rounded-full font-semibold text-sm cursor-default"
          >
            Coming Soon on the App Store
          </span>
          <a
            href="#features"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/[0.12] text-zinc-300 text-sm font-medium hover:bg-white/[0.06] transition-colors"
          >
            See what it does
          </a>
        </div>
      </div>

      {/* Phone mockups */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-end gap-6 md:gap-10 pointer-events-none">
        <div className="animate-float hidden sm:block -mb-20 md:-mb-28">
          <img
            src="https://pub-42e3bdd794c24301bd74d193c44417c6.r2.dev/colormode.webp"
            alt="LOTA color capture mode"
            width={200}
            height={430}
            className="rounded-[2rem] drop-shadow-2xl"
          />
        </div>
        <div className="animate-float-delay -mb-10 md:-mb-16">
          <img
            src="https://pub-42e3bdd794c24301bd74d193c44417c6.r2.dev/depthmode.webp"
            alt="LOTA depth map visualization"
            width={220}
            height={470}
            className="rounded-[2rem] drop-shadow-2xl"
          />
        </div>
        <div className="animate-float hidden md:block -mb-24 md:-mb-32">
          <img
            src="https://pub-42e3bdd794c24301bd74d193c44417c6.r2.dev/pointcloudmode.webp"
            alt="LOTA point cloud mode"
            width={200}
            height={430}
            className="rounded-[2rem] drop-shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}
