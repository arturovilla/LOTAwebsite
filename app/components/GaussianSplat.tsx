import Image from "next/image";

const stats = [
  { value: "238", label: "Frames" },
  { value: "2.9M", label: "Points" },
  { value: "iCloud", label: "Sync" },
];

export default function GaussianSplat() {
  return (
    <section id="export" className="py-24 px-6 bg-black">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Phone mockup */}
          <div className="flex justify-center">
            <Image
              src="/LOATAAssests.jpg"
              alt="LOTA Gaussian Splat export screen"
              width={320}
              height={640}
              className="rounded-2xl shadow-2xl shadow-orange-500/10"
            />
          </div>

          {/* Content */}
          <div>
            <p className="text-sm font-mono text-orange-500 uppercase tracking-widest mb-3">
              3D Export
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Export Gaussian Splats
            </h2>
            <p className="text-zinc-400 mt-4 leading-relaxed">
              Capture full Gaussian splat datasets directly on your iPhone.
              LOTA processes LiDAR frames into dense point clouds and
              automatically saves completed captures to iCloud for seamless
              access across your devices.
            </p>

            {/* Stats */}
            <div className="flex gap-8 mt-8">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl sm:text-3xl font-bold gradient-text">
                    {stat.value}
                  </div>
                  <div className="text-xs font-mono text-zinc-500 uppercase tracking-wider mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="px-3 py-1 text-xs font-mono rounded-full bg-zinc-900 text-zinc-400 border border-zinc-800">
                Gaussian Splat
              </span>
              <span className="px-3 py-1 text-xs font-mono rounded-full bg-zinc-900 text-zinc-400 border border-zinc-800">
                Point Cloud
              </span>
              <span className="px-3 py-1 text-xs font-mono rounded-full bg-zinc-900 text-zinc-400 border border-zinc-800">
                iCloud Sync
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
