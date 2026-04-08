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
                  <li>• iPhone 12 Pro or later (LiDAR required for Depth, Point Cloud, and Gaussian Capture)</li>
                  <li>• Color, Mono, and Transcription modes work on all iPhones</li>
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
                  between Color, Mono, Depth, Point Cloud, or Transcription.
                  Each mode activates instantly — no restart required.
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
                  The main page. Live camera feed with five capture modes (Color,
                  Mono, Depth, Point Cloud, Transcription) and streaming controls.
                  Tap the mode dropdown at the top to switch modes. Settings gear
                  icon is bottom left, streaming toggle is bottom right.
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
                LOTA provides five distinct capture modes on the Camera /
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
                <Card title="Transcription">
                  <>
                    Live on-device speech-to-text with a mirrored bar waveform
                    visualization. Recognized words stream out over OSC, TCP,
                    UDP, and appear on screen as captions. Works on every
                    iPhone — <strong className="text-white">no LiDAR required</strong>.
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
                <Faq q="Can I stream and record at the same time?">
                  Yes. Streaming and recording are independent — you can run both
                  simultaneously without any performance impact.
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
