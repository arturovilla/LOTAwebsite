import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-black">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
          {/* Logo + tagline */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <Image
                src="/LOTA-dark.jpg"
                alt="LOTA"
                width={28}
                height={28}
                className="rounded-lg"
              />
              <span className="text-lg font-semibold text-white tracking-tight">
                LOTA
              </span>
            </div>
            <p className="text-sm text-zinc-600 leading-relaxed">
              LiDAR Over the Air.
              <br />
              Professional spatial capture from your iPhone.
            </p>
            <p className="text-sm text-zinc-600 mt-3">
              Created by{" "}
              <a
                href="https://www.rtvro.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-white transition-colors"
              >
                Arturo Villalobos
              </a>
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-2.5">
            <span className="text-xs font-mono text-zinc-700 uppercase tracking-[0.15em] mb-1">
              Navigate
            </span>
            <a href="#features" className="text-sm text-zinc-500 hover:text-white transition-colors">
              Capture Modes
            </a>
            <a href="#streaming" className="text-sm text-zinc-500 hover:text-white transition-colors">
              Streaming
            </a>
            <a href="#export" className="text-sm text-zinc-500 hover:text-white transition-colors">
              Export
            </a>
          </div>

          {/* CTA */}
          <div className="flex flex-col items-start md:items-end gap-4">
            <span
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-white/10 text-zinc-300 border border-white/[0.1] rounded-full font-semibold text-sm cursor-default"
            >
              Coming Soon
            </span>
            <p className="text-xs text-zinc-700">
              &copy; {new Date().getFullYear()} LOTA. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
