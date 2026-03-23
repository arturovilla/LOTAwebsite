import Image from "next/image";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-hero"
    >
      <div className="relative z-10 text-center px-6 pt-16 pb-32 md:pb-16 max-w-4xl mx-auto">
        <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold text-white tracking-tight animate-fade-in-up">
          LOTA
        </h1>
        <p className="text-xl sm:text-2xl text-orange-400 font-medium mt-3 animate-fade-in-up-delay">
          LiDAR Over the Air
        </p>
        <p className="text-base sm:text-lg text-zinc-400 mt-6 max-w-xl mx-auto leading-relaxed animate-fade-in-up-delay-2">
          Capture, stream, and export 3D spatial data from your iPhone&apos;s
          LiDAR sensor. Color, depth, point clouds, and Gaussian splats — all
          in real time.
        </p>
        <div className="mt-8 animate-fade-in-up-delay-2">
          <a
            href="#"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-black rounded-full font-semibold text-sm hover:bg-zinc-200 transition-colors"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            Download on the App Store
          </a>
        </div>
      </div>

      {/* Phone mockups */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-end gap-4 md:gap-8 pointer-events-none">
        <div className="animate-float hidden sm:block">
          <Image
            src="/LOATAAssests1.jpg"
            alt="LOTA color capture mode"
            width={220}
            height={440}
            className="rounded-2xl shadow-2xl shadow-orange-500/10 -mb-16 md:-mb-24"
            preload
          />
        </div>
        <div className="animate-float-delay">
          <Image
            src="/LOATAAssests3.jpg"
            alt="LOTA depth map visualization"
            width={220}
            height={440}
            className="rounded-2xl shadow-2xl shadow-orange-500/10 -mb-8 md:-mb-12"
            preload
          />
        </div>
      </div>
    </section>
  );
}
