"use client";

import { useState, useEffect, useRef } from "react";

const R2 = "https://pub-42e3bdd794c24301bd74d193c44417c6.r2.dev";

const stages = [
  { label: "Capture", video: `${R2}/GaussianSplatPhonePOV.mp4` },
  { label: "Train", video: `${R2}/GSTrainingPOV.mp4` },
  { label: "View", video: `${R2}/GSViewPOV.mp4` },
];

export default function GaussianSplat() {
  const [active, setActive] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  /* pause / resume when section scrolls in and out of view */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /* play the active video, pause the rest */
  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === active && isVisible) {
        video.currentTime = 0;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [active, isVisible]);

  const handleEnded = (index: number) => {
    if (index === active) {
      setActive((prev) => (prev + 1) % stages.length);
    }
  };

  return (
    <section id="export" className="py-28 px-6 bg-black" ref={sectionRef}>
      <div className="max-w-6xl mx-auto">
        {/* Content */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <p className="text-xs font-mono text-zinc-500 uppercase tracking-[0.2em] mb-4">
            3D Export
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Gaussian splats &amp; point clouds
          </h2>
          <p className="text-zinc-500 mt-5 leading-relaxed">
            Skip COLMAP entirely. ARKit provides camera poses, intrinsics, and
            a LiDAR point cloud in real time — no structure-from-motion, no
            feature matching, no waiting. Walk around your subject for
            30&nbsp;seconds and export a training-ready dataset directly from
            your iPhone.
          </p>
        </div>

        {/* Video carousel */}
        <div className="flex flex-col items-center gap-6">
          {/* Video container */}
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black">
            {stages.map((stage, i) => (
              <video
                key={stage.label}
                ref={(el) => {
                  videoRefs.current[i] = el;
                }}
                src={stage.video}
                muted
                playsInline
                preload="auto"
                className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-700 ease-in-out ${
                  i === active ? "opacity-100" : "opacity-0"
                }`}
                onEnded={() => handleEnded(i)}
              />
            ))}
          </div>

          {/* Step indicators */}
          <div className="flex items-center gap-4">
            {stages.map((stage, i) => (
              <button
                key={stage.label}
                onClick={() => setActive(i)}
                className={`flex items-center gap-2 text-xs font-mono uppercase tracking-wider transition-colors ${
                  i === active
                    ? "text-white"
                    : "text-zinc-600 hover:text-zinc-400"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    i === active ? "bg-white" : "bg-zinc-700"
                  }`}
                />
                {stage.label}
              </button>
            ))}
          </div>
        </div>

        {/* Feature list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-14 max-w-4xl mx-auto">
          <div className="flex items-start gap-3">
            <div className="w-1 h-1 rounded-full bg-zinc-600 mt-2.5 shrink-0" />
            <p className="text-sm text-zinc-400">
              <span className="text-white font-medium">No SfM required</span> — ARKit gives you posed cameras and point clouds directly, bypassing COLMAP&apos;s slowest step
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-1 h-1 rounded-full bg-zinc-600 mt-2.5 shrink-0" />
            <p className="text-sm text-zinc-400">
              <span className="text-white font-medium">Smart capture</span> — automatic keyframe selection, blur rejection, and focus lock keep your dataset clean without manual curation
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-1 h-1 rounded-full bg-zinc-600 mt-2.5 shrink-0" />
            <p className="text-sm text-zinc-400">
              <span className="text-white font-medium">COLMAP, Nerfstudio &amp; PLY</span> — export in the format your pipeline expects, including depth-supervised Nerfstudio for better geometry
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-1 h-1 rounded-full bg-zinc-600 mt-2.5 shrink-0" />
            <p className="text-sm text-zinc-400">
              <span className="text-white font-medium">ZIP &amp; iCloud sync</span> — captures compress into a single file and sync to your training machine automatically
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
