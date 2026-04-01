/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const sections = [
  { id: "getting-started", label: "Getting Started" },
  { id: "capture-modes", label: "Capture Modes" },
  { id: "streaming", label: "Streaming" },
  { id: "touchdesigner", label: "TouchDesigner" },
  { id: "export", label: "Export & 3D" },
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
          <div className="max-w-3xl">
            {/* ─── Getting Started ─────────────────────────── */}
            <section
              id="getting-started"
              ref={(el) => { sectionRefs.current["getting-started"] = el; }}
            >
              <SectionHeading tag="Introduction" title="Getting Started">
                LOTA turns your iPhone&apos;s LiDAR sensor into a professional
                spatial capture tool. Stream depth, color, and point cloud data
                over the network in real time — no extra hardware required.
              </SectionHeading>

              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 mb-8">
                <h3 className="text-sm font-semibold text-white mb-3">
                  Requirements
                </h3>
                <ul className="text-sm text-zinc-400 space-y-1.5">
                  <li>• iPhone 12 Pro or later (any model with a LiDAR sensor)</li>
                  <li>• iOS 17.0 or later</li>
                  <li>• Wi-Fi network (for streaming features)</li>
                </ul>
              </div>

              <div className="space-y-5">
                <Step n={1} title="Install LOTA">
                  Download LOTA from the App Store. Open the app and grant camera
                  and local network permissions when prompted.
                </Step>
                <Step n={2} title="Choose a capture mode">
                  Tap the mode selector at the bottom of the screen to switch
                  between Color, Monochrome, Depth, or Point Cloud. Each mode
                  activates instantly — no restart required.
                </Step>
                <Step n={3} title="Start streaming or recording">
                  Tap the stream button to broadcast over the network, or tap
                  record to save a capture locally. Both can run simultaneously.
                </Step>
              </div>
            </section>

            {/* ─── Capture Modes ───────────────────────────── */}
            <section
              id="capture-modes"
              ref={(el) => { sectionRefs.current["capture-modes"] = el; }}
            >
              <SectionHeading tag="Capture" title="Capture Modes">
                LOTA provides four distinct capture modes. Switch between them in
                real time — every mode leverages the LiDAR sensor and full camera
                array.
              </SectionHeading>

              <div className="grid gap-4 sm:grid-cols-2">
                <Card title="Color">
                  Live RGB camera feed at 60&nbsp;FPS with real-time LiDAR depth
                  fusion. What you see on screen is exactly what gets streamed or
                  recorded.
                </Card>
                <Card title="Monochrome">
                  High-contrast grayscale feed optimized for low-light
                  environments and precision spatial scanning.
                </Card>
                <Card title="Depth">
                  <>
                    LiDAR depth visualization with <strong className="text-white">9 selectable
                    colormaps</strong> including thermal, incandescent, and deep
                    sea. Tap the colormap picker to cycle through them in real
                    time.
                  </>
                </Card>
                <Card title="Point Cloud">
                  <>
                    Real-time 3D point cloud rendered with true RGB colors.
                    Configure the frame window and point density up
                    to <strong className="text-white">12,500 points per frame</strong>.
                    Pinch to zoom and drag to orbit the cloud.
                  </>
                </Card>
              </div>

              <div className="mt-6 rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                <h3 className="text-sm font-semibold text-white mb-2">
                  Switching modes
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Use the mode selector at the bottom of the screen, or
                  say <Kbd>switch to Depth</Kbd> with Voice Control enabled.
                  Switching is instant and does not interrupt an active stream.
                </p>
              </div>
            </section>

            {/* ─── Streaming ───────────────────────────────── */}
            <section
              id="streaming"
              ref={(el) => { sectionRefs.current["streaming"] = el; }}
            >
              <SectionHeading tag="Network" title="Streaming">
                Send LiDAR depth, color, point cloud, and camera tracking data
                over the network in real time. Four protocols, all independently
                configurable, all running simultaneously.
              </SectionHeading>

              <div className="space-y-4 mb-8">
                <Card title="NDI">
                  Industry-standard video-over-IP. LOTA appears as an NDI source
                  on your network and is auto-discovered by TouchDesigner, OBS,
                  vMix, Resolume, and any other NDI-compatible receiver. No IP
                  configuration needed.
                </Card>
                <Card title="TCP / UDP">
                  <>
                    Streams H.264-encoded video for Color and Monochrome modes,
                    and raw <Kbd>Float32</Kbd> depth maps for Depth and Point
                    Cloud modes. Set the destination host and port in Settings
                    → Streaming.
                  </>
                </Card>
                <Card title="OSC">
                  <>
                    Streams real-time camera position, rotation, and euler angles
                    at <strong className="text-white">30&nbsp;Hz</strong> over
                    UDP. Point any OSC-capable tool (TouchDesigner, Max/MSP,
                    Ableton) at LOTA&apos;s IP and port to receive tracking data.
                  </>
                </Card>
                <Card title="PLY (live)">
                  <>
                    Sends live point cloud frames as CSV data over a TCP/IP
                    connection. Designed for TouchDesigner&apos;s <Kbd>TCP/IP
                    DAT</Kbd> — connect, and point cloud data starts flowing
                    frame by frame.
                  </>
                </Card>
              </div>

              <div className="space-y-5">
                <h3 className="text-sm font-semibold text-white">
                  How to start streaming
                </h3>
                <Step n={1} title="Open Settings → Streaming">
                  Enable the protocols you need and set the destination IP and
                  port for TCP, UDP, and OSC. NDI requires no configuration.
                </Step>
                <Step n={2} title="Connect to the same Wi-Fi network">
                  LOTA and your receiving machine must be on the same local
                  network. A 5&nbsp;GHz network is recommended for lowest latency.
                </Step>
                <Step n={3} title="Tap Stream">
                  All enabled protocols start simultaneously. The status bar
                  shows a live indicator for each active protocol.
                </Step>
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
                Capture posed camera frames with ARKit intrinsics, extrinsics,
                and LiDAR point clouds. Export data ready for training, viewing,
                or post-production.
              </SectionHeading>

              <div className="space-y-4 mb-8">
                <Card title="COLMAP-compatible export">
                  <>
                    Exports <Kbd>cameras.bin</Kbd>, <Kbd>images.bin</Kbd>,
                    and <Kbd>points3D.bin</Kbd> in COLMAP binary format.
                    Compatible with OpenSplat, Nerfstudio, and gsplat for
                    training Gaussian Splats and NeRFs directly from your
                    iPhone captures.
                  </>
                </Card>
                <Card title="PLY point cloud export">
                  <>
                    Standalone PLY files with unlimited point accumulation across
                    your entire session. Open in Blender, CloudCompare, MeshLab,
                    or any tool that reads PLY.
                  </>
                </Card>
                <Card title="iCloud sync">
                  Choose an export folder in Settings and captures sync
                  automatically to iCloud. Access your captures from any device.
                </Card>
              </div>

              <div className="space-y-5">
                <h3 className="text-sm font-semibold text-white">
                  Export workflow
                </h3>
                <Step n={1} title="Record a capture session">
                  Tap record while in any capture mode. Move slowly around the
                  subject for best coverage — LOTA tracks camera pose
                  automatically via ARKit.
                </Step>
                <Step n={2} title="Open the export panel">
                  Stop recording and open the export panel. Choose between
                  COLMAP dataset or standalone PLY.
                </Step>
                <Step n={3} title="Export and share">
                  Exported files are saved to your chosen folder (or the Files
                  app). If iCloud sync is enabled, they appear on your Mac
                  automatically.
                </Step>
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
                  Any iPhone with a LiDAR sensor — iPhone 12 Pro, 13 Pro,
                  14 Pro, 15 Pro, 16 Pro, and their Max variants. iPad Pro models
                  with LiDAR are also supported.
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
                <Faq q="How do I use the COLMAP export with Gaussian Splat training?">
                  Export a COLMAP dataset from LOTA, transfer it to your
                  training machine, and point OpenSplat, Nerfstudio, or gsplat at
                  the exported folder. The binary files are in the exact format
                  these tools expect.
                </Faq>
                <Faq q="Is there a latency cost to streaming?">
                  NDI and TCP/UDP streams typically add 1–3 frames of latency
                  depending on your network. OSC tracking data arrives at
                  30&nbsp;Hz with sub-frame latency. A wired connection or
                  5&nbsp;GHz Wi-Fi keeps things as fast as possible.
                </Faq>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
