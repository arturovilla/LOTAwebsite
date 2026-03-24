"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const R2 = "https://pub-42e3bdd794c24301bd74d193c44417c6.r2.dev";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

export default function InUse() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-28 px-6 bg-section overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="text-xs font-mono text-zinc-500 uppercase tracking-[0.2em] mb-4"
          >
            LOTA in Use
          </motion.p>
          <motion.h2
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white"
          >
            From Pocket to Projection
          </motion.h2>
          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="text-zinc-500 mt-5 max-w-2xl mx-auto leading-relaxed"
          >
            One iPhone. A Wi-Fi connection. Venue-scale depth visuals projected
            in real-time. No extra hardware required.
          </motion.p>
        </div>

        {/* Full-width venue shot with overlaid phone */}
        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="relative"
        >
          {/* Wide angle — full bleed */}
          <div className="overflow-hidden rounded-2xl border border-white/[0.06]">
            <img
              src={`${R2}/depthWideAngle.jpg`}
              alt="LOTA depth data driving venue-scale LED projections from a multi-monitor control setup"
              className="w-full h-[300px] sm:h-[450px] md:h-[560px] object-cover"
            />
            {/* Gradient overlay to help the phone image pop */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent rounded-2xl" />
          </div>

          {/* Phone POV — overlaid */}
          <motion.div
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="absolute -bottom-8 left-6 sm:left-10 md:left-14 w-[140px] sm:w-[180px] md:w-[240px]"
          >
            <div className="rounded-[1.2rem] md:rounded-[1.6rem] overflow-hidden border-2 border-white/[0.12] shadow-[0_8px_40px_rgba(0,0,0,0.7)]">
              <img
                src={`${R2}/depthPhonePov.jpg`}
                alt="iPhone running LOTA in depth mode at a live event with LED screens"
                className="w-full h-auto object-cover"
              />
            </div>
            <span className="mt-3 inline-block px-3 py-1.5 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-white/80 bg-black/60 backdrop-blur-md rounded-full border border-white/[0.08]">
              Depth Capture
            </span>
          </motion.div>

          {/* Badge on venue image */}
          <div className="absolute top-4 right-4 md:top-6 md:right-6">
            <span className="px-3 py-1.5 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-white/80 bg-black/60 backdrop-blur-md rounded-full border border-white/[0.08]">
              Live Installation
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
