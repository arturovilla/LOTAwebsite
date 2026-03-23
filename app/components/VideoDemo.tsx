"use client";

import { useState, useRef, useEffect, useCallback } from "react";

export default function VideoDemo() {
  const [showDesktop, setShowDesktop] = useState(false);
  const phoneRef = useRef<HTMLVideoElement>(null);
  const desktopRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isVisibleRef = useRef(false);

  const startCycle = useCallback(() => {
    // Reset: hide desktop, restart phone video
    setShowDesktop(false);
    const phone = phoneRef.current;
    const desktop = desktopRef.current;
    if (phone) {
      phone.currentTime = 0;
      phone.play();
    }
    if (desktop) {
      desktop.pause();
      desktop.currentTime = 0;
    }

    // After 11s, slide phone left and show desktop
    timerRef.current = setTimeout(() => {
      setShowDesktop(true);
      if (desktop) desktop.play();

      // When desktop video ends, restart the whole cycle
      const onEnded = () => {
        desktop?.removeEventListener("ended", onEnded);
        if (isVisibleRef.current) {
          startCycle();
        }
      };
      desktop?.addEventListener("ended", onEnded);
    }, 11000);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        const phone = phoneRef.current;
        const desktop = desktopRef.current;

        if (entry.isIntersecting) {
          startCycle();
        } else {
          // Pause everything when off screen
          if (timerRef.current) clearTimeout(timerRef.current);
          phone?.pause();
          desktop?.pause();
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
            In Action
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            Enhance your TouchDesigner workflows
          </h2>
          <p className="text-zinc-500 mt-5 max-w-2xl mx-auto leading-relaxed">
            Stream live point cloud data from your iPhone straight into
            TouchDesigner. No capture cards, no expensive rigs — just your
            phone and a Wi-Fi connection.
          </p>
        </div>

        {/* Desktop: side by side */}
        <div className="hidden md:flex items-center justify-center gap-8">
          <div
            className="shrink-0 transition-all duration-1000 ease-in-out"
            style={{
              transform: showDesktop
                ? "translateX(0)"
                : "translateX(calc(50vw - 50% - 1rem))",
            }}
          >
            <video
              ref={phoneRef}
              muted
              playsInline
              className="rounded-[2rem] max-h-[550px] drop-shadow-2xl"
            >
              <source src="https://pub-42e3bdd794c24301bd74d193c44417c6.r2.dev/phone.MP4" type="video/mp4" />
            </video>
          </div>

          <div
            className="flex-1 min-w-0 transition-all duration-1000 ease-in-out"
            style={{
              opacity: showDesktop ? 1 : 0,
              transform: showDesktop ? "translateX(0)" : "translateX(60px)",
            }}
          >
            <video
              ref={desktopRef}
              muted
              playsInline
              className="w-full rounded-xl border border-white/[0.06] drop-shadow-2xl"
            >
              <source src="https://pub-42e3bdd794c24301bd74d193c44417c6.r2.dev/desktop.mp4" type="video/mp4" />
            </video>
          </div>
        </div>

        {/* Mobile: stacked */}
        <div className="md:hidden flex flex-col items-center gap-6">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="rounded-[2rem] max-h-[400px] drop-shadow-2xl"
          >
            <source src="https://pub-42e3bdd794c24301bd74d193c44417c6.r2.dev/phone.MP4" type="video/mp4" />
          </video>
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full rounded-xl border border-white/[0.06] drop-shadow-2xl"
          >
            <source src="https://pub-42e3bdd794c24301bd74d193c44417c6.r2.dev/desktop.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </section>
  );
}
