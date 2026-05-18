/* eslint-disable @next/next/no-img-element */

import { FaApple } from "react-icons/fa";
import HeroPointCloud from "./HeroPointCloud";
import { BETA_URL } from "../config";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-hero"
    >
      {/* Animated point cloud background. Layered behind the centered
          content via z-index. The CSS gradient stays in place underneath
          so the section has a sensible look while the 15 MB PLY loads. */}
      <HeroPointCloud />

      {/* Top vignette: keeps the navbar legible against bright cloud regions. */}
      <div className="absolute top-0 inset-x-0 h-40 z-[5] bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />

      {/* Bottom blend: fades the cloud cleanly into the Features section's
          solid bg-black. The taller the fade, the smoother the transition. */}
      <div className="absolute bottom-0 inset-x-0 h-[40vh] z-[5] bg-gradient-to-b from-transparent to-black pointer-events-none" />

      <div className="relative z-10 text-center px-6 py-24 max-w-3xl mx-auto">
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
          Stream depth, color, and point cloud data over the network in real time,
          with no expensive hardware required.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 animate-fade-in-up-delay-3">
          {/* App Store CTA — disabled while LOTA is in App Review.
              Re-enable (and import APP_STORE_URL) once the listing is live.
          <a
            href={APP_STORE_URL}
            className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-white/10 backdrop-blur-sm text-white border border-white/[0.18] rounded-full font-semibold text-sm hover:bg-white/20 transition-colors"
          >
            <FaApple size={18} />
            Download on the App Store
          </a>
          */}
          <a
            href={BETA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-white/10 backdrop-blur-sm text-white border border-white/[0.18] rounded-full font-semibold text-sm hover:bg-white/20 transition-colors"
          >
            <FaApple size={18} />
            Join the beta
          </a>
          <a
            href="#features"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/[0.12] text-zinc-300 text-sm font-medium hover:bg-white/[0.06] transition-colors"
          >
            See what it does
          </a>
        </div>
      </div>
    </section>
  );
}
