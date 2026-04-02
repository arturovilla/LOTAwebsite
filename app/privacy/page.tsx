/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

/* ── reusable pieces ─────────────────────────────────────────── */

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
    <div className="mb-6">
      <p className="text-xs font-mono text-zinc-600 uppercase tracking-[0.2em] mb-2">
        {tag}
      </p>
      <h2 className="text-xl sm:text-2xl font-bold text-white">{title}</h2>
      {children && (
        <p className="text-zinc-400 mt-3 leading-relaxed">{children}</p>
      )}
    </div>
  );
}

/* ── page ─────────────────────────────────────────────────────── */

export default function PrivacyPage() {
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
            <span className="hidden sm:inline text-sm text-zinc-400">
              Privacy
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/docs"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Docs
            </Link>
            <Link
              href="/"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Home
            </Link>
          </div>
        </div>
      </header>

      {/* ── content ─────────────────────────────────────────── */}
      <main className="max-w-3xl mx-auto px-6 md:px-12 py-16">
        <div className="mb-16">
          <p className="text-xs font-mono text-zinc-600 uppercase tracking-[0.2em] mb-2">
            Legal
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Privacy Policy
          </h1>
          <p className="text-zinc-400 leading-relaxed">
            Effective April 1, 2026
          </p>
        </div>

        <div className="space-y-16">
          {/* ── Overview ─────────────────────────────────────── */}
          <section>
            <SectionHeading tag="Overview" title="The Short Version">
              LOTA does not collect, store, or transmit any personal data to
              remote servers. All sensor data is processed entirely on your
              device. Data only leaves your iPhone when you choose to stream it
              over your own local network or export it to your own iCloud
              storage.
            </SectionHeading>
          </section>

          {/* ── On-Device Processing ─────────────────────────── */}
          <section>
            <SectionHeading tag="App" title="On-Device Processing" />
            <div className="space-y-4 text-sm text-zinc-400 leading-relaxed">
              <p>
                LOTA accesses your iPhone&apos;s camera, LiDAR sensor, and
                motion sensors to capture spatial data. This includes RGB video
                frames, LiDAR depth maps, 3D point clouds, ARKit camera
                tracking, body skeleton data (91 joints), and facial blend
                shapes (52 parameters).
              </p>
              <p>
                All of this data is processed on-device using Apple&apos;s ARKit
                framework. None of it is sent to LOTA&apos;s servers, any
                third-party servers, or any remote endpoint of any kind.
              </p>
            </div>
          </section>

          {/* ── Face & Body Tracking ─────────────────────────── */}
          <section>
            <SectionHeading tag="Biometric Data" title="Face & Body Tracking" />
            <div className="space-y-4 text-sm text-zinc-400 leading-relaxed">
              <p>
                LOTA uses ARKit to perform real-time face tracking (52 facial
                blend shapes) and body tracking (91 skeleton joints). This data
                may be considered biometric under certain privacy laws.
              </p>
              <p>
                This data is processed entirely on your device by Apple&apos;s
                ARKit framework. It is never sent to any remote server. If you
                enable local network streaming, face and body tracking data is
                sent only to destinations you explicitly configure on your own
                local network via OSC.
              </p>
              <p>
                LOTA does not store, retain, or have access to any face or body
                tracking data after it is processed.
              </p>
            </div>
          </section>

          {/* ── Local Network Streaming ──────────────────────── */}
          <section>
            <SectionHeading tag="Network" title="Local Network Streaming" />
            <div className="space-y-4 text-sm text-zinc-400 leading-relaxed">
              <p>
                When you enable streaming, LOTA sends data over your local
                Wi-Fi network using the protocols you configure: NDI, TCP, UDP,
                OSC, and PLY. All streams are sent directly to IP addresses and
                ports that you set in the app.
              </p>
              <p>
                No data is routed through external servers or relays. Streaming
                requires both devices to be on the same local network.
              </p>
            </div>
          </section>

          {/* ── NDI SDK ──────────────────────────────────────── */}
          <section>
            <SectionHeading tag="Third-Party" title="NDI SDK" />
            <div className="space-y-4 text-sm text-zinc-400 leading-relaxed">
              <p>
                LOTA embeds the NDI SDK by Vizrt NDI AB for local network video
                streaming. The NDI SDK facilitates device discovery via mDNS and
                video transport over your local network. Based on NDI&apos;s SDK
                license agreement and documentation, the SDK library does not
                contain telemetry or make connections to external servers.
              </p>
              <p>
                NDI is a registered trademark of Vizrt NDI AB.{" "}
                <a
                  href="https://ndi.video"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-300 underline underline-offset-2 hover:text-white transition-colors"
                >
                  ndi.video
                </a>
              </p>
            </div>
          </section>

          {/* ── iCloud Export ─────────────────────────────────── */}
          <section>
            <SectionHeading tag="Storage" title="iCloud Export" />
            <div className="space-y-4 text-sm text-zinc-400 leading-relaxed">
              <p>
                When you export captures (COLMAP datasets, PLY point clouds),
                files are saved to a folder you select on your device or in your
                iCloud Drive. These files are stored in your own Apple iCloud
                account. LOTA does not have access to your iCloud data.
              </p>
            </div>
          </section>

          {/* ── No Analytics ─────────────────────────────────── */}
          <section>
            <SectionHeading tag="Analytics" title="No App Analytics" />
            <div className="space-y-4 text-sm text-zinc-400 leading-relaxed">
              <p>
                LOTA does not include any analytics, crash reporting, or usage
                tracking in the app. There are no user accounts. No data about
                how you use the app is collected or transmitted.
              </p>
            </div>
          </section>

          {/* ── Website ──────────────────────────────────────── */}
          <section>
            <SectionHeading tag="Website" title="lidarota.app" />
            <div className="space-y-4 text-sm text-zinc-400 leading-relaxed">
              <p>
                The LOTA website uses{" "}
                <a
                  href="https://vercel.com/analytics"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-300 underline underline-offset-2 hover:text-white transition-colors"
                >
                  Vercel Analytics
                </a>{" "}
                to collect anonymous, aggregated page view metrics. No cookies
                are used and no personally identifiable information is collected
                through analytics.
              </p>
              <p>
                If you subscribe to the newsletter, your email address is stored
                by{" "}
                <a
                  href="https://resend.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-300 underline underline-offset-2 hover:text-white transition-colors"
                >
                  Resend
                </a>{" "}
                and used solely to send product updates about LOTA. Your email
                is not shared with or sold to third parties. You can unsubscribe
                at any time.
              </p>
            </div>
          </section>

          {/* ── Children's Privacy ────────────────────────────── */}
          <section>
            <SectionHeading tag="Children" title="Children&apos;s Privacy" />
            <div className="space-y-4 text-sm text-zinc-400 leading-relaxed">
              <p>
                LOTA is not directed at children under the age of 13 and does
                not knowingly collect personal information from children.
              </p>
            </div>
          </section>

          {/* ── Changes ──────────────────────────────────────── */}
          <section>
            <SectionHeading tag="Updates" title="Changes to This Policy" />
            <div className="space-y-4 text-sm text-zinc-400 leading-relaxed">
              <p>
                If this privacy policy changes, the updated version will be
                posted on this page with a revised effective date.
              </p>
            </div>
          </section>

          {/* ── Contact ──────────────────────────────────────── */}
          <section>
            <SectionHeading tag="Contact" title="Contact" />
            <div className="space-y-4 text-sm text-zinc-400 leading-relaxed">
              <p>
                If you have questions about this privacy policy or how LOTA
                handles your data, contact:
              </p>
              <p>
                Arturo Villalobos
                <br />
                <a
                  href="mailto:privacy@lidarota.app"
                  className="text-zinc-300 underline underline-offset-2 hover:text-white transition-colors"
                >
                  privacy@lidarota.app
                </a>
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
