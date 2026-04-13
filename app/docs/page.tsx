/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Signup from "../components/Signup";
import Footer from "../components/Footer";

const sections = [
  { id: "getting-started", label: "Getting Started" },
  { id: "navigation", label: "Navigation" },
  { id: "capture-modes", label: "Capture Modes" },
  { id: "streaming", label: "Streaming" },
  { id: "tracking", label: "ARKit Tracking" },
  { id: "touchdesigner", label: "TouchDesigner" },
  { id: "export", label: "Export & 3D" },
  { id: "settings", label: "Settings" },
  { id: "accessibility", label: "Accessibility" },
  { id: "faq", label: "FAQ" },
];

/* ── tiny reusable pieces ───────────────────────────────────── */

function SectionHeading({
  tag,
  title,
  children,
}: {
  tag: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-10">
      <p className="text-xs font-mono text-zinc-600 uppercase tracking-[0.2em] mb-2">
        {tag}
      </p>
      <h2 className="text-2xl sm:text-3xl font-bold text-white">{title}</h2>
      {children && (
        <p className="text-zinc-400 mt-3 leading-relaxed">{children}</p>
      )}
    </div>
  );
}

function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4 items-start">
      <span className="shrink-0 w-7 h-7 rounded-full bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-xs font-mono text-zinc-400">
        {n}
      </span>
      <div>
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        <p className="text-sm text-zinc-500 mt-1 leading-relaxed">{children}</p>
      </div>
    </div>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
      <h3 className="text-sm font-semibold text-white mb-2">{title}</h3>
      <div className="text-sm text-zinc-400 leading-relaxed">{children}</div>
    </div>
  );
}

function Faq({
  q,
  children,
}: {
  q: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-white/[0.06] pb-6">
      <h3 className="text-sm font-semibold text-white mb-2">{q}</h3>
      <p className="text-sm text-zinc-500 leading-relaxed">{children}</p>
    </div>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <code className="text-xs font-mono text-zinc-300 bg-white/[0.06] px-1.5 py-0.5 rounded">
      {children}
    </code>
  );
}

function SettingsGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
      <h3 className="text-sm font-semibold text-white mb-4">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Setting({
  name,
  defaultValue,
  children,
}: {
  name: string;
  defaultValue?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-white/[0.04] pb-3 last:border-0 last:pb-0">
      <div className="flex items-baseline gap-2 mb-0.5">
        <Kbd>{name}</Kbd>
        {defaultValue && (
          <span className="text-xs text-zinc-600">— {defaultValue}</span>
        )}
      </div>
      <p className="text-sm text-zinc-500 leading-relaxed">{children}</p>
    </div>
  );
}

