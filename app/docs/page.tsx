"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
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
  tag,
  children,
}: {
  title: string;
  tag?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
      {tag ? (
        <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          <div className="flex items-center gap-2 flex-wrap">{tag}</div>
        </div>
      ) : (
        <h3 className="text-sm font-semibold text-white mb-2">{title}</h3>
      )}
      <div className="text-sm text-zinc-400 leading-relaxed">{children}</div>
    </div>
  );
}

const TAG_VARIANT_STYLES = {
  emerald: "text-emerald-400 border-emerald-400/20 bg-emerald-400/[0.06]",
  amber: "text-amber-400 border-amber-400/20 bg-amber-400/[0.06]",
  blue: "text-blue-400 border-blue-400/20 bg-blue-400/[0.06]",
  violet: "text-violet-400 border-violet-400/20 bg-violet-400/[0.06]",
  rose: "text-rose-400 border-rose-400/20 bg-rose-400/[0.06]",
  cyan: "text-cyan-400 border-cyan-400/20 bg-cyan-400/[0.06]",
  zinc: "text-zinc-400 border-zinc-400/20 bg-zinc-400/[0.06]",
} as const;

type TagVariant = keyof typeof TAG_VARIANT_STYLES;

function Tag({
  variant = "zinc",
  children,
}: {
  variant?: TagVariant;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-block text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border whitespace-nowrap ${TAG_VARIANT_STYLES[variant]}`}
    >
      {children}
    </span>
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
    <div
      className="min-h-screen bg-black text-white font-mono"
      style={{ ["--font-mono" as string]: "var(--font-ibm-plex-mono)" }}
    >
      <Navbar />

      {/* Floating sidebar toggle — visible only below lg, where the docs
          sidebar is hidden by default. */}
      <button
        className="lg:hidden fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 border border-white/[0.15] text-zinc-200 backdrop-blur-xl hover:bg-white/[0.15] transition-colors text-sm font-medium shadow-lg"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle docs sidebar"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M3 5h14M3 10h14M3 15h14" />
        </svg>
        Contents
      </button>

      <div className="max-w-7xl mx-auto flex pt-16">
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
                  <li>• iPhone 12 Pro or later (LiDAR required for Depth, Point Cloud, Blob Track, Gaussian Capture, and Material Capture)</li>
                  <li>• Color, Mono, <strong className="text-white">Neural Depth</strong>, Transcription, Motion, and Audio modes work on every iPhone — no LiDAR needed</li>
                  <li>• iOS 26.2 or later</li>
                  <li>• Wi-Fi network (for streaming features)</li>
                </ul>
              </div>

              <div className="space-y-5">
                <Step n={1} title="Install LOTA and complete first launch">
                  Download LOTA from the App Store. The first time you open
                  the app, a welcome screen lists the seven iOS permissions
                  LOTA needs (Camera, Microphone, Speech Recognition, Local
                  Network, Location for compass heading, Motion &amp; Fitness,
                  and Photos <strong className="text-white">add-only</strong>{" "}
                  for saving local recordings) plus a privacy reassurance —
                  LOTA never tracks you, sells your data, or sends anything
                  off your device unless you point it at a receiver. Tap{" "}
                  <Kbd>Continue</Kbd> and the seven OS permission dialogs
                  appear in sequence. The Photos prompt is the narrower{" "}
                  <strong className="text-white">add-only</strong> variant —
                  LOTA can write videos to your camera roll but never read
                  existing photos.
                </Step>
                <Step n={2} title="Take the 10-step guided tour">
                  After permissions, a hybrid welcome card &rarr; spotlight
                  tour walks you through the three pages, the mode picker,
                  the status bar, the bottom endpoint summary, mode-specific
                  settings, and the transmit button. Tap anywhere to advance,
                  or use the Skip button at the bottom-left. Replay anytime
                  from{" "}
                  <Kbd>Transmission Settings &rarr; Help &rarr; Replay Tutorial</Kbd>.
                </Step>
                <Step n={3} title="Choose a capture mode">
                  Tap the mode picker at the top — a glass capsule showing
                  the active mode&apos;s icon next to a chevron that flips
                  down / up as the panel opens and closes. A glass panel
                  drops down with all 9 modes laid out in a circular-icon
                  grid (Color, Mono, Depth, Neural Depth, Point Cloud, Blob
                  Track, Transcription, Motion, Audio). Active mode is
                  highlighted yellow; LiDAR-required modes are dimmed and
                  disabled on non-LiDAR devices. Each mode activates instantly
                  — no restart required.
                </Step>
                <Step n={4} title="Stream or record locally">
                  The middle page has an iOS Camera-style shutter button at
                  the bottom-center with a{" "}
                  <strong className="text-white">STREAM | RECORD</strong>{" "}
                  segmented control directly below it. The two paradigms are{" "}
                  <em>mutually exclusive</em>: while one is active the other
                  is locked, so a recording can&apos;t start mid-stream and
                  vice versa. <strong className="text-white">STREAM</strong>{" "}
                  broadcasts over the network (all enabled transports send
                  simultaneously); <strong className="text-white">RECORD</strong>{" "}
                  saves an H.264 <Kbd>.mov</Kbd> of the live composited Metal
                  output to your Photos library on stop (4-hour cap).
                  Configure transports by tapping the floating status bar
                  pill (Transmission Settings); tweak per-mode options via
                  the <Kbd>&lt;Mode&gt; Settings</Kbd> button. Swipe right
                  for Gaussian Capture (3D datasets, PBR materials, IMU /
                  Audio Trace exports).
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
                  The main page. Live camera feed with nine capture modes
                  (Color, Mono, Depth, Neural Depth, Point Cloud, Blob Track,
                  Transcription, Motion, Audio) and streaming controls. Tap
                  the mode picker at the top (glass capsule + chevron that
                  flips down/up) to open the panel and switch modes. Tap the
                  floating status bar pill for Transmission Settings, or the
                  per-mode <Kbd>&lt;Mode&gt; Settings</Kbd> button just below
                  it for options specific to the active mode. Streaming
                  toggle is bottom right.
                </Card>
                <Card title="Gaussian Capture — Swipe Right">
                  Record datasets for Gaussian Splatting and 3D reconstruction,
                  capture a flat surface as a complete PBR material set with
                  the Material format, or record IMU / Audio Trace exports
                  (sensor or audio analysis data over time as
                  CSV/TSV + manifest + optional PDF report). Choose a format,
                  pick an iCloud folder, then either tap record (3D scene
                  and trace formats) or lock a plane and tap the shutter
                  (Material).
                </Card>
              </div>
            </section>

            {/* ─── Capture Modes ───────────────────────────── */}
            <section
              id="capture-modes"
              ref={(el) => { sectionRefs.current["capture-modes"] = el; }}
            >
              <SectionHeading tag="Capture" title="Capture Modes">
                LOTA provides nine distinct capture modes on the Camera /
                Streaming page. Tap the mode picker at the top (glass capsule
                with the active mode&apos;s icon next to a chevron that flips
                down/up as the panel opens and closes) to open a glass panel
                laid out as a grid of circular icon buttons. Active mode is
                highlighted yellow; LiDAR-required modes are dimmed on
                non-LiDAR devices. Tap outside the panel to dismiss without
                picking.
              </SectionHeading>

              <div className="grid gap-4 sm:grid-cols-2">
                <Card
                  title="Color"
                  tag={<Tag variant="emerald">No LiDAR required</Tag>}
                >
                  Live RGB camera feed at 60&nbsp;FPS. What you see on screen
                  is exactly what gets streamed.
                </Card>
                <Card
                  title="Mono"
                  tag={<Tag variant="emerald">No LiDAR required</Tag>}
                >
                  High-contrast grayscale feed optimized for low-light
                  environments and precision spatial scanning.
                </Card>
                <Card
                  title="Depth"
                  tag={<Tag variant="amber">LiDAR required</Tag>}
                >
                  <>
                    LiDAR depth visualization with <strong className="text-white">9 selectable
                    colormaps</strong> including thermal, incandescent, deep sea,
                    and visible spectrum.
                  </>
                </Card>
                <Card
                  title="Neural Depth"
                  tag={<Tag variant="emerald">No LiDAR required</Tag>}
                >
                  <>
                    AI-estimated depth from the regular camera feed via{" "}
                    <strong className="text-white">Depth Anything V2 Small</strong>{" "}
                    (ByteDance Research, packaged for Core ML by Apple),
                    running on the <strong className="text-white">Apple Neural
                    Engine</strong> at ~30 ms / frame. Same nine colormaps as
                    LiDAR Depth. Doubles as a fallback for NDI side-by-side
                    on non-LiDAR phones. Fully on-device; nothing leaves the
                    phone.
                  </>
                </Card>
                <Card
                  title="Point Cloud"
                  tag={<Tag variant="amber">LiDAR required</Tag>}
                >
                  <>
                    Real-time 3D point cloud rendered with true RGB colors. Every
                    pixel of the 256&times;192 depth map is unprojected into 3D
                    space. Configure frame window, max depth, and compute quality
                    in Settings.
                  </>
                </Card>
                <Card
                  title="Blob Track"
                  tag={<Tag variant="amber">LiDAR required</Tag>}
                >
                  <>
                    TouchDesigner-compatible blob tracker. Carves a configurable
                    depth slab out of the LiDAR scan, finds connected regions,
                    assigns each one a stable ID across frames, and streams
                    per-blob metadata over OSC at TD-matching addresses. The
                    full visualization (camera + outlines + ID labels) is
                    captured by NDI.
                  </>
                </Card>
                <Card
                  title="Transcription"
                  tag={<Tag variant="emerald">No LiDAR required</Tag>}
                >
                  <>
                    Live on-device speech-to-text with a mirrored bar waveform
                    visualization. Recognized words stream out over OSC, TCP,
                    UDP, and appear on screen as captions.
                  </>
                </Card>
                <Card
                  title="Motion"
                  tag={<Tag variant="emerald">No LiDAR required</Tag>}
                >
                  <>
                    Turns the iPhone into a wireless motion-sensor OSC source.
                    Streams accelerometer, gyroscope, compass heading, and
                    barometric pressure as per-axis OSC channels. Each active
                    value draws its own scrolling line graph on screen
                    (TouchDesigner CHOP viewer aesthetic), captured by NDI.
                  </>
                </Card>
                <Card
                  title="Audio"
                  tag={<Tag variant="emerald">No LiDAR required</Tag>}
                >
                  <>
                    Real-time microphone audio analysis using Apple&apos;s
                    Accelerate/vDSP framework. Streams frequency-band Levels,
                    per-band Beat Detection triggers, Dynamics bursts, and a
                    20-band FFT spectrum as OSC channels. Each active channel
                    renders as a scrolling graph lane, captured by NDI.
                  </>
                </Card>
              </div>

              <div className="mt-6 rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                <h3 className="text-sm font-semibold text-white mb-2">
                  Switching modes
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Tap the mode picker at the top of the screen and select a
                  cell from the panel, or say{" "}
                  <Kbd>switch to Depth</Kbd> with Voice Control enabled.
                  Switching is instant and does not interrupt an active stream.
                </p>
              </div>

              {/* ─── Neural Depth details ──────────────────── */}
              <div className="mt-10">
                <h3 className="text-xl font-bold text-white mb-2">
                  Neural Depth mode
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                  Select <Kbd>Neural Depth</Kbd> from the mode picker to
                  estimate depth from the regular camera feed using{" "}
                  <strong className="text-white">Depth Anything V2 Small</strong>{" "}
                  (ByteDance Research, packaged for Core ML by Apple, Apache
                  2.0, 24.8 M params). Inference runs entirely on the{" "}
                  <strong className="text-white">Apple Neural Engine</strong>{" "}
                  at roughly 30 ms per frame — nothing leaves the device.
                </p>

                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 mb-4">
                  <h4 className="text-sm font-semibold text-white mb-3">
                    Use Neural Depth when
                  </h4>
                  <ul className="text-sm text-zinc-400 space-y-2">
                    <li>
                      You&apos;re on a{" "}
                      <strong className="text-white">non-LiDAR iPhone</strong>{" "}
                      and want a depth visualization or NDI side-by-side feed
                    </li>
                    <li>
                      You want a{" "}
                      <strong className="text-white">comparison source</strong>{" "}
                      alongside LiDAR for testing or stylistic reasons
                    </li>
                    <li>
                      You need depth in conditions where{" "}
                      <strong className="text-white">LiDAR struggles</strong>{" "}
                      — very bright sunlight, very long range,
                      glass/reflective surfaces
                    </li>
                  </ul>
                </div>

                <Card title="First selection">
                  <>
                    A centered glass card appears explaining the model is
                    initializing. The first frame can take a moment as the
                    Neural Engine warms up; subsequent frames are real-time.
                    The card auto-fades when inference begins.
                  </>
                </Card>

                <div className="mt-4">
                  <Card title="Color map and About the Model">
                    <>
                      The same nine colormaps as LiDAR Depth are available
                      under <Kbd>Neural Depth Settings &rarr; Visualization</Kbd>.
                      The <strong className="text-white">About the Model</strong>{" "}
                      section credits ByteDance Research and Apple, confirms
                      inference runs fully on-device on the Neural Engine,
                      and links to the Hugging Face model page.
                    </>
                  </Card>
                </div>

                <div className="mt-4">
                  <Card title="NDI side-by-side fallback">
                    <>
                      Enabling NDI side-by-side on a phone{" "}
                      <strong className="text-white">without LiDAR</strong>{" "}
                      now composites the regular camera on the left and Depth
                      Anything V2 estimated depth on the right — the
                      side-by-side workflow is no longer LiDAR-only.
                    </>
                  </Card>
                </div>
              </div>

              {/* ─── Blob Track details ────────────────────── */}
              <div className="mt-10">
                <h3 className="text-xl font-bold text-white mb-2">
                  Blob Track mode
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                  Select <Kbd>Blob Track</Kbd> from the mode picker to turn
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
                      shown just below the status pill so operators can verify
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
                    Set in Blob Track Settings &rarr; Detection (tap the
                    <Kbd>Blob Track Settings</Kbd> button below the status bar).
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
                  Select <Kbd>Transcription</Kbd> from the mode picker to
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
                    Microphone and Speech Recognition permissions are
                    requested upfront on first launch (along with Camera and
                    Location), and the on-device speech model for your
                    language is prefetched in the background. By the time you
                    open this mode for the first time, transcription is
                    usually ready to go — no model-download wait. If you
                    denied either permission, the mode displays a message
                    with a shortcut to iOS Settings to grant access. If the
                    prefetch didn&apos;t finish or failed, the mode falls
                    back to downloading on first use.
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
                  Select <Kbd>Motion</Kbd> from the mode picker to turn the
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
                  Select <Kbd>Audio</Kbd> from the mode picker to turn the
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
              <SectionHeading tag="Network" title="Streaming and local recording">
                The middle page has an iOS Camera-style{" "}
                <strong className="text-white">shutter button</strong> at the
                bottom-center with a{" "}
                <strong className="text-white">STREAM | RECORD</strong>{" "}
                segmented control directly below it that picks which paradigm
                the shutter triggers. The two are mutually exclusive — while
                one is running the other is locked, so you can&apos;t
                accidentally start a recording mid-stream or vice versa.
                Configure transports by tapping the floating status bar pill
                at the top — this opens <strong className="text-white">Transmission
                Settings</strong>, a focused sheet with This Device (your
                iPhone&apos;s active IPs), Receiver, TCP/UDP, NDI, OSC, Point
                Cloud Stream, and Protocol Info sections. While streaming,
                the per-protocol chip in the status bar (OSC, NDI, TCP/UDP,
                PLY) goes from dim white to red, and a centered dim table at
                the bottom of the screen lists each active transmission with
                its <Kbd>&lt;host&gt;:&lt;port&gt;</Kbd> (and the NDI source
                name <Kbd>LOTA - &lt;deviceLabel&gt;</Kbd>), plus a footer
                line showing the iPhone&apos;s own active IPs (e.g.{" "}
                <Kbd>This iPhone: 192.168.1.42 (Wi-Fi)</Kbd>) so you can
                verify the entire wiring at a glance without opening the
                sheet.{" "}
                <strong className="text-white">In landscape</strong>, the
                shutter + segmented control stay pinned to the device&apos;s{" "}
                <em>physical</em> bottom edge (where they sit in portrait),
                matching iOS Camera&apos;s shutter behavior — rotate the
                phone and the island slides to the screen edge that now
                corresponds to that physical position. All other UI rotates
                naturally.
              </SectionHeading>

              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 mb-8">
                <h3 className="text-sm font-semibold text-white mb-3">
                  STREAM vs. RECORD
                </h3>
                <ul className="text-sm text-zinc-400 space-y-3">
                  <li>
                    <strong className="text-white">STREAM</strong> — taps the
                    shutter to start/stop network streaming. All enabled
                    transports (TCP/UDP, NDI, OSC, PLY) send simultaneously.
                  </li>
                  <li>
                    <strong className="text-white">RECORD</strong> — taps the
                    shutter to start/stop a{" "}
                    <strong className="text-white">local recording</strong>{" "}
                    of the live composited Metal output. Saved as an H.264{" "}
                    <Kbd>.mov</Kbd> to your Photos library on stop. Available
                    in every camera-using mode (Color, Mono, Depth, Neural
                    Depth, Point Cloud, Blob Track); disabled in Transcription /
                    Motion / Audio because there&apos;s no camera content to
                    capture. <strong className="text-white">4-hour cap</strong>{" "}
                    per recording. Uses <Kbd>PHPhotoLibrary</Kbd> add-only
                    access — LOTA can write videos but never read your
                    existing photos.
                  </li>
                </ul>
              </div>

              <div className="space-y-4 mb-8">
                <Card title="NDI">
                  <>
                    Industry-standard video-over-IP. LOTA broadcasts as{" "}
                    <Kbd>LOTA - &lt;Device Label&gt;</Kbd> (random 4-char ID
                    by default — e.g. <Kbd>LOTA - 7F3A</Kbd> — customizable
                    in the Receiver section to anything like{" "}
                    <Kbd>LOTA - Stage Left</Kbd>) and is auto-discovered by
                    TouchDesigner, OBS, vMix, Resolume, and any other
                    NDI-compatible receiver. Per-device labels mean multiple
                    LOTA phones in the same venue show up as distinct
                    sources. Optional side-by-side mode sends a 2x-wide frame
                    with camera view on the left and depth colormap on the
                    right — uses LiDAR depth on Pro phones and{" "}
                    <strong className="text-white">Depth Anything V2
                    estimated depth</strong> on non-LiDAR phones, so the
                    side-by-side workflow is no longer LiDAR-only.
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
                    Sends live point cloud frames over TCP in a fixed{" "}
                    <strong className="text-white">packed binary</strong>{" "}
                    format: <Kbd>UInt32 LE point count</Kbd> followed by{" "}
                    <Kbd>N × (3 Float32 XYZ + 3 UInt8 RGB)</Kbd> ={" "}
                    <strong className="text-white">15 bytes/point</strong>.
                    Default port <Kbd>9848</Kbd>. Pair with the{" "}
                    <Kbd>LOTABinaryPLYRecieverV2.tox</Kbd> drop-in
                    TouchDesigner component (section below) — plug-and-play.
                    The legacy CSV-text variant and its toggle were{" "}
                    <strong className="text-white">removed in v1.2.3</strong>;
                    binary is now the only supported wire format.
                  </>
                </Card>
              </div>

              <div className="space-y-5">
                <h3 className="text-sm font-semibold text-white">
                  How to start streaming
                </h3>
                <Step n={1} title="Open Transmission Settings (tap the status bar pill)">
                  Tap the floating status bar pill at the top of the screen.
                  Enable the protocols you need and set the destination IP
                  (shared across all transports) and port for each. NDI
                  requires no configuration.
                </Step>
                <Step n={2} title="Connect to the same Wi-Fi network">
                  LOTA and your receiving machine must be on the same local
                  network. A 5&nbsp;GHz network is recommended for lowest latency.
                </Step>
                <Step n={3} title="Set STREAM (bottom-center) and tap the shutter">
                  Make sure the segmented control under the shutter is on{" "}
                  <Kbd>STREAM</Kbd> (not <Kbd>RECORD</Kbd>), then tap the
                  shutter. All enabled protocols start simultaneously. The
                  status bar pill shows a red chip for each active protocol;
                  the bottom endpoint summary lists their <Kbd>host:port</Kbd>{" "}
                  destinations.
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
                  in Hands Settings &rarr; 3D Hand Coordinates (tap the
                  <Kbd>Hands Settings</Kbd> button below the status bar on the
                  ARKit Tracking page).
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
                      LOTABinaryPLYRecieverV2.tox — Binary Point Cloud Receiver
                    </h3>
                    <div className="text-sm text-zinc-400 leading-relaxed">
                      <p>
                        Drop-in TouchDesigner receiver for LOTA&apos;s binary
                        PLY stream. Auto-detects the binary header — only asks
                        for the receiver port and a Script TOP target. Uses
                        numpy bulk parsing and GPU instancing to handle 49K+
                        points at 60&nbsp;fps. Enable <Kbd>Binary Format</Kbd>{" "}
                        in Transmission Settings &rarr; Point Cloud Stream
                        (tap the floating status bar pill) and point this
                        component at the same port.
                      </p>
                    </div>
                  </div>
                  <a
                    href="/LOTABinaryPLYRecieverV2.tox"
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
                <Card title="Point cloud via LOTABinaryPLYRecieverV2.tox">
                  <>
                    <ol className="list-decimal list-inside space-y-1.5 mt-1">
                      <li>
                        Drop <Kbd>LOTABinaryPLYRecieverV2.tox</Kbd> into your
                        TouchDesigner network.
                      </li>
                      <li>
                        In LOTA, enable <Kbd>PLY Streaming</Kbd> and{" "}
                        <Kbd>Binary Format</Kbd> in Transmission Settings &rarr; Point Cloud
                        Stream and note the port.
                      </li>
                      <li>
                        On the component, set the receiver port to match and
                        wire its output Script TOP into your render network —
                        live 3D geometry is ready to instance.
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
                <Card title="Material (PBR)">
                  <>
                    Single-shot capture of a flat surface as a complete PBR
                    material set. ZIP contains <Kbd>basecolor.png</Kbd> (sRGB),{" "}
                    <Kbd>normal.png</Kbd>, <Kbd>height.png</Kbd> (16-bit),{" "}
                    <Kbd>ao.png</Kbd>, <Kbd>roughness.png</Kbd>,{" "}
                    <Kbd>preview.png</Kbd>, and a <Kbd>material.json</Kbd>{" "}
                    manifest with patch size and tiling hints. Drop into
                    Substance Designer/Painter, Blender, Unreal, Unity, or
                    TouchDesigner. Requires LiDAR.
                  </>
                </Card>
                <Card title="IMU Trace">
                  <>
                    Records device motion sensors (acceleration, gyroscope,
                    compass heading, barometric pressure / relative altitude)
                    over time. ZIP contains{" "}
                    <Kbd>recording.csv</Kbd> or <Kbd>.tsv</Kbd> (one row per
                    sample, first column <Kbd>t_seconds</Kbd>),{" "}
                    <Kbd>manifest.json</Kbd> describing every column, and{" "}
                    <Kbd>README.txt</Kbd>. Optional multi-page dark-theme PDF
                    report with per-channel charts (X/Y/Z lines, |A|
                    magnitude, compass polar rose, pressure & altitude) and a
                    statistics table.
                  </>
                </Card>
                <Card title="Audio Trace">
                  <>
                    Records audio analysis frames (bass/mid/high levels, drum
                    onsets, dynamics, 20-band FFT spectrum) over time using
                    the same mic engine as Audio mode. Same ZIP shape as IMU
                    Trace; optional PDF report with FFT spectrogram heatmap,
                    levels traces, beat-events timeline, dynamics burst, and
                    statistics. Works on every iPhone — no LiDAR.
                  </>
                </Card>
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 mb-8">
                <p className="text-sm text-zinc-400 leading-relaxed">
                  <strong className="text-white">ZIP naming:</strong> every
                  export ZIP is named{" "}
                  <Kbd>LOTA_&lt;timestamp&gt;_&lt;MODE&gt;.zip</Kbd> (e.g.{" "}
                  <Kbd>LOTA_2026-04-30_14-22-08_IMU.zip</Kbd>) so the format
                  is identifiable from the filename alone.
                </p>
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

              {/* ─── Material Capture ──────────────────────── */}
              <div className="mt-12">
                <h3 className="text-xl font-bold text-white mb-2">
                  Material Capture
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                  Select <Kbd>Material</Kbd> from the format picker to swap
                  the page from a recording flow to a plane-lock + shutter
                  flow. One tap, ~½-second bake on iPhone 15/16 Pro at
                  1024², ZIP saved to your iCloud folder. Requires LiDAR.
                </p>

                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 mb-4">
                  <h4 className="text-sm font-semibold text-white mb-3">
                    When to use Material vs the other formats
                  </h4>
                  <ul className="text-sm text-zinc-400 space-y-2">
                    <li>
                      <strong className="text-white">3D scan of an object
                      or room</strong> you can move around — use COLMAP,
                      Nerfstudio, or Point Cloud
                    </li>
                    <li>
                      <strong className="text-white">Tileable PBR texture
                      of a flat surface</strong> (floor, wall, table, fabric,
                      brick…) — use Material
                    </li>
                  </ul>
                </div>

                <div className="space-y-5 mb-8">
                  <Step n={1} title="Pick Material from the format picker">
                    The page swaps to the material-capture UI: status icon,
                    plane-status chip, Lock Plane action, and shutter button.
                  </Step>
                  <Step n={2} title="Pick an export folder">
                    Tap the folder icon (bottom left) to choose an iCloud Files
                    folder if you haven&apos;t already.
                  </Step>
                  <Step n={3} title="(Optional) Open Material Settings">
                    Adjust output resolution (512 / 1024 / 2048), AO sample
                    count (32 / 64 / 128), normal convention (OpenGL or
                    DirectX), delight strength, and roughness scale. All
                    persist via <Kbd>UserDefaults</Kbd>.
                  </Step>
                  <Step n={4} title="Point at a flat surface and tap Lock Plane">
                    ARKit raycast detects horizontal and vertical planes. Lock
                    Plane snaps a 20&nbsp;cm screen-aligned square patch
                    centered on what you&apos;re pointing at — output{" "}
                    &quot;top&quot; = away from camera, &quot;right&quot; =
                    camera&apos;s right.
                  </Step>
                  <Step n={5} title="Tap the shutter">
                    The torch fires a brief flash-pair sequence (~200&nbsp;ms),
                    autofocus locks for both grabs so they share the same
                    focal distance, then the bake runs (~220&nbsp;ms at 1024²
                    with 64 AO samples on iPhone 15/16 Pro).
                  </Step>
                  <Step n={6} title="Save to Files">
                    The Material Save Summary sheet shows a live PBR sphere
                    preview, file-size estimate, and a metallic toggle. Tap
                    Save: the ZIP is written to your iCloud folder, the sheet
                    auto-dismisses, and the plane lock stays active for the
                    next shot.
                  </Step>
                </div>

                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 mb-4">
                  <h4 className="text-sm font-semibold text-white mb-3">
                    Bake performance
                  </h4>
                  <p className="text-sm text-zinc-400 mb-3 leading-relaxed">
                    Measured on iPhone 15 / 16 Pro at 1024² output:
                  </p>
                  <ul className="text-sm text-zinc-400 space-y-1.5">
                    <li>AO 32 samples: ~150&nbsp;ms</li>
                    <li>AO 64 samples (default): ~220&nbsp;ms</li>
                    <li>AO 128 samples: ~400&nbsp;ms</li>
                    <li>2048² output: roughly 4× the time</li>
                  </ul>
                </div>

                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 mb-4">
                  <h4 className="text-sm font-semibold text-white mb-3">
                    What&apos;s in the ZIP
                  </h4>
                  <ul className="text-sm text-zinc-400 space-y-2">
                    <li>
                      <Kbd>basecolor.png</Kbd> — sRGB 8-bit albedo,
                      white-balanced and de-lit via flash-pair specular
                      subtraction
                    </li>
                    <li>
                      <Kbd>normal.png</Kbd> — linear 8-bit tangent-space
                      normal from the LiDAR depth gradient (OpenGL +Y up by
                      default; DirectX selectable in Material Settings)
                    </li>
                    <li>
                      <Kbd>height.png</Kbd> — linear{" "}
                      <strong className="text-white">16-bit</strong>,
                      plane-relative ±25&nbsp;mm range mapped to UInt16
                    </li>
                    <li>
                      <Kbd>ao.png</Kbd> — linear 8-bit horizon-based ambient
                      occlusion baked from the height map
                    </li>
                    <li>
                      <Kbd>roughness.png</Kbd> — linear 8-bit per-texel
                      estimate from flash-pair specular sharpness, multiplied
                      by your roughness scale slider
                    </li>
                    <li>
                      <Kbd>preview.png</Kbd> — sRGB 8-bit Cook-Torrance BRDF
                      sphere render of the captured material
                    </li>
                    <li>
                      <Kbd>material.json</Kbd> — manifest with{" "}
                      <Kbd>planeMeters</Kbd> (physical patch size),{" "}
                      <Kbd>tilingHintFor1mSquare</Kbd>, normal convention,
                      roughness method, metallic value, device hardware
                      identifier, LiDAR generation, capture date, and gyro
                      drift between flash pair
                    </li>
                  </ul>
                </div>

                <Card title="Receiver workflows">
                  <>
                    <ul className="space-y-1.5 mt-1">
                      <li>
                        <strong className="text-white">Substance
                        Designer</strong> — drop the unzipped folder onto a
                        new graph; Substance auto-creates a Material node
                        with all six channels wired
                      </li>
                      <li>
                        <strong className="text-white">Substance
                        Painter</strong> — drag the folder into Shelf →
                        Materials, then apply to a mesh
                      </li>
                      <li>
                        <strong className="text-white">Blender</strong> — in
                        the Shading editor, add an Image Texture per file
                        and wire to a Principled BSDF; set non-color spaces
                        on normal, roughness, ao, and height
                      </li>
                      <li>
                        <strong className="text-white">Unreal Engine</strong>{" "}
                        — drop the folder into the Content Browser → Unreal
                        auto-creates a Material Instance.{" "}
                        <em>Switch normal convention to DirectX in Material
                        Settings before capture</em> so the green channel
                        reads correctly
                      </li>
                      <li>
                        <strong className="text-white">Unity</strong> —
                        standard URP / HDRP Lit shader inputs map 1:1
                      </li>
                      <li>
                        <strong className="text-white">TouchDesigner</strong>{" "}
                        — load each PNG into a Movie File In TOP, wire to a
                        PBR MAT
                      </li>
                    </ul>
                  </>
                </Card>

                <div className="mt-4">
                  <Card title="Tips for best results">
                    <>
                      <ul className="space-y-1.5 mt-1">
                        <li>
                          <strong className="text-white">Hold the phone
                          still</strong> during the shutter tap — the
                          flash-pair takes ~200&nbsp;ms; the manifest&apos;s{" "}
                          <Kbd>gyroDriftRadians</Kbd> field surfaces how
                          much drift the bake saw (below 0.5&deg; / ~0.009 rad
                          is fine)
                        </li>
                        <li>
                          <strong className="text-white">Capture
                          distance</strong> — 20–60&nbsp;cm from the surface
                          gives the best detail-to-coverage ratio at the
                          default 20&nbsp;cm patch size
                        </li>
                        <li>
                          <strong className="text-white">Lighting</strong>{" "}
                          — ambient + the iPhone torch. Too-bright ambient
                          washes out the controlled flash signal that drives
                          the roughness estimate
                        </li>
                        <li>
                          <strong className="text-white">Best
                          surfaces</strong> — wood, fabric, leather, brick,
                          concrete, plaster, painted drywall, asphalt,
                          ceramic tile (matte), unpolished plastic, paper,
                          carpet, bark, stone — anything opaque, dielectric,
                          and roughly diffuse
                        </li>
                      </ul>
                    </>
                  </Card>
                </div>

                <div className="mt-4">
                  <Card title="Limitations & v1.2 caveats">
                    <>
                      <p className="mb-2">
                        Surfaces where the pipeline degrades or fails:
                        <strong className="text-white"> glass</strong>{" "}
                        (LiDAR passes through),{" "}
                        <strong className="text-white">mirrors and
                        chrome</strong> (captures the reflection, not the
                        surface),{" "}
                        <strong className="text-white">polished
                        metal</strong> (basecolor contaminated by
                        reflections),{" "}
                        <strong className="text-white">skin / wax /
                        translucent plastic</strong> (subsurface scattering
                        not modeled),{" "}
                        <strong className="text-white">velvet and
                        fur</strong> (anisotropic / sheen BRDFs not
                        modeled),{" "}
                        <strong className="text-white">wet
                        surfaces</strong> (captures the wet film).
                      </p>
                      <p className="mb-1">
                        <strong className="text-white">v1.2 caveats</strong>{" "}
                        (planned for v1.3+):
                      </p>
                      <ul className="space-y-1 text-zinc-500">
                        <li>
                          Metallic is a uniform toggle (manifest only) — no
                          per-texel <Kbd>metallic.png</Kbd>. v1.3 adds
                          CoreML SVBRDF inference
                        </li>
                        <li>
                          Roughness is a heuristic
                          (<Kbd>flashPairSpecularSharpness</Kbd>) — adjust
                          the roughness scale slider to bias the result
                        </li>
                        <li>
                          Framing rect is auto-installed at 20&nbsp;cm —
                          drag handles to resize / reposition land in v1.3
                        </li>
                        <li>
                          Single-shot only — multi-view capture for cleaner
                          albedo planned for v1.3
                        </li>
                      </ul>
                    </>
                  </Card>
                </div>
              </div>

              {/* ─── IMU / Audio Trace ─────────────────────── */}
              <div className="mt-12">
                <h3 className="text-xl font-bold text-white mb-2">
                  IMU Trace and Audio Trace
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                  Pick <Kbd>IMU Trace</Kbd> or <Kbd>Audio Trace</Kbd> from
                  the format picker to record sensor or audio analysis data
                  over time as a structured file you can hand to a data
                  science / motion / music workflow. The right page swaps to
                  the matching live visualization (the same scrolling lane
                  graphs as the middle page&apos;s Motion / Audio modes)
                  while the trace is being collected.
                </p>

                <div className="space-y-5 mb-8">
                  <Step n={1} title="Pick the format">
                    Tap <Kbd>IMU Trace</Kbd> or <Kbd>Audio Trace</Kbd> in the
                    format picker.
                  </Step>
                  <Step n={2} title="Set the export folder">
                    Tap the folder icon (bottom left) to choose an iCloud
                    Files folder if you haven&apos;t already.
                  </Step>
                  <Step n={3} title="Open IMU/Audio Trace Settings">
                    Choose which sensor channels to include, the file format
                    (<Kbd>CSV</Kbd> / <Kbd>TSV</Kbd>), whether to bundle a
                    PDF report, and an optional auto-stop duration cap
                    (5–600 s).
                  </Step>
                  <Step n={4} title="Tap the shutter to start">
                    Sample counter and elapsed timer update at 10 Hz. The
                    same scrolling lane visualization renders live so you
                    can confirm signal is coming through.
                  </Step>
                  <Step n={5} title="Tap again to stop (or let it auto-stop)">
                    Saves to your iCloud folder. A save-summary sheet shows
                    file size and sample count.
                  </Step>
                </div>

                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 mb-4">
                  <h4 className="text-sm font-semibold text-white mb-3">
                    What&apos;s in the ZIP
                  </h4>
                  <ul className="text-sm text-zinc-400 space-y-2">
                    <li>
                      <Kbd>recording.csv</Kbd> or <Kbd>.tsv</Kbd> — one row
                      per sample. First column is <Kbd>t_seconds</Kbd>; the
                      rest are described in the manifest
                    </li>
                    <li>
                      <Kbd>manifest.json</Kbd> — recording metadata (device,
                      version, timestamps, sample count, sample rate, stop
                      reason) plus a per-column dictionary (name, unit,
                      dtype, description). Device names are mapped from{" "}
                      <Kbd>sysctl</Kbd> hardware IDs to consumer names (e.g.{" "}
                      <Kbd>iPhone 17 Pro Max</Kbd>)
                    </li>
                    <li>
                      <Kbd>README.txt</Kbd> — one-paragraph human description
                      of the bundle layout
                    </li>
                    <li>
                      <Kbd>report.pdf</Kbd> (optional) — multi-page
                      dark-theme report with cover, per-channel charts, and
                      a statistics table
                    </li>
                  </ul>
                </div>

                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 mb-4">
                  <h4 className="text-sm font-semibold text-white mb-3">
                    PDF report contents
                  </h4>
                  <ul className="text-sm text-zinc-400 space-y-2">
                    <li>
                      <strong className="text-white">IMU Trace</strong> —
                      Cover · Accelerometer X/Y/Z line · |A| magnitude ·
                      Gyroscope X/Y/Z line · Compass heading polar rose (if
                      heading recorded) · Pressure &amp; altitude (if
                      pressure recorded) · Per-channel statistics
                    </li>
                    <li>
                      <strong className="text-white">Audio Trace</strong> —
                      Cover · FFT spectrogram (20 bands × time, viridis
                      heatmap) · Bass/Mid/High levels · Beat events timeline
                      (per band) · Dynamics burst trace · Per-channel
                      statistics
                    </li>
                  </ul>
                  <p className="text-sm text-zinc-500 leading-relaxed mt-3">
                    Charts that have no data to plot show a centered{" "}
                    <em>&quot;No data captured&quot;</em> placeholder so the
                    recipient can tell an empty page is intentional, not
                    broken (typical for an Audio Trace recorded in a silent
                    room — the FFT charts populate, the beat-events page
                    shows the placeholder).
                  </p>
                </div>

                <Card title="When to use these">
                  <>
                    <ul className="space-y-1.5 mt-1">
                      <li>
                        Capture a short walk to plot device motion against
                        ground-truth GPS in a Jupyter notebook
                      </li>
                      <li>
                        Record a song through the mic to extract beat onsets
                        for an Ableton MIDI workflow
                      </li>
                      <li>
                        Sample IMU data from a moving rig and ship it to
                        TouchDesigner / Blender as a baked animation source
                      </li>
                      <li>
                        Build a training dataset for sensor-fusion or
                        audio-classification models
                      </li>
                    </ul>
                  </>
                </Card>
              </div>
            </section>

            {/* ─── Settings ───────────────────────────────── */}
            <section
              id="settings"
              ref={(el) => { sectionRefs.current["settings"] = el; }}
            >
              <SectionHeading tag="Configuration" title="Settings Reference">
                Settings are split into focused sheets reachable from two
                places: <strong className="text-white">Transmission
                Settings</strong> (tap the floating status bar pill at the top
                of the Camera / Streaming or ARKit Tracking page — Receiver,
                Transport, NDI, OSC, Point Cloud Stream, Protocol Info, a
                Help section with <Kbd>Replay Tutorial</Kbd>, and an
                Acknowledgements section listing third-party SDK notices)
                and{" "}
                <strong className="text-white">mode-specific settings</strong>{" "}
                (tap the <Kbd>&lt;Mode&gt; Settings</Kbd> button just below
                the status bar — only the section relevant to the active mode).
                Color and Mono have no per-mode settings, so no button is shown.
                The receiver IP is shared across all transports. The reference
                below documents every setting; the headings indicate which
                sheet hosts each section.
              </SectionHeading>

              <div className="space-y-4">
                <SettingsGroup title="This Device — Transmission Settings (top of sheet)">
                  <Setting name="Active IPv4 addresses" defaultValue="live, read-only">
                    Pinned to the top of Transmission Settings. Lists the
                    iPhone&apos;s currently active IPv4 addresses with
                    friendly interface labels: <strong className="text-white">Wi-Fi</strong>{" "}
                    (joined to a network), <strong className="text-white">USB Hotspot</strong>{" "}
                    (Personal Hotspot enabled while plugged into a Mac via
                    USB — e.g. <Kbd>172.20.10.1</Kbd>), <strong className="text-white">Ethernet</strong>{" "}
                    (USB-Ethernet adapter for multi-device wired rigs).{" "}
                    <strong className="text-white">Tap any row to copy</strong>{" "}
                    the address with a haptic + brief &quot;Copied&quot; chip.
                    The list updates live as you toggle Personal Hotspot,
                    plug in / unplug USB-Ethernet, or join / leave Wi-Fi —
                    no need to re-open the sheet. These are the iPhone&apos;s{" "}
                    <em>own</em> addresses, shown to help you set the right
                    Receiver IP <em>on your computer</em>; not values to paste
                    into LOTA&apos;s Receiver IP field.
                  </Setting>
                </SettingsGroup>

                <SettingsGroup title="Receiver — Transmission Settings">
                  <Setting name="Receiver IP" defaultValue="192.168.1.100">
                    IP address of the computer receiving streams. Shared across
                    all transports (TCP, UDP, OSC, PLY).
                  </Setting>
                  <Setting name="Device Label" defaultValue="random 4-char ID (e.g. 7F3A)">
                    4–20 character ID used to build the NDI broadcast name{" "}
                    <Kbd>LOTA - &lt;label&gt;</Kbd>. Random base36 default on
                    first launch (e.g. <Kbd>LOTA - 7F3A</Kbd>); customizable
                    to anything memorable like <Kbd>Stage Left</Kbd>,{" "}
                    <Kbd>FOH</Kbd>, or <Kbd>Front Camera</Kbd>. Persists
                    across launches. Critical for multi-device venues so each
                    LOTA phone is distinguishable in TouchDesigner / OBS /
                    NDI Studio Monitor. Changes take effect within ~1 s — no
                    need to stop and restart streaming.
                  </Setting>
                </SettingsGroup>

                <SettingsGroup title="Transport (TCP/UDP) — Transmission Settings">
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

                <SettingsGroup title="NDI — Transmission Settings">
                  <Setting name="NDI Video Output" defaultValue="Off">
                    Enable or disable NDI streaming. Auto-broadcasts as{" "}
                    <Kbd>LOTA - &lt;Device Label&gt;</Kbd> (default{" "}
                    <Kbd>LOTA - &lt;random 4-char ID&gt;</Kbd>, customizable
                    in the Receiver section). Multiple LOTA devices on the
                    same network show up as distinct sources thanks to
                    per-device labels.
                  </Setting>
                  <Setting name="Side-by-Side" defaultValue="Off">
                    Sends a 2x-wide frame: left half is the camera view,
                    right half is the depth colormap. Uses LiDAR depth on
                    Pro phones; falls back to{" "}
                    <strong className="text-white">Depth Anything V2
                    estimated depth</strong> on non-LiDAR phones, so the
                    side-by-side workflow is no longer LiDAR-only. Disabled
                    on Transcription / Motion / Audio modes (no camera
                    content to composite) with a one-line caption explaining
                    why.
                  </Setting>
                </SettingsGroup>

                <SettingsGroup title="OSC — Transmission Settings">
                  <Setting name="OSC Output" defaultValue="Off">
                    Enable or disable OSC messages.
                  </Setting>
                  <Setting name="Port" defaultValue="9000">
                    OSC destination port.
                  </Setting>
                </SettingsGroup>

                <SettingsGroup title="Acknowledgements — Transmission Settings (bottom of sheet)">
                  <Setting name="NDI® trademark notice" defaultValue="static">
                    Pinned to the bottom of Transmission Settings, below
                    Help &rarr; Replay Tutorial. Reads{" "}
                    <em>NDI® is a registered trademark of Vizrt NDI AB.</em>{" "}
                    with a link to{" "}
                    <a
                      href="https://ndi.video"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-300 underline underline-offset-2 hover:text-white transition-colors"
                    >
                      ndi.video
                    </a>
                    . Required attribution for the NDI SDK that ships
                    inside LOTA.
                  </Setting>
                </SettingsGroup>

                <SettingsGroup title="Depth — Depth Settings sheet">
                  <Setting name="Color Map" defaultValue="Visible Spectrum">
                    Colormap for depth visualization. Options: Black &amp; White,
                    Black Aqua White, Blue Red, Deep Sea, Color Spectrum,
                    Incandescent, Heated Metal, Sunrise, Visible Spectrum.
                  </Setting>
                </SettingsGroup>

                <SettingsGroup title="Neural Depth — Neural Depth Settings sheet">
                  <Setting name="Color Map" defaultValue="Visible Spectrum">
                    Colormap for AI-estimated depth visualization. Same nine
                    options as LiDAR Depth.
                  </Setting>
                  <div className="pt-2 text-xs text-zinc-500 leading-relaxed">
                    <strong className="text-white">About the Model</strong>{" "}
                    section credits ByteDance Research (model authors) and
                    Apple (Core ML packaging), confirms inference runs on the
                    Apple Neural Engine at ~30 ms / frame, and links to the
                    Hugging Face model page.{" "}
                    <strong className="text-white">Apache 2.0;</strong>{" "}
                    nothing leaves the device.
                  </div>
                </SettingsGroup>

                <SettingsGroup title="Point Cloud — Point Cloud Settings sheet">
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

                <SettingsGroup title="Blob Tracking — Detection (Blob Track Settings sheet)">
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

                <SettingsGroup title="Blob Tracking — Depth (Blob Track Settings sheet)">
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

                <SettingsGroup title="Blob Tracking — Constraints (Blob Track Settings sheet)">
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

                <SettingsGroup title="Blob Tracking — Revival (Blob Track Settings sheet)">
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

                <SettingsGroup title="Point Cloud Stream (PLY) — Transmission Settings">
                  <Setting name="PLY Streaming" defaultValue="Off">
                    Enable or disable live point cloud TCP stream.
                  </Setting>
                  <Setting name="Port" defaultValue="9848">
                    PLY stream destination port.
                  </Setting>
                  <div className="pt-2 text-xs text-zinc-500 leading-relaxed">
                    <strong className="text-white">Wire format (binary, fixed):</strong>{" "}
                    <Kbd>UInt32 LE point count</Kbd> followed by{" "}
                    <Kbd>N × (3 Float32 XYZ + 3 UInt8 RGB)</Kbd> = 15 bytes
                    per point. Drop in{" "}
                    <Kbd>LOTABinaryPLYRecieverV2.tox</Kbd> from the
                    TouchDesigner section above — plug-and-play. The CSV-text
                    variant and its toggle were removed in v1.2.3; binary is
                    the only supported wire format. Custom receivers built
                    against the legacy CSV stream will need to switch to the
                    binary parser.
                  </div>
                </SettingsGroup>

                <SettingsGroup title="Tracking — Body / Face / Hands Settings sheets">
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

                <SettingsGroup title="Transcription — Transcription Settings sheet">
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

                <SettingsGroup title="Device Motion — Motion Settings sheet">
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

                <SettingsGroup title="Audio Analysis — Audio Settings sheet">
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
                  Point Cloud, Blob Track, Gaussian Capture, Material Capture,
                  3D hand coordinates) require iPhone 12 Pro or later. Color,
                  Mono, <strong className="text-white">Neural Depth</strong>{" "}
                  (Depth Anything V2 on the Apple Neural Engine),
                  Transcription, Motion, and Audio modes, NDI streaming, and
                  TCP/UDP streaming all work on iPhones without LiDAR — and
                  Neural Depth doubles as the side-by-side NDI fallback so
                  multi-pane workflows work on any iPhone. Face tracking
                  requires TrueDepth camera (iPhone X or later). Body
                  tracking requires A12 chip or later.{" "}
                  <strong className="text-white">LOTA is officially
                  iPhone-only.</strong>{" "}
                  iPad Pro models with LiDAR have run successfully during
                  beta testing, but iPad is not an officially supported
                  target — your mileage may vary.
                </Faq>
                <Faq q="Does Transcription mode need internet access?">
                  No. Transcription uses iOS 26&apos;s on-device
                  {" "}<Kbd>SpeechAnalyzer</Kbd> framework and runs entirely
                  offline. After you grant Speech Recognition permission on
                  first launch, LOTA prefetches the on-device speech model for
                  your locale in the background — by the time you open
                  Transcription mode the model is on disk, so first captions
                  arrive without a download wait. If the prefetch didn&apos;t
                  finish, the model installs lazily on first use as a
                  fallback. Audio never leaves your device.
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
