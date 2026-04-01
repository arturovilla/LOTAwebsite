"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";

const R2 = "https://pub-42e3bdd794c24301bd74d193c44417c6.r2.dev";

const spring = { type: "spring" as const, stiffness: 120, damping: 20 };

export default function ARKitTracking() {
  const [showDesktop, setShowDesktop] = useState(false);
  const phoneRef = useRef<HTMLVideoElement>(null);
  const phoneMobileRef = useRef<HTMLVideoElement>(null);
  const desktopRef = useRef<HTMLVideoElement>(null);
  const desktopMobileRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isVisibleRef = useRef(false);

  const startCycle = useCallback(() => {
    setShowDesktop(false);

    for (const ref of [phoneRef, phoneMobileRef]) {
      if (ref.current) {
        ref.current.currentTime = 0;
        ref.current.play();
      }
    }
    for (const ref of [desktopRef, desktopMobileRef]) {
      if (ref.current) {
        ref.current.pause();
        ref.current.currentTime = 0;
      }
    }

    timerRef.current = setTimeout(() => {
      setShowDesktop(true);
    }, 11000);
  }, []);

  useEffect(() => {
    if (!showDesktop) return;

    for (const ref of [desktopRef, desktopMobileRef]) {
      if (ref.current) {
        ref.current.currentTime = 0;
        ref.current.play();
      }
    }

    const desktop = desktopRef.current || desktopMobileRef.current;
    if (!desktop) return;

    const onEnded = () => {
      if (isVisibleRef.current) {
        startCycle();
      }
    };
    desktop.addEventListener("ended", onEnded);
    return () => desktop.removeEventListener("ended", onEnded);
  }, [showDesktop, startCycle]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;

        if (entry.isIntersecting) {
          startCycle();
        } else {
          if (timerRef.current) clearTimeout(timerRef.current);
          for (const ref of [phoneRef, phoneMobileRef, desktopRef, desktopMobileRef]) {
            ref.current?.pause();
          }
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(section);
    return () => {
      observer.disconnect();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [startCycle]);

  return (
    <section ref={sectionRef} className="py-28 px-6 bg-black overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-mono text-zinc-500 uppercase tracking-[0.2em] mb-4">
            ARKit Integration
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            Body &amp; Face Tracking Over OSC
          </h2>
          <p className="text-zinc-500 mt-5 max-w-2xl mx-auto leading-relaxed">
            Stream real-time skeleton data and facial blend shapes from ARKit
            straight into TouchDesigner, Max/MSP, or any OSC receiver. 91 body
            joints. 52 face blend shapes. Zero extra hardware.
          </p>
        </div>

        {/* Desktop: side by side */}
        <LayoutGroup>
          <div className="hidden md:flex items-center justify-center gap-6">
            <motion.div
              layout
              transition={spring}
              className="shrink-0"
            >
              <video
                ref={phoneRef}
                muted
                playsInline
                className="rounded-[2rem] h-[500px] w-auto drop-shadow-2xl"
              >
                <source src={`${R2}/faceTrackingPhone.mp4`} type="video/mp4" />
              </video>
            </motion.div>

            <AnimatePresence>
              {showDesktop && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, x: 40 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95, x: 40 }}
                  transition={spring}
                  className="flex-1 min-w-0"
                >
                  <video
                    ref={desktopRef}
                    muted
                    playsInline
                    className="w-full rounded-xl border border-white/[0.06] drop-shadow-2xl"
                  >
                    <source src={`${R2}/faceTrackingDesktop.mp4`} type="video/mp4" />
                  </video>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </LayoutGroup>

        {/* Mobile: stacked */}
        <div className="md:hidden flex flex-col items-center gap-6">
          <video
            ref={phoneMobileRef}
            muted
            playsInline
            className="rounded-[2rem] max-h-[400px] drop-shadow-2xl"
          >
            <source src={`${R2}/faceTrackingPhone.mp4`} type="video/mp4" />
          </video>

          <AnimatePresence>
            {showDesktop && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={spring}
                className="w-full"
              >
                <video
                  ref={desktopMobileRef}
                  muted
                  playsInline
                  className="w-full rounded-xl border border-white/[0.06] drop-shadow-2xl"
                >
                  <source src={`${R2}/faceTrackingDesktop.mp4`} type="video/mp4" />
                </video>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Feature pills */}
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          <span className="px-4 py-2 text-xs font-mono text-zinc-400 bg-white/[0.03] border border-white/[0.06] rounded-full">
            Body Tracking — 91 joints
          </span>
          <span className="px-4 py-2 text-xs font-mono text-zinc-400 bg-white/[0.03] border border-white/[0.06] rounded-full">
            Face Capture — 52 blend shapes
          </span>
          <span className="px-4 py-2 text-xs font-mono text-zinc-400 bg-white/[0.03] border border-white/[0.06] rounded-full">
            OSC Streaming — 30 Hz
          </span>
          <span className="px-4 py-2 text-xs font-mono text-zinc-400 bg-white/[0.03] border border-white/[0.06] rounded-full">
            Real-time Skeleton Overlay
          </span>
        </div>
      </div>
    </section>
  );
}