/* ── page ────────────────────────────────────────────────────── */

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("getting-started");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  /* Scroll-spy: highlight sidebar link for the section in view */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

    for (const id of sections.map((s) => s.id)) {
      const el = sectionRefs.current[id];
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth" });
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* ── top bar ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5">
              <img
                src="https://pub-42e3bdd794c24301bd74d193c44417c6.r2.dev/LOTA-dark.jpg"
                alt="LOTA"
                width={28}
                height={28}
                className="rounded-lg"
              />
              <span className="text-lg font-semibold text-white tracking-tight">
                LOTA
              </span>
            </Link>
            <span className="hidden sm:inline text-zinc-600 text-sm">/</span>
            <span className="hidden sm:inline text-sm text-zinc-400">Docs</span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Home
            </Link>
            <button
              className="lg:hidden p-2 text-zinc-400 hover:text-white"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle sidebar"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M3 5h14M3 10h14M3 15h14" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex">
        {/* ── sidebar ───────────────────────────────────────── */}
        <aside
          className={`
            fixed lg:sticky top-16 left-0 z-30 h-[calc(100vh-4rem)] w-60 shrink-0
            border-r border-white/[0.06] bg-black lg:bg-transparent
            overflow-y-auto transition-transform duration-200
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
        >
          <nav className="p-6 flex flex-col gap-1">
            <span className="text-xs font-mono text-zinc-600 uppercase tracking-[0.15em] mb-3">
              Documentation
            </span>
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className={`text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                  activeSection === s.id
                    ? "bg-white/[0.06] text-white"
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03]"
                }`}
              >
                {s.label}
              </button>
            ))}
          </nav>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/60 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ── main content ──────────────────────────────────── */}
        <main className="flex-1 min-w-0 px-6 md:px-12 py-12 space-y-24">
          <div className="max-w-3xl space-y-24">
            {/* ─── Getting Started ─────────────────────────── */}
            <section
              id="getting-started"
              ref={(el) => { sectionRefs.current["getting-started"] = el; }}
            >
              <SectionHeading tag="Introduction" title="Getting Started">
                LOTA turns your iPhone&apos;s LiDAR sensor into a professional
                spatial capture and streaming tool. Stream depth, color, and
                point cloud data over the network in real time, capture datasets
                for 3D reconstruction, and stream motion capture data — no extra
                hardware required.
              </SectionHeading>

              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 mb-8">
                <h3 className="text-sm font-semibold text-white mb-3">
                  Requirements
                </h3>
                <ul className="text-sm text-zinc-400 space-y-1.5">
                  <li>• iPhone 12 Pro or later (LiDAR required for Depth, Point Cloud, Blob Track, and Gaussian Capture)</li>
                  <li>• Color, Mono, Transcription, Motion, and Audio modes work on all iPhones</li>
                  <li>• iOS 26.2 or later</li>
                  <li>• Wi-Fi network (for streaming features)</li>
                </ul>
              </div>

              <div className="space-y-5">
                <Step n={1} title="Install LOTA">
                  Download LOTA from the App Store. Open the app and grant camera
                  and local network permissions when prompted.
                </Step>
                <Step n={2} title="Choose a capture mode">
                  Tap the mode dropdown at the top of the screen to switch
                  between Color, Mono, Depth, Point Cloud, Blob Track,
                  Transcription, Motion, or Audio. Each mode activates instantly
                  — no restart required.
                </Step>
                <Step n={3} title="Start streaming or recording">
                  Tap the stream button (bottom right) to broadcast over the
                  network. Configure transports via the Settings gear icon
                  (bottom left). Swipe right to access Gaussian Capture for
                  recording 3D datasets.
                </Step>
              </div>
            </section>

            {/* ─── Navigation ─────────────────────────────── */}
            <section
              id="navigation"
              ref={(el) => { sectionRefs.current["navigation"] = el; }}
            >
              <SectionHeading tag="App Layout" title="Navigation">
                LOTA uses a three-page swipeable layout. Swipe left and right
                to move between pages.
              </SectionHeading>

              <div className="space-y-4">
                <Card title="ARKit Tracking — Swipe Left">
                  Body, face, and hand motion capture via ARKit. Stream skeleton,
                  blend shape, and hand landmark data over OSC to TouchDesigner,
                  Max/MSP, Ableton, and more.
                </Card>
                <Card title="Camera / Streaming — Center (default)">
                  The main page. Live camera feed with eight capture modes
                  (Color, Mono, Depth, Point Cloud, Blob Track, Transcription,
                  Motion, Audio) and streaming controls. Tap the mode dropdown
                  at the top to switch modes. Settings gear icon is bottom left,
                  streaming toggle is bottom right.
                </Card>
                <Card title="Gaussian Capture — Swipe Right">
                  Record datasets for Gaussian Splatting and 3D reconstruction.
                  Choose an export format, pick an iCloud folder, and tap record.
                  A mesh wireframe overlay shows scanned surfaces building up in
                  real time.
                </Card>
              </div>
            </section>

            {/* ─── Capture Modes ───────────────────────────── */}
            <section
              id="capture-modes"
              ref={(el) => { sectionRefs.current["capture-modes"] = el; }}
            >
              <SectionHeading tag="Capture" title="Capture Modes">
                LOTA provides eight distinct capture modes on the Camera /
                Streaming page. Tap the mode dropdown at the top of the screen
                to switch — each mode shows an icon and description.
              </SectionHeading>

              <div className="grid gap-4 sm:grid-cols-2">
                <Card title="Color">
                  Live RGB camera feed at 60&nbsp;FPS. What you see on screen
                  is exactly what gets streamed. Works on all iPhones — no
                  LiDAR required.
                </Card>
                <Card title="Mono">
                  High-contrast grayscale feed optimized for low-light
                  environments and precision spatial scanning. Works on all
                  iPhones — no LiDAR required.
                </Card>
                <Card title="Depth">
                  <>
                    LiDAR depth visualization with <strong className="text-white">9 selectable
                    colormaps</strong> including thermal, incandescent, deep sea,
                    and visible spectrum. Requires a LiDAR-equipped iPhone.
                  </>
                </Card>
                <Card title="Point Cloud">
                  <>
                    Real-time 3D point cloud rendered with true RGB colors. Every
                    pixel of the 256&times;192 depth map is unprojected into 3D
                    space. Configure frame window, max depth, and compute quality
                    in Settings. Requires LiDAR.
                  </>
                </Card>
                <Card title="Blob Track">
                  <>
                    TouchDesigner-compatible blob tracker. Carves a configurable
                    depth slab out of the LiDAR scan, finds connected regions,
                    assigns each one a stable ID across frames, and streams
                    per-blob metadata over OSC at TD-matching addresses. The
                    full visualization (camera + outlines + ID labels) is
                    captured by NDI. Requires LiDAR.
                  </>
                </Card>
                <Card title="Transcription">
                  <>
                    Live on-device speech-to-text with a mirrored bar waveform
                    visualization. Recognized words stream out over OSC, TCP,
                    UDP, and appear on screen as captions. Works on every
                    iPhone — <strong className="text-white">no LiDAR required</strong>.
                  </>
                </Card>
                <Card title="Motion">
                  <>
                    Turns the iPhone into a wireless motion-sensor OSC source.
                    Streams accelerometer, gyroscope, compass heading, and
                    barometric pressure as per-axis OSC channels. Each active
                    value draws its own scrolling line graph on screen
                    (TouchDesigner CHOP viewer aesthetic), captured by NDI.
                    Works on every iPhone — <strong className="text-white">no LiDAR required</strong>.
                  </>
                </Card>
                <Card title="Audio">
                  <>
                    Real-time microphone audio analysis using Apple&apos;s
                    Accelerate/vDSP framework. Streams frequency-band Levels,
                    per-band Beat Detection triggers, Dynamics bursts, and a
                    20-band FFT spectrum as OSC channels. Each active channel
                    renders as a scrolling graph lane, captured by NDI. Works
                    on every iPhone — <strong className="text-white">no LiDAR required</strong>.
                  </>
                </Card>
              </div>

              <div className="mt-6 rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                <h3 className="text-sm font-semibold text-white mb-2">
                  Switching modes
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Use the mode dropdown at the top of the screen, or
                  say <Kbd>switch to Depth</Kbd> with Voice Control enabled.
                  Switching is instant and does not interrupt an active stream.
                </p>
              </div>

              {/* ─── Blob Track details ────────────────────── */}
              <div className="mt-10">
                <h3 className="text-xl font-bold text-white mb-2">
                  Blob Track mode
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                  Select <Kbd>Blob Track</Kbd> from the mode dropdown to turn
                  the iPhone into a wireless TouchDesigner-compatible blob
                  tracker. LOTA carves a configurable depth slab out of the
                  LiDAR scan, finds connected regions of in-range pixels,
                  assigns each one a stable ID across frames, and streams the
                  result as both a video (NDI) and per-blob metadata (OSC).
                  Replaces a Kinect + <Kbd>Blob Track TOP</Kbd> chain with a
                  single iPhone — no background plate, no lighting calibration,
                  works on a moving camera.
                </p>

                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 mb-4">
                  <h4 className="text-sm font-semibold text-white mb-3">
                    While active
                  </h4>
                  <ul className="text-sm text-zinc-400 space-y-2">
                    <li>
                      <strong className="text-white">Blob count HUD</strong>{" "}
                      — A <Kbd>N blob(s)</Kbd> count appears in the status
                      bar with a hex-grid icon
                    </li>
                    <li>
                      <strong className="text-white">Live depth range</strong>{" "}
                      — The current slab (e.g. <Kbd>0.5m – 3.0m</Kbd>) is
                      shown under the mode dropdown so operators can verify
                      the active range without opening Settings
                    </li>
                    <li>
                      <strong className="text-white">Hairline outlines</strong>{" "}
                      — Each detected blob gets a 1-pixel rectangle drawn
                      over the camera feed in your chosen color
                    </li>
                    <li>
                      <strong className="text-white">NDI captures
                      everything</strong> — The full composition (base layer
                      + rectangles + optional ID labels) is captured by NDI
                      so receivers see exactly what the phone shows
                    </li>
                    <li>
                      <strong className="text-white">Background
                      detection</strong> — Connected-components labeling runs
                      off the ARKit delegate thread so the main thread stays
                      responsive for touch and UI
                    </li>
                  </ul>
                </div>

                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 mb-4">
                  <h4 className="text-sm font-semibold text-white mb-3">
                    Base styles
                  </h4>
                  <p className="text-sm text-zinc-400 leading-relaxed mb-3">
                    Set in Settings &rarr; Blob Tracking &rarr; Detection.
                    Controls what the underlying camera layer looks like
                    behind the rectangles.
                  </p>
                  <ul className="text-sm text-zinc-400 space-y-2">
                    <li>
                      <strong className="text-white">Color</strong>{" "}
                      (default) — Live color camera feed. Operator-friendly
                      view, see what you&apos;re filming
                    </li>
                    <li>
                      <strong className="text-white">Mono</strong> — Grayscale
                      camera feed. Cleaner look, no color distractions
                    </li>
                    <li>
                      <strong className="text-white">Mask</strong> — Grayscale
                      subject silhouette on black. Verifies what&apos;s being
                      detected and hides the background
                    </li>
                    <li>
                      <strong className="text-white">Binary</strong> — Pure
                      white silhouette on black. Authentic TouchDesigner
                      Blob Track TOP look — maximum contrast
                    </li>
                  </ul>
                  <p className="text-sm text-zinc-500 leading-relaxed mt-3">
                    Toggle <Kbd>Draw Blob Bounds</Kbd> off to see only the
                    base layer. Toggle <Kbd>Show ID Labels</Kbd> on to draw
                    <Kbd>#1</Kbd>, <Kbd>#7</Kbd>, etc. labels just outside the
                    top-right corner of each bbox. Both rectangles and labels
                    use the <Kbd>Blob Color</Kbd> picker.
                  </p>
                </div>

                <Card title="OSC addresses (TD-compatible)">
                  <>
                    <p className="mb-2">
                      Field names match TouchDesigner&apos;s
                      <Kbd>blobtrackTOP_Class</Kbd> verbatim. Every message is
                      padded to 10 slots so CHOP channel counts stay stable as
                      blobs come and go — empty slots have <Kbd>id == 0</Kbd>{" "}
                      for filtering via a Select CHOP.
                    </p>
                    <ul className="space-y-1 text-zinc-500">
                      <li><Kbd>/lota/blob/count</Kbd> — active blob count (int)</li>
                      <li><Kbd>/lota/blob/ids</Kbd> — 10 stable tracker IDs</li>
                      <li><Kbd>/lota/blob/u</Kbd>, <Kbd>/lota/blob/v</Kbd> — normalized centroid (10 floats each)</li>
                      <li><Kbd>/lota/blob/width</Kbd>, <Kbd>/lota/blob/height</Kbd> — normalized bbox size (10 floats each)</li>
                      <li><Kbd>/lota/blob/tx</Kbd>, <Kbd>/lota/blob/ty</Kbd> — pixel centroid in 256&times;192 depth space (10 ints each)</li>
                      <li><Kbd>/lota/blob/age</Kbd> — seconds tracked (10 floats)</li>
                      <li><Kbd>/lota/blob/state</Kbd> — <Kbd>0=new, 1=revived, 2=lost, 3=expired</Kbd> (10 ints)</li>
                    </ul>
                  </>
                </Card>

                <div className="mt-4">
                  <Card title="Lifecycle states">
                    <>
                      <p>
                        A blob fires <Kbd>state = 0 (new)</Kbd> on first
                        detection, then is silent while it&apos;s actively
                        tracked. If it disappears, it transitions to{" "}
                        <Kbd>lost</Kbd> and is held in the revival window for{" "}
                        <Kbd>Revive Time</Kbd> seconds. If it reappears within{" "}
                        <Kbd>Revive Distance</Kbd> of where it was last seen,
                        it gets the same ID back and fires <Kbd>revived</Kbd>.
                        Otherwise it transitions to <Kbd>expired</Kbd> and is
                        permanently dropped. This matches TouchDesigner&apos;s
                        blob lifecycle exactly.
                      </p>
                    </>
                  </Card>
                </div>

                <div className="mt-4">
                  <Card title="TCP / UDP fallback">
                    <>
                      <p>
                        In blob mode, TCP/UDP carries raw <Kbd>Float32</Kbd>{" "}
                        depth maps (the same format as the <Kbd>Depth</Kbd>{" "}
                        capture mode), so receivers that want to do their own
                        client-side analysis get the raw data. The structured
                        per-blob metadata is OSC-only.
                      </p>
                    </>
                  </Card>
                </div>
              </div>

              {/* ─── Transcription details ─────────────────── */}
              <div className="mt-10">
                <h3 className="text-xl font-bold text-white mb-2">
                  Transcription mode
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                  Select <Kbd>Transcription</Kbd> from the mode dropdown to
                  turn your iPhone into a wireless live speech-to-text source
                  for creative tools. The camera view is replaced with a black
                  canvas and a 200-bar mirrored waveform driven by the
                  microphone. Recognized words appear on screen as live
                  captions. Uses iOS 26&apos;s on-device
                  <Kbd>SpeechAnalyzer</Kbd> framework — fast, private, offline.
                </p>

                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 mb-4">
                  <h4 className="text-sm font-semibold text-white mb-3">
                    First-time setup
                  </h4>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    On first use, iOS prompts for Microphone and Speech
                    Recognition permissions. Both are required. If denied, the
                    mode displays a message with a shortcut to the Settings app
                    to grant access. iOS may also briefly download the speech
                    model for your device&apos;s language on the first
                    recognition session — on-device from that point on, no
                    internet needed.
                  </p>
                </div>

                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 mb-4">
                  <h4 className="text-sm font-semibold text-white mb-3">
                    While active
                  </h4>
                  <ul className="text-sm text-zinc-400 space-y-2">
                    <li>
                      <strong className="text-white">Listening indicator</strong>{" "}
                      — A pulsing microphone icon and &quot;LISTENING&quot;
                      label appear in the status bar
                    </li>
                    <li>
                      <strong className="text-white">Waveform</strong> — 200
                      mirrored bars pulse with your voice in real time and
                      stream through NDI as a black-and-white video source
                    </li>
                    <li>
                      <strong className="text-white">Live captions</strong> —
                      Recognized words appear on screen as large centered
                      text as they arrive
                    </li>
                    <li>
                      <strong className="text-white">Camera tracking OSC
                      suppressed</strong> — Camera position messages are
                      automatically paused so speech data stands out in
                      your OSC receiver
                    </li>
                    <li>
                      <strong className="text-white">Clean exit</strong> —
                      Leaving transcription mode stops the audio engine
                      completely. No background microphone access.
                    </li>
                  </ul>
                </div>

                <Card title="OSC addresses">
                  <>
                    <p className="mb-2">
                      When OSC streaming is enabled, transcription sends these
                      addresses:
                    </p>
                    <ul className="space-y-1 text-zinc-500">
                      <li><Kbd>/lota/speech/word</Kbd> — each recognized word (string)</li>
                      <li><Kbd>/lota/speech/word_count</Kbd> — incrementing counter (int, visible in OSC In CHOP)</li>
                      <li><Kbd>/lota/speech/partial</Kbd> — running partial transcript (string)</li>
                      <li><Kbd>/lota/speech/final</Kbd> — finalized sentences (string)</li>
                    </ul>
                    <p className="mt-3 text-zinc-500">
                      String messages arrive in TouchDesigner&apos;s{" "}
                      <Kbd>OSC In DAT</Kbd> (not OSC In CHOP — CHOP only handles
                      numeric channels). The <Kbd>word_count</Kbd> integer is
                      the only speech message visible in OSC In CHOP, useful for
                      signal-flow monitoring.
                    </p>
                  </>
                </Card>

                <div className="mt-4">
                  <Card title="TCP / UDP binary wire format">
                    <>
                      <p>
                        For custom integrations, LOTA also sends recognized
                        speech as binary frames over TCP and UDP:
                        <Kbd>FrameType.speechText = 4</Kbd>, a 24-byte{" "}
                        <Kbd>FrameHeader</Kbd> + UTF-8 payload. The
                        header&apos;s <Kbd>width</Kbd> field is repurposed
                        for speech kind (0 = word, 1 = partial, 2 = final),{" "}
                        <Kbd>height</Kbd> for word index. Use the drag-and-drop
                        TD components below to parse this format automatically.
                      </p>
                    </>
                  </Card>
                </div>

                <div className="mt-4">
                  <Card title="Which transport should you use?">
                    <>
                      <ul className="space-y-1.5 mt-1">
                        <li>
                          <strong className="text-white">OSC</strong> —
                          Easiest for TouchDesigner, Max/MSP, Resolume. Drop
                          in an OSC In DAT, set the port, done.
                        </li>
                        <li>
                          <strong className="text-white">TCP / UDP</strong> —
                          Use the LOTASpeechTCP / LOTASpeechUDP components
                          (downloads in the TouchDesigner section below) for
                          plug-and-play binary parsing, or integrate into
                          custom apps, game engines, and scripts that
                          don&apos;t have OSC parsers.
                        </li>
                        <li>
                          <strong className="text-white">NDI</strong> — When
                          you want the waveform visual as a live video
                          source for reactive effects or broadcast overlays.
                        </li>
                      </ul>
                    </>
                  </Card>
                </div>
              </div>

              {/* ─── Motion details ────────────────────────── */}
              <div className="mt-10">
                <h3 className="text-xl font-bold text-white mb-2">
                  Motion mode
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                  Select <Kbd>Motion</Kbd> from the mode dropdown to turn the
                  iPhone into a wireless motion-sensor OSC source. LOTA reads
                  the device motion sensors and streams them as OSC. Each
                  active sensor value also renders as its own scrolling line
                  graph lane on screen so operators can see the data in real
                  time — the full graph composition is captured by NDI.
                  <strong className="text-white"> Works on every iPhone — no LiDAR required.</strong>
                </p>

                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 mb-4">
                  <h4 className="text-sm font-semibold text-white mb-3">
                    Sensors (individually toggleable in Settings)
                  </h4>
                  <ul className="text-sm text-zinc-400 space-y-2">
                    <li>
                      <strong className="text-white">Acceleration</strong>{" "}
                      <span className="text-emerald-400 text-xs">(ON by default)</span> —
                      Gravity-removed, G-force units. Addresses{" "}
                      <Kbd>/lota/motion/accel/x</Kbd>, <Kbd>/y</Kbd>, <Kbd>/z</Kbd>
                    </li>
                    <li>
                      <strong className="text-white">Gyroscope</strong> —
                      Rotation rate in rad/s. Addresses{" "}
                      <Kbd>/lota/motion/gyro/x</Kbd>, <Kbd>/y</Kbd>, <Kbd>/z</Kbd>
                    </li>
                    <li>
                      <strong className="text-white">Compass Heading</strong> —
                      Degrees 0–360 (requires Location permission). Address{" "}
                      <Kbd>/lota/motion/heading</Kbd>
                    </li>
                    <li>
                      <strong className="text-white">Barometric Pressure</strong> —
                      kPa plus relative altitude in meters from session start.
                      Addresses <Kbd>/lota/motion/pressure</Kbd> and{" "}
                      <Kbd>/lota/motion/altitude</Kbd>
                    </li>
                  </ul>
                  <p className="text-sm text-zinc-500 leading-relaxed mt-3">
                    Update rate picker: <Kbd>30</Kbd> / <Kbd>60</Kbd> /{" "}
                    <Kbd>100 Hz</Kbd>. 30 Hz matches ARKit. 100 Hz is useful
                    for latency-critical controllers.
                  </p>
                </div>

                <Card title="Permissions">
                  <>
                    On first entry to Motion mode, iOS prompts for Motion &amp;
                    Fitness access. If Compass is toggled on, an additional
                    Location-When-In-Use prompt appears. CoreMotion data uses
                    <Kbd>NSMotionUsageDescription</Kbd>; heading uses{" "}
                    <Kbd>NSLocationWhenInUseUsageDescription</Kbd>. If denied,
                    the relevant sensors silently skip (compass stays at −1,
                    etc.) — no crash. Permissions are requested{" "}
                    <strong className="text-white">upfront</strong> when
                    entering the mode, not mid-session.
                  </>
                </Card>

                <div className="mt-4">
                  <Card title="Scrolling graph aesthetic">
                    <>
                      Each active sensor value gets its own horizontally
                      stacked lane with a dim center line, a separator line,
                      and a colored 2-character glyph label (<Kbd>AX</Kbd>,
                      <Kbd>AY</Kbd>, <Kbd>AZ</Kbd>, <Kbd>GX</Kbd>, <Kbd>GY</Kbd>,
                      <Kbd>GZ</Kbd>, <Kbd>HD</Kbd>, <Kbd>PR</Kbd>, <Kbd>AL</Kbd>)
                      that follows the line&apos;s current Y position. Between
                      sample arrivals, the graph slides left by a fractional
                      sample-width (sub-sample scroll) so the visual feels
                      continuous even at 30 Hz data rates. Rendered in Metal
                      and captured by NDI.
                    </>
                  </Card>
                </div>

                <div className="mt-4">
                  <Card title="Use cases">
                    <>
                      <ul className="space-y-1.5 mt-1">
                        <li>
                          Phone as a wireless tilt / shake / toss controller
                          for reactive visuals in TouchDesigner, Resolume, or
                          Max/MSP
                        </li>
                        <li>
                          Environmental sensing — barometric pressure drift
                          and altitude tracking for installations
                        </li>
                        <li>
                          Wearable motion source — phone clipped or strapped
                          to a performer streams tilt, rotation rate, and
                          compass heading as OSC
                        </li>
                        <li>
                          Camera pose OSC is automatically suppressed in
                          Motion mode so sensor channels stand out cleanly in
                          an OSC In CHOP
                        </li>
                      </ul>
                    </>
                  </Card>
                </div>
              </div>

              {/* ─── Audio details ─────────────────────────── */}
              <div className="mt-10">
                <h3 className="text-xl font-bold text-white mb-2">
                  Audio mode
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                  Select <Kbd>Audio</Kbd> from the mode dropdown to turn the
                  iPhone into a wireless real-time audio analysis source. LOTA
                  taps the microphone via <Kbd>AVAudioEngine</Kbd> and extracts
                  musically relevant features using Apple&apos;s{" "}
                  <Kbd>Accelerate/vDSP</Kbd> framework — zero third-party
                  dependencies, fully on-device. Each active channel renders as
                  a scrolling graph lane and is captured by NDI.
                  <strong className="text-white"> Works on every iPhone — no LiDAR required.</strong>
                </p>

                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 mb-4">
                  <h4 className="text-sm font-semibold text-white mb-3">
                    Four channel groups (individually toggleable)
                  </h4>
                  <ul className="text-sm text-zinc-400 space-y-2">
                    <li>
                      <strong className="text-white">Levels</strong>{" "}
                      <span className="text-emerald-400 text-xs">(ON by default)</span> —
                      Continuous 0–1 energy per frequency band with rolling
                      auto-gain. <Kbd>/lota/audio/bass</Kbd>,{" "}
                      <Kbd>/lota/audio/mid</Kbd>, <Kbd>/lota/audio/high</Kbd>
                    </li>
                    <li>
                      <strong className="text-white">Beat Detection</strong> —
                      Binary 0/1 switch per band on detected onset (holds at
                      1.0 for 50 ms after each hit).{" "}
                      <Kbd>/lota/audio/drums/low</Kbd>,{" "}
                      <Kbd>/lota/audio/drums/mid</Kbd>,{" "}
                      <Kbd>/lota/audio/drums/high</Kbd>
                    </li>
                    <li>
                      <strong className="text-white">Dynamics</strong> —
                      Fast-vs-slow envelope difference, pulse-shaped 0–1
                      (rises instantly on transient, decays over ~200 ms).{" "}
                      <Kbd>/lota/audio/burst</Kbd>
                    </li>
                    <li>
                      <strong className="text-white">FFT Spectrum</strong> —
                      20 log-spaced frequency bands across 20–20,000 Hz, each
                      normalized 0–1 via per-bin rolling max.{" "}
                      <Kbd>/lota/audio/fft/0</Kbd> through{" "}
                      <Kbd>/lota/audio/fft/19</Kbd>
                    </li>
                  </ul>
                  <p className="text-sm text-zinc-500 leading-relaxed mt-3">
                    Update rate: <Kbd>30</Kbd> / <Kbd>60 Hz</Kbd>. FFT and
                    analysis run internally at ~86 Hz and decimate to the
                    user&apos;s output rate.
                  </p>
                </div>

                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 mb-4">
                  <h4 className="text-sm font-semibold text-white mb-3">
                    Frequency bands
                  </h4>
                  <ul className="text-sm text-zinc-400 space-y-2">
                    <li>
                      <strong className="text-white">BASS</strong> (20–200 Hz)
                      — kick, sub-bass, bass guitar fundamentals
                    </li>
                    <li>
                      <strong className="text-white">MID</strong> (200–2000 Hz)
                      — vocals, snare body, guitars, most instruments
                    </li>
                    <li>
                      <strong className="text-white">HIGH</strong> (2000–8000 Hz)
                      — snare attack, hi-hats, vocal consonants, cymbals
                    </li>
                  </ul>
                </div>

                <Card title="Beat detection algorithm">
                  <>
                    <p className="mb-2">
                      Multi-stage onset detection designed to be accurate on
                      dense, dynamic music without false-triggering on silence:
                    </p>
                    <ul className="space-y-1 text-zinc-500">
                      <li>
                        <strong className="text-white">1.</strong> Log-magnitude
                        spectral flux per band (more perceptually aligned than
                        raw flux)
                      </li>
                      <li>
                        <strong className="text-white">2.</strong> One-pole
                        lowpass smoothing (~15 Hz cutoff)
                      </li>
                      <li>
                        <strong className="text-white">3.</strong> Peak-picking
                        on local maxima — catches rapid drum fills that
                        threshold-only methods miss
                      </li>
                      <li>
                        <strong className="text-white">4.</strong> Adaptive
                        threshold <Kbd>noise_floor + k·stddev</Kbd> where{" "}
                        <Kbd>k</Kbd> is inversely modulated by coefficient of
                        variation (dense music gets lower k, steady signals get
                        higher k)
                      </li>
                      <li>
                        <strong className="text-white">5.</strong> 20th-percentile
                        noise-floor tracking over ~3 s (robust to sustained
                        beats)
                      </li>
                      <li>
                        <strong className="text-white">6.</strong> Silence
                        energy gate per band — no beats when the band itself
                        is quiet
                      </li>
                      <li>
                        <strong className="text-white">7.</strong> 50 ms minimum
                        inter-onset time — supports up to ~1200 BPM / 32nd
                        notes
                      </li>
                    </ul>
                    <p className="mt-3 text-zinc-500">
                      Drum channels are{" "}
                      <strong className="text-white">binary (0 or 1)</strong> —
                      trivial to route into a TouchDesigner{" "}
                      <Kbd>Trigger CHOP</Kbd> or <Kbd>Logic CHOP</Kbd> without
                      thresholding.
                    </p>
                  </>
                </Card>

                <div className="mt-4">
                  <Card title="Permissions & limitations">
                    <>
                      <p className="mb-2">
                        On first entry to Audio mode, iOS prompts for
                        Microphone access. If denied, a clear overlay with an
                        &quot;Open Settings&quot; deep-link appears and no
                        audio engine starts.
                      </p>
                      <p className="mb-2">
                        <strong className="text-white">System audio
                        limitation:</strong> LOTA analyzes the microphone input
                        only. It cannot capture system audio (Spotify, Apple
                        Music, YouTube) because iOS sandboxing doesn&apos;t
                        expose system audio to third-party apps. To analyze
                        music playing on the iPhone, play it through the
                        speakers — LOTA&apos;s mic picks it up naturally. For
                        high-fidelity analysis, play audio from a separate
                        source into the iPhone&apos;s mic.
                      </p>
                    </>
                  </Card>
                </div>

                <div className="mt-4">
                  <Card title="TouchDesigner pattern">
                    <>
                      Drop an <Kbd>OSC In CHOP</Kbd>, point it at the
                      phone&apos;s IP + port 9000. Enable Levels (default).
                      Channels <Kbd>bass</Kbd>, <Kbd>mid</Kbd>, <Kbd>high</Kbd>{" "}
                      appear and start pulsing. Toggle Beat Detection on →{" "}
                      <Kbd>drums_low</Kbd>, <Kbd>drums_mid</Kbd>,{" "}
                      <Kbd>drums_high</Kbd> appear as clean 0/1 signals you
                      can route into a Trigger CHOP for beat-synced effects.
                      FFT bands render with a red → blue color gradient (F0 =
                      lowest, F19 = highest) so you can see where energy is on
                      the spectrum at a glance.
                    </>
                  </Card>
                </div>
              </div>
            </section>

            {/* ─── Streaming ───────────────────────────────── */}
            <section
              id="streaming"
              ref={(el) => { sectionRefs.current["streaming"] = el; }}
            >
              <SectionHeading tag="Network" title="Streaming">
                Tap the transmit button (bottom right) to start streaming. All
                enabled transports send simultaneously. Configure transports in
                Settings (gear icon, bottom left).
              </SectionHeading>

              <div className="space-y-4 mb-8">
                <Card title="NDI">
                  <>
                    Industry-standard video-over-IP. LOTA appears as{" "}
                    <Kbd>LOTA (iPhone)</Kbd> on your network and is
                    auto-discovered by TouchDesigner, OBS, vMix, Resolume, and
                    any other NDI-compatible receiver. No IP configuration
                    needed. Optional side-by-side mode sends a 2x-wide frame
                    with camera view on the left and depth colormap on the right.
                  </>
                </Card>
                <Card title="TCP / UDP">
                  <>
                    Streams H.264-encoded video for Color and Mono modes,
                    and raw <Kbd>Float32</Kbd> depth maps for Depth and Point
                    Cloud modes. TCP reconnects automatically; UDP is
                    fire-and-forget. Set the destination IP and port in Settings.
                  </>
                </Card>
                <Card title="OSC">
                  <>
                    <p className="mb-2">
                      Streams real-time camera tracking data
                      at <strong className="text-white">~30&nbsp;Hz</strong> over
                      UDP. Point any OSC-capable tool at LOTA&apos;s IP and port
                      to receive:
                    </p>
                    <ul className="space-y-1 text-zinc-500">
                      <li><Kbd>/lota/camera/position</Kbd> — x, y, z (3 floats)</li>
                      <li><Kbd>/lota/camera/rotation</Kbd> — quaternion x, y, z, w (4 floats)</li>
                      <li><Kbd>/lota/camera/euler</Kbd> — pitch, yaw, roll (3 floats)</li>
                      <li><Kbd>/lota/mode</Kbd> — current capture mode (1&nbsp;Hz)</li>
                      <li><Kbd>/lota/fps</Kbd> — current frame rate (1&nbsp;Hz)</li>
                    </ul>
                  </>
                </Card>
                <Card title="PLY (live point cloud)">
                  <>
                    Sends live point cloud frames over TCP. Available in CSV text
                    format (works with TouchDesigner&apos;s <Kbd>TCP/IP
                    DAT</Kbd> in &quot;One Per Line&quot; mode) or packed binary
                    format (~40% smaller, requires a byte-parsing receiver).
                    Default port <Kbd>9848</Kbd>.
                  </>
                </Card>
              </div>

              <div className="space-y-5">
                <h3 className="text-sm font-semibold text-white">
                  How to start streaming
                </h3>
                <Step n={1} title="Open Settings (gear icon, bottom left)">
                  Enable the protocols you need and set the destination IP
                  (shared across all transports) and port for each. NDI requires
                  no configuration.
                </Step>
                <Step n={2} title="Connect to the same Wi-Fi network">
                  LOTA and your receiving machine must be on the same local
                  network. A 5&nbsp;GHz network is recommended for lowest latency.
                </Step>
                <Step n={3} title="Tap the stream button (bottom right)">
                  All enabled protocols start simultaneously. The status bar
                  shows a live indicator for each active protocol.
                </Step>
              </div>
            </section>

            {/* ─── ARKit Tracking ─────────────────────────── */}
            <section
              id="tracking"
              ref={(el) => { sectionRefs.current["tracking"] = el; }}
            >
              <SectionHeading tag="Motion Capture" title="ARKit Tracking">
                Swipe left from the main camera page to access ARKit motion
                capture. Three tracking modes stream data over OSC in real time.
              </SectionHeading>

              <div className="space-y-4 mb-8">
                <Card title="Body Tracking">
                  <>
                    <p className="mb-2">
                      3D skeleton detection via the rear camera. Tracks 91 ARKit
                      joints, streams 18 key joints over OSC. Visual overlay shows
                      white bones with green joint dots. Requires A12 chip or later.
                    </p>
                    <ul className="space-y-1 text-zinc-500">
                      <li><Kbd>/lota/body/skeleton</Kbd> — 18 joint positions</li>
                      <li><Kbd>/lota/body/root</Kbd> — root transform</li>
                      <li><Kbd>/lota/body/detected</Kbd> — detection state</li>
                    </ul>
                  </>
                </Card>
                <Card title="Face Tracking">
                  <>
                    <p className="mb-2">
                      52 facial blend shapes captured via the front-facing TrueDepth
                      camera. Overlay shows a bar graph of the top 8 most active
                      blend shapes. Requires TrueDepth camera (iPhone X or later).
                    </p>
                    <p className="text-zinc-500">
                      Each blend shape is sent as its own named OSC address
                      (e.g. <Kbd>/lota/face/browDown_L</Kbd>,{" "}
                      <Kbd>/lota/face/eyeSquint_R</Kbd>) bundled in a single UDP
                      datagram.
                    </p>
                  </>
                </Card>
                <Card title="Hand Tracking">
                  <>
                    <p className="mb-2">
                      Detects up to 2 hands simultaneously via the rear camera
                      using the Vision framework. 21 landmarks per hand, streamed
                      over OSC organized by finger. Overlay shows bone chains with
                      joint dots — teal for left hand, orange for right.
                    </p>
                    <ul className="space-y-1 text-zinc-500">
                      <li><Kbd>/lota/hand/&#123;left|right&#125;/wrist</Kbd> — 3 floats</li>
                      <li><Kbd>/lota/hand/&#123;left|right&#125;/thumb</Kbd> — 12 floats</li>
                      <li><Kbd>/lota/hand/&#123;left|right&#125;/index</Kbd> — 12 floats</li>
                      <li><Kbd>/lota/hand/&#123;left|right&#125;/middle</Kbd> — 12 floats</li>
                      <li><Kbd>/lota/hand/&#123;left|right&#125;/ring</Kbd> — 12 floats</li>
                      <li><Kbd>/lota/hand/&#123;left|right&#125;/pinky</Kbd> — 12 floats</li>
                    </ul>
                  </>
                </Card>
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                <h3 className="text-sm font-semibold text-white mb-2">
                  Hand coordinate modes
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  <strong className="text-white">2D (default)</strong> —
                  normalized screen-space coordinates. Works on all
                  iPhones. <strong className="text-white">3D
                  (opt-in)</strong> — world-space coordinates projected via
                  LiDAR depth. Requires a LiDAR device. Toggle
                  in Settings &rarr; Tracking &rarr; 3D Hand Coordinates.
                </p>
              </div>
            </section>

            {/* ─── TouchDesigner ────────────────────────────── */}
            <section
              id="touchdesigner"
              ref={(el) => { sectionRefs.current["touchdesigner"] = el; }}
            >
              <SectionHeading tag="Integration" title="TouchDesigner">
                LOTA is built with TouchDesigner workflows in mind. Stream live
                depth, color, and point cloud data directly into your TD project
                with no capture cards or expensive rigs.
              </SectionHeading>

              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 mb-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-2">
                      LOTAPoints.tox — Drop-in Component
                    </h3>
                    <div className="text-sm text-zinc-400 leading-relaxed">
                      <p>
                        A ready-made TouchDesigner component that receives live
                        PLY point cloud data from LOTA. Drop it into any project
                        and it works out of the box — defaults to
                        port <Kbd>9848</Kbd>. No scripting or manual DAT wiring
                        required.
                      </p>
                    </div>
                  </div>
                  <a
                    href="/LOTAPoints.tox"
                    download
                    className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-full bg-white text-black hover:bg-zinc-200 transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M8 2v9m0 0L5 8m3 3 3-3M3 13h10" />
                    </svg>
                    Download .tox
                  </a>
                </div>
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 mb-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-2">
                      LOTABinaryPLYReciever.tox — Binary Point Cloud Receiver
                    </h3>
                    <div className="text-sm text-zinc-400 leading-relaxed">
                      <p>
                        High-performance binary point cloud receiver for
                        TouchDesigner. Uses numpy bulk parsing, Script TOP
                        textures, and GPU instancing to handle 49K+ points
                        at 60fps. Enable <Kbd>Binary Format</Kbd> in
                        Settings &rarr; Point Cloud Stream to use this receiver.
                      </p>
                    </div>
                  </div>
                  <a
                    href="/LOTABinaryPLYReciever.tox"
                    download
                    className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-full bg-white text-black hover:bg-zinc-200 transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M8 2v9m0 0L5 8m3 3 3-3M3 13h10" />
                    </svg>
                    Download .tox
                  </a>
                </div>
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 mb-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-2">
                      LOTASpeechTCP.tox — Speech TCP Receiver
                    </h3>
                    <div className="text-sm text-zinc-400 leading-relaxed">
                      <p>
                        TCP/IP DAT with a callback script that parses
                        LOTA&apos;s binary speech frame format and writes
                        recognized words, partials, and finals to
                        a <Kbd>speech_log</Kbd> Table DAT. Handles stream
                        buffering for frames split across TCP packets. Drop
                        into your network and recognized speech starts
                        populating rows — no manual parsing required.
                      </p>
                    </div>
                  </div>
                  <a
                    href="/LOTASpeechTCP.tox"
                    download
                    className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-full bg-white text-black hover:bg-zinc-200 transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M8 2v9m0 0L5 8m3 3 3-3M3 13h10" />
                    </svg>
                    Download .tox
                  </a>
                </div>
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 mb-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-2">
                      LOTASpeechUDP.tox — Speech UDP Receiver
                    </h3>
                    <div className="text-sm text-zinc-400 leading-relaxed">
                      <p>
                        UDP In DAT configured for &quot;One Per Message&quot;
                        mode with a callback script that parses the same
                        binary speech frame format as the TCP receiver.
                        Simpler than TCP — each datagram is a complete frame,
                        so no buffering is needed. Use this for low-latency
                        fire-and-forget speech delivery on a local network.
                      </p>
                    </div>
                  </div>
                  <a
                    href="/LOTASpeechUDP.tox"
                    download
                    className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-full bg-white text-black hover:bg-zinc-200 transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M8 2v9m0 0L5 8m3 3 3-3M3 13h10" />
                    </svg>
                    Download .tox
                  </a>
                </div>
              </div>

              <Card title="NDI input (easiest)">
                <>
                  <p>
                    Drop an <Kbd>NDI In</Kbd> TOP into your project. LOTA appears
                    in the source list automatically. Select it, and you&apos;re
                    receiving live video.
                  </p>
                </>
              </Card>

              <div className="mt-4">
                <Card title="Point cloud via TCP/IP DAT">
                  <>
                    <ol className="list-decimal list-inside space-y-1.5 mt-1">
                      <li>
                        Add a <Kbd>TCP/IP DAT</Kbd> to your network.
                      </li>
                      <li>
                        Set the mode to <Kbd>Connect</Kbd>, enter LOTA&apos;s IP
                        and the PLY port from Settings.
                      </li>
                      <li>
                        LOTA sends point cloud frames as CSV rows — parse them
                        with a <Kbd>DAT to SOP</Kbd> or a Script SOP to get live
                        3D geometry.
                      </li>
                    </ol>
                  </>
                </Card>
              </div>

              <div className="mt-4">
                <Card title="Camera tracking via OSC">
                  <>
                    <p>
                      Add an <Kbd>OSC In</Kbd> CHOP. Set the port to match
                      LOTA&apos;s OSC port. You&apos;ll receive camera position
                      (x, y, z), rotation (quaternion), and euler angles
                      at 30&nbsp;Hz — perfect for driving a virtual camera or
                      triggering effects based on device movement.
                    </p>
                  </>
                </Card>
              </div>
            </section>

            {/* ─── Export ───────────────────────────────────── */}
            <section
              id="export"
              ref={(el) => { sectionRefs.current["export"] = el; }}
            >
              <SectionHeading tag="3D Export" title="Export & 3D Pipelines">
                Swipe right to the Gaussian Capture page. Record datasets with
                ARKit intrinsics, extrinsics, and LiDAR point clouds — ready for
                training, viewing, or post-production.
              </SectionHeading>

              <div className="space-y-4 mb-8">
                <Card title="COLMAP">
                  <>
                    Exports <Kbd>cameras.bin</Kbd>, <Kbd>images.bin</Kbd>,
                    and <Kbd>points3D.bin</Kbd> in COLMAP binary format.
                    Compatible with OpenSplat, gsplat, and Nerfstudio for
                    training Gaussian Splats directly from your iPhone captures.
                  </>
                </Card>
                <Card title="Nerfstudio">
                  <>
                    Exports <Kbd>transforms.json</Kbd> + <Kbd>images/</Kbd> JPEGs
                    + <Kbd>points3D.ply</Kbd>. Ready for Nerfstudio, splatfacto,
                    and Instant-NGP training pipelines.
                  </>
                </Card>
                <Card title="Nerfstudio + Depth">
                  <>
                    Same as Nerfstudio, plus 16-bit PNG depth maps in
                    a <Kbd>depth/</Kbd> folder. Best for depth-supervised
                    training — produces better geometry on flat surfaces and
                    uniform areas.
                  </>
                </Card>
                <Card title="Point Cloud (PLY)">
                  <>
                    Standalone <Kbd>points3D.ply</Kbd> file with accumulated
                    points from your session. Open in Blender, CloudCompare,
                    MeshLab, or any tool that reads PLY.
                  </>
                </Card>
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 mb-8">
                <h3 className="text-sm font-semibold text-white mb-3">
                  What happens during recording
                </h3>
                <ul className="text-sm text-zinc-400 space-y-2">
                  <li>
                    <strong className="text-white">Mesh overlay</strong> — A
                    semi-transparent wireframe shows scanned surfaces building up
                    in real time (cyan near, purple far)
                  </li>
                  <li>
                    <strong className="text-white">Keyframe selection</strong> —
                    Only frames where the camera moved at least 5cm or
                    rotated ~5&deg; are saved, producing a well-distributed set of
                    training views
                  </li>
                  <li>
                    <strong className="text-white">Blur detection</strong> —
                    Motion-blurred frames are automatically rejected via Laplacian
                    variance analysis
                  </li>
                  <li>
                    <strong className="text-white">Focus lock</strong> —
                    Autofocus is disabled during recording to keep camera
                    intrinsics consistent across all frames
                  </li>
                  <li>
                    <strong className="text-white">Haptic feedback</strong> — A
                    subtle tap each time a keyframe is captured
                  </li>
                  <li>
                    <strong className="text-white">Counters</strong> — Elapsed
                    time, keyframe count, and total point count shown on screen
                  </li>
                </ul>
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 mb-8">
                <h3 className="text-sm font-semibold text-white mb-3">
                  When you stop recording
                </h3>
                <ul className="text-sm text-zinc-400 space-y-1.5">
                  <li>1. Dataset files are written (metadata, point cloud, images)</li>
                  <li>2. Everything is compressed into a single <Kbd>.zip</Kbd> file</li>
                  <li>3. A summary shows format, keyframes, points, file size, and filename</li>
                  <li>4. The zip syncs to iCloud automatically if you chose an iCloud folder</li>
                </ul>
              </div>

              <div className="space-y-5">
                <h3 className="text-sm font-semibold text-white">
                  Tips for best results
                </h3>
                <Step n={1} title="Move slowly">
                  Walk around the subject at a steady pace. A typical 30-second
                  scan produces ~80 keyframes and a 10–20 MB zip.
                </Step>
                <Step n={2} title="Capture from multiple angles">
                  Shoot from low, mid, and high heights. Ensure adjacent
                  viewpoints have 70–80% overlap for best reconstruction.
                </Step>
                <Step n={3} title="Use good lighting">
                  Consistent, well-lit environments produce better results. Avoid
                  reflective and transparent surfaces — LiDAR struggles with
                  glass and mirrors.
                </Step>
              </div>
            </section>

            {/* ─── Settings ───────────────────────────────── */}
            <section
              id="settings"
              ref={(el) => { sectionRefs.current["settings"] = el; }}
            >
              <SectionHeading tag="Configuration" title="Settings Reference">
                Access settings via the gear icon on the Camera / Streaming page
                (bottom left). The receiver IP is shared across all transports.
              </SectionHeading>

              <div className="space-y-4">
                <SettingsGroup title="Receiver">
                  <Setting name="Receiver IP" defaultValue="192.168.1.100">
                    IP address of the computer receiving streams. Shared across
                    all transports (TCP, UDP, OSC, PLY).
                  </Setting>
                </SettingsGroup>

                <SettingsGroup title="Transport (TCP/UDP)">
                  <Setting name="TCP/UDP Output" defaultValue="On">
                    Enable or disable the video transport.
                  </Setting>
                  <Setting name="Protocol" defaultValue="TCP">
                    TCP (reliable, auto-reconnects) or UDP (fire-and-forget). TCP
                    sends H.264 video for Color/Mono, raw Float32 depth for
                    Depth/Point Cloud modes.
                  </Setting>
                  <Setting name="Port" defaultValue="9847">
                    Destination port for TCP/UDP streams.
                  </Setting>
                </SettingsGroup>

                <SettingsGroup title="NDI">
                  <Setting name="NDI Video Output" defaultValue="Off">
                    Enable or disable NDI streaming. Auto-broadcasts
                    as &quot;LOTA (iPhone)&quot; on the local network.
                  </Setting>
                  <Setting name="Side-by-Side" defaultValue="Off">
                    Sends a 2x-wide frame: left half is the camera view, right
                    half is the depth colormap. Standard format for TouchDesigner
                    and Notch workflows.
                  </Setting>
                </SettingsGroup>

                <SettingsGroup title="OSC">
                  <Setting name="OSC Output" defaultValue="Off">
                    Enable or disable OSC messages.
                  </Setting>
                  <Setting name="Port" defaultValue="9000">
                    OSC destination port.
                  </Setting>
                </SettingsGroup>

                <SettingsGroup title="Depth">
                  <Setting name="Color Map" defaultValue="Visible Spectrum">
                    Colormap for depth visualization. Options: Black &amp; White,
                    Black Aqua White, Blue Red, Deep Sea, Color Spectrum,
                    Incandescent, Heated Metal, Sunrise, Visible Spectrum.
                  </Setting>
                </SettingsGroup>

                <SettingsGroup title="Point Cloud">
                  <Setting name="Frame Window" defaultValue="30 (range 5–60)">
                    Number of accumulated LiDAR frames in the live point cloud
                    sliding window. Higher values show more spatial coverage but
                    use more GPU memory. Only affects the live view, not Gaussian
                    Capture.
                  </Setting>
                  <Setting name="Max Depth" defaultValue="5.0m (range 1–10m)">
                    Maximum LiDAR range. Points beyond this are discarded. Gen 1
                    LiDAR (iPhone 12–14 Pro) is reliable to ~5m. Gen 2
                    (iPhone 15–16 Pro) can reach ~10m. Affects both live view and
                    Gaussian Capture exports.
                  </Setting>
                  <Setting name="Compute Quality" defaultValue="Balanced">
                    GPU compute frame skip for thermal management. Full = every
                    frame, Balanced = every 2nd, Efficient = every 3rd. Only
                    affects live Point Cloud mode.
                  </Setting>
                  <Setting name="Min Confidence" defaultValue="Medium+">
                    LiDAR depth confidence filter. All = no filtering, maximum
                    density. Medium+ = removes low-confidence noisy edge pixels.
                    High Only = fewest points, highest accuracy. Affects both live
                    view and Gaussian Capture exports.
                  </Setting>
                </SettingsGroup>

                <SettingsGroup title="Blob Tracking — Detection">
                  <Setting name="Base Style" defaultValue="Color">
                    What the underlying camera layer looks like behind the
                    rectangle outlines. Color (live RGB), Mono (grayscale),
                    Mask (grayscale subject silhouette on black), or Binary
                    (white-on-black silhouette — authentic TouchDesigner Blob
                    Track TOP look).
                  </Setting>
                  <Setting name="Draw Blob Bounds" defaultValue="On">
                    Draw 1-pixel hairline rectangle outlines around detected
                    blobs. Turn off to see only the base layer.
                  </Setting>
                  <Setting name="Show ID Labels" defaultValue="Off">
                    Draw <Kbd>#id</Kbd> text labels just outside the top-right
                    corner of each blob bounding box.
                  </Setting>
                  <Setting name="Blob Color" defaultValue="Pure green">
                    RGB color used for both rectangle outlines and ID labels.
                  </Setting>
                </SettingsGroup>

                <SettingsGroup title="Blob Tracking — Depth">
                  <Setting name="Min Depth" defaultValue="0.5 m (range 0.1–5.0 m)">
                    Near edge of the depth slab. Pixels closer than this are
                    excluded from blob detection.
                  </Setting>
                  <Setting name="Max Depth" defaultValue="3.0 m (range 0.5–10.0 m)">
                    Far edge of the depth slab. Pixels farther than this are
                    excluded from blob detection.
                  </Setting>
                  <Setting name="Min Confidence" defaultValue="Medium+">
                    LiDAR depth confidence filter (same semantics as Point
                    Cloud). All / Medium+ / High Only. Pixels below the
                    threshold are excluded from detection.
                  </Setting>
                </SettingsGroup>

                <SettingsGroup title="Blob Tracking — Constraints">
                  <Setting name="Min Blob Size" defaultValue="50 px (range 10–500)">
                    Minimum pixel area to count as a blob. Filters out single
                    noise pixels and tiny artifacts.
                  </Setting>
                  <Setting name="Max Blob Size" defaultValue="30000 px (range 100–49152)">
                    Maximum pixel area. Rejects the &quot;everything is one
                    blob&quot; failure mode where the entire scene merges
                    together.
                  </Setting>
                  <Setting name="Max Move Distance" defaultValue="0.15 (range 0.01–0.5)">
                    Maximum normalized distance a blob can travel between
                    frames and keep its ID. Increase for fast-moving subjects
                    or higher-FPS scenes.
                  </Setting>
                </SettingsGroup>

                <SettingsGroup title="Blob Tracking — Revival">
                  <Setting name="Revive Blobs" defaultValue="On">
                    Re-identify lost blobs with the same ID if they reappear
                    inside the revival window. Mirrors TouchDesigner&apos;s
                    blob lifecycle exactly.
                  </Setting>
                  <Setting name="Revive Time" defaultValue="0.5 s">
                    Seconds a lost blob is kept alive for revival before it
                    transitions to expired and is permanently dropped.
                  </Setting>
                  <Setting name="Revive Distance" defaultValue="0.2">
                    Maximum normalized distance for the revival match. A lost
                    blob must reappear within this radius to recover its ID.
                  </Setting>
                  <Setting name="Include Lost in OSC" defaultValue="Off">
                    Emit lost blobs in the OSC bundle with <Kbd>state = 2</Kbd>.
                  </Setting>
                  <Setting name="Include Expired in OSC" defaultValue="Off">
                    Emit expired blobs in the OSC bundle with <Kbd>state = 3</Kbd>.
                  </Setting>
                </SettingsGroup>

                <SettingsGroup title="Point Cloud Stream (PLY)">
                  <Setting name="PLY Streaming" defaultValue="Off">
                    Enable or disable live point cloud TCP stream.
                  </Setting>
                  <Setting name="Port" defaultValue="9848">
                    PLY stream destination port.
                  </Setting>
                  <Setting name="Binary Format" defaultValue="Off">
                    Packed binary (15 bytes/point) vs CSV text. Binary is ~40%
                    smaller but requires a byte-parsing receiver. CSV text works
                    with TouchDesigner&apos;s TCP/IP DAT in &quot;One Per
                    Line&quot; mode.
                  </Setting>
                </SettingsGroup>

                <SettingsGroup title="Tracking">
                  <Setting name="Skeleton Overlay" defaultValue="On">
                    Show or hide body skeleton visualization on the tracking page.
                  </Setting>
                  <Setting name="Face Overlay" defaultValue="On">
                    Show or hide face blend shape bar graph on the tracking page.
                  </Setting>
                  <Setting name="Hand Overlay" defaultValue="On">
                    Show or hide hand bone and joint visualization on the tracking
                    page.
                  </Setting>
                  <Setting name="3D Hand Coordinates" defaultValue="Off">
                    Use LiDAR-projected world-space hand coordinates instead of
                    normalized screen-space. Requires a LiDAR-equipped device.
                  </Setting>
                </SettingsGroup>

                <SettingsGroup title="Transcription">
                  <Setting name="Send Per-Word OSC" defaultValue="On">
                    Send each recognized word as it arrives
                    (<Kbd>/lota/speech/word</Kbd> + TCP/UDP word frames).
                    The <Kbd>/lota/speech/word_count</Kbd> integer always
                    fires alongside per-word messages as a numeric CHOP-visible
                    signal.
                  </Setting>
                  <Setting name="Send Partial Transcript" defaultValue="On">
                    Send running partial transcript updates as words arrive
                    (<Kbd>/lota/speech/partial</Kbd> + TCP/UDP partial frames).
                  </Setting>
                  <Setting name="Send Final Transcript" defaultValue="On">
                    Send finalized sentences when the recognizer commits
                    (<Kbd>/lota/speech/final</Kbd> + TCP/UDP final frames).
                  </Setting>
                  <div className="pt-2 text-xs text-zinc-500 leading-relaxed">
                    These toggles apply to both OSC and TCP/UDP transports
                    simultaneously. Turn off anything you don&apos;t need to
                    reduce noise in your receiver.
                  </div>
                </SettingsGroup>

                <SettingsGroup title="Device Motion">
                  <Setting name="Acceleration (X, Y, Z)" defaultValue="On">
                    Gravity-removed acceleration in G-force, sent as three OSC
                    floats per update (<Kbd>/lota/motion/accel/x</Kbd>,{" "}
                    <Kbd>/y</Kbd>, <Kbd>/z</Kbd>).
                  </Setting>
                  <Setting name="Gyroscope (X, Y, Z)" defaultValue="Off">
                    Rotation rate in rad/s, three OSC floats per update
                    (<Kbd>/lota/motion/gyro/x</Kbd>, <Kbd>/y</Kbd>,{" "}
                    <Kbd>/z</Kbd>).
                  </Setting>
                  <Setting name="Compass Heading" defaultValue="Off">
                    Magnetic heading in degrees 0–360 (requires Location
                    permission). Address <Kbd>/lota/motion/heading</Kbd>.
                  </Setting>
                  <Setting name="Barometric Pressure" defaultValue="Off">
                    Atmospheric pressure in kPa plus relative altitude in
                    meters (<Kbd>/lota/motion/pressure</Kbd>,{" "}
                    <Kbd>/lota/motion/altitude</Kbd>).
                  </Setting>
                  <Setting name="Update Rate" defaultValue="30 Hz">
                    30 / 60 / 100 Hz picker. 30 Hz matches ARKit. 100 Hz is
                    useful for latency-critical controllers.
                  </Setting>
                  <div className="pt-2 text-xs text-zinc-500 leading-relaxed">
                    Each enabled sensor draws a scrolling graph lane on screen
                    and streams over OSC. Toggling a sensor off mid-session
                    removes its graph lane and stops its OSC channel within
                    ~50 ms (debounced to prevent crash loops from rapid
                    toggles). Permissions are requested upfront when entering
                    Motion mode.
                  </div>
                </SettingsGroup>

                <SettingsGroup title="Audio Analysis">
                  <Setting name="Levels (Bass / Mid / High)" defaultValue="On">
                    Continuous 0–1 energy per frequency band with rolling
                    auto-gain. <Kbd>/lota/audio/bass</Kbd>,{" "}
                    <Kbd>/lota/audio/mid</Kbd>, <Kbd>/lota/audio/high</Kbd>.
                  </Setting>
                  <Setting name="Beat Detection" defaultValue="Off">
                    Binary 0/1 switch per band on detected onset (50 ms gate
                    window). <Kbd>/lota/audio/drums/low</Kbd>,{" "}
                    <Kbd>/lota/audio/drums/mid</Kbd>,{" "}
                    <Kbd>/lota/audio/drums/high</Kbd>.
                  </Setting>
                  <Setting name="Dynamics" defaultValue="Off">
                    <Kbd>/lota/audio/burst</Kbd> — fast transient detector,
                    pulse-shaped 0–1 (rises instantly, decays over ~200 ms).
                  </Setting>
                  <Setting name="FFT Spectrum (20 bands)" defaultValue="Off">
                    20 log-spaced FFT bands across 20–20,000 Hz, each
                    normalized 0–1. <Kbd>/lota/audio/fft/0</Kbd> through{" "}
                    <Kbd>/lota/audio/fft/19</Kbd>, rendered with a red → blue
                    color gradient.
                  </Setting>
                  <Setting name="Update Rate" defaultValue="30 Hz">
                    30 / 60 Hz picker. Analysis runs internally at ~86 Hz and
                    decimates to the chosen output rate.
                  </Setting>
                  <div className="pt-2 text-xs text-zinc-500 leading-relaxed">
                    Microphone permission is requested upfront when entering
                    Audio mode. Uses the same{" "}
                    <Kbd>NSMicrophoneUsageDescription</Kbd> as Transcription
                    mode. LOTA can only analyze the microphone input — iOS
                    sandboxing prevents capturing system audio from other apps.
                  </div>
                </SettingsGroup>
              </div>
            </section>

            {/* ─── Accessibility ────────────────────────────── */}
            <section
              id="accessibility"
              ref={(el) => { sectionRefs.current["accessibility"] = el; }}
            >
              <SectionHeading tag="Inclusive Design" title="Accessibility">
                LOTA is designed to meet Apple&apos;s App Store accessibility
                standards. Every feature works for every user.
              </SectionHeading>

              <div className="grid gap-4 sm:grid-cols-2">
                <Card title="VoiceOver">
                  Every control is labeled and announced. Mode switches, streaming
                  state, and recording status are all spoken aloud.
                </Card>
                <Card title="Voice Control">
                  <>
                    Say <Kbd>stream</Kbd>, <Kbd>record</Kbd>,
                    or <Kbd>switch to Depth</Kbd> and LOTA responds. Every
                    button is discoverable by voice.
                  </>
                </Card>
                <Card title="Dynamic Type">
                  Text scales up to 200%+. The UI reflows to a single-column
                  layout at extreme sizes so nothing gets cut off.
                </Card>
                <Card title="Dark Interface">
                  Designed dark from the start. Every screen, menu, and control
                  uses a true dark color scheme for comfortable use in any
                  environment.
                </Card>
                <Card title="Differentiate Without Color">
                  Status indicators swap to distinct symbols when this setting is
                  enabled. Shapes, icons, and text labels replace color as the
                  sole differentiator.
                </Card>
                <Card title="Increase Contrast">
                  Swaps blur materials for solid backgrounds and boosts status
                  colors for guaranteed readability over any camera feed.
                </Card>
                <Card title="Reduce Motion">
                  All transitions respect the system Reduce Motion setting.
                  Visual feedback stays, decorative animation goes.
                </Card>
              </div>
            </section>

            {/* ─── FAQ ─────────────────────────────────────── */}
            <section
              id="faq"
              ref={(el) => { sectionRefs.current["faq"] = el; }}
            >
              <SectionHeading tag="Support" title="Frequently Asked Questions" />

              <div className="space-y-6">
                <Faq q="Which iPhones support LOTA?">
                  Any iPhone running iOS 26.2 or later. LiDAR features (Depth,
                  Point Cloud, Gaussian Capture, 3D hand coordinates) require
                  iPhone 12 Pro or later. Color, Mono, and Transcription modes,
                  NDI streaming, and TCP/UDP streaming all work on iPhones
                  without LiDAR. Face tracking requires TrueDepth camera
                  (iPhone X or later). Body tracking requires A12 chip or
                  later. iPad Pro models with LiDAR are also supported.
                </Faq>
                <Faq q="Does Transcription mode need internet access?">
                  No. Transcription uses iOS 26&apos;s on-device
                  {" "}<Kbd>SpeechAnalyzer</Kbd> framework and runs entirely
                  offline. The first time you use it in a given language, iOS
                  briefly downloads the speech model for that language in the
                  background — after that, recognition works fully offline.
                  Audio never leaves your device.
                </Faq>
                <Faq q="Do the receiving machine and iPhone need to be on the same network?">
                  Yes. For TCP, UDP, OSC, and PLY streaming, both devices must be
                  on the same local network. NDI also uses the local network but
                  handles discovery automatically. A 5&nbsp;GHz Wi-Fi connection
                  is recommended.
                </Faq>
                <Faq q="What software can receive LOTA streams?">
                  Any NDI-compatible software (TouchDesigner, OBS, vMix,
                  Resolume), any tool that reads TCP/UDP sockets, and any
                  OSC-capable application (Max/MSP, Ableton, Unreal Engine).
                </Faq>
                <Faq q="How do I use the export data for Gaussian Splat training?">
                  Export a COLMAP or Nerfstudio dataset from the Gaussian Capture
                  page, transfer the zip to your training machine, and point
                  OpenSplat, Nerfstudio, or gsplat at the extracted folder. The
                  files are in the exact format these tools expect.
                </Faq>
                <Faq q="Is there a latency cost to streaming?">
                  NDI and TCP/UDP streams typically add 1–3 frames of latency
                  depending on your network. OSC tracking data arrives at
                  30&nbsp;Hz with sub-frame latency. A wired connection or
                  5&nbsp;GHz Wi-Fi keeps things as fast as possible.
                </Faq>
                <Faq q="What export format should I use?">
                  COLMAP for OpenSplat and gsplat. Nerfstudio for splatfacto and
                  Instant-NGP. Nerfstudio + Depth for best geometry on flat or
                  featureless surfaces. Point Cloud (PLY) for quick visualization
                  in Blender or CloudCompare.
                </Faq>
              </div>
            </section>
          </div>
        </main>
      </div>
      <Signup />
      <Footer />
    </div>
  );
}
