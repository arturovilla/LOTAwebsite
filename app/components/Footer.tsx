export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-black">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Logo + tagline */}
          <div>
            <span className="text-xl font-bold text-white tracking-tight">
              LOTA
            </span>
            <p className="text-sm text-zinc-500 mt-2 leading-relaxed">
              LiDAR Over the Air.
              <br />
              Capture, stream, and export 3D spatial data from your iPhone.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono text-zinc-600 uppercase tracking-wider mb-1">
              Navigate
            </span>
            <a
              href="#features"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Features
            </a>
            <a
              href="#export"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Gaussian Splat Export
            </a>
            <a
              href="#streaming"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Streaming
            </a>
          </div>

          {/* CTA */}
          <div className="flex flex-col items-start md:items-end gap-3">
            <a
              href="#"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-orange-500 text-white rounded-full font-semibold text-sm hover:bg-orange-400 transition-colors"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              App Store
            </a>
            <p className="text-xs text-zinc-600">
              &copy; {new Date().getFullYear()} LOTA. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
