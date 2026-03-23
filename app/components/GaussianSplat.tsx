import Image from "next/image";

export default function GaussianSplat() {
  return (
    <section id="export" className="py-28 px-6 bg-section">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Phone mockup */}
          <div className="flex justify-center">
            <Image
              src="/gaussianSplat.webp"
              alt="LOTA Gaussian Splat export"
              width={300}
              height={640}
              className="rounded-[2.5rem] drop-shadow-2xl"
            />
          </div>

          {/* Content */}
          <div>
            <p className="text-xs font-mono text-zinc-500 uppercase tracking-[0.2em] mb-4">
              3D Export
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Gaussian splats &amp; point clouds
            </h2>
            <p className="text-zinc-500 mt-5 leading-relaxed">
              Capture posed camera frames with ARKit intrinsics, extrinsics,
              and LiDAR point clouds. Export COLMAP-compatible binary datasets
              ready for training with OpenSplat, Nerfstudio, or gsplat — directly
              from your iPhone.
            </p>

            {/* Feature list */}
            <div className="flex flex-col gap-3 mt-8">
              <div className="flex items-start gap-3">
                <div className="w-1 h-1 rounded-full bg-zinc-600 mt-2.5 shrink-0" />
                <p className="text-sm text-zinc-400">
                  <span className="text-white font-medium">COLMAP-compatible export</span> — cameras.bin, images.bin, points3D.bin
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1 h-1 rounded-full bg-zinc-600 mt-2.5 shrink-0" />
                <p className="text-sm text-zinc-400">
                  <span className="text-white font-medium">Standalone PLY export</span> — unlimited point accumulation across your entire session
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1 h-1 rounded-full bg-zinc-600 mt-2.5 shrink-0" />
                <p className="text-sm text-zinc-400">
                  <span className="text-white font-medium">iCloud sync</span> — pick an export folder and captures sync automatically
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1 h-1 rounded-full bg-zinc-600 mt-2.5 shrink-0" />
                <p className="text-sm text-zinc-400">
                  <span className="text-white font-medium">Compatible everywhere</span> — Blender, CloudCompare, MeshLab, and any PLY tool
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
