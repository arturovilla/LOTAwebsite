import Image from "next/image";

const modes = [
  {
    title: "Color",
    img: "/colormode.webp",
    desc: "Live RGB camera feed at 60 FPS with real-time LiDAR depth fusion. What you see is what you capture.",
  },
  {
    title: "Monochrome",
    img: "/monochromemode.webp",
    desc: "High-contrast grayscale feed — ideal for low-light environments and precision spatial scanning.",
  },
  {
    title: "Depth",
    img: "/depthmode.webp",
    desc: "LiDAR depth visualization with 9 selectable colormaps including thermal, incandescent, and deep sea.",
  },
  {
    title: "Point Cloud",
    img: "/pointcloudmode.webp",
    desc: "Real-time 3D point cloud with true RGB colors. Configurable frame window and point density up to 12,500 points per frame.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-28 px-6 bg-section">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-mono text-zinc-500 uppercase tracking-[0.2em] mb-4">
            Capture Modes
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            Four ways to see the world
          </h2>
          <p className="text-zinc-500 mt-5 max-w-xl mx-auto leading-relaxed">
            Switch between modes in real time. Every mode leverages
            your iPhone&apos;s LiDAR sensor and full camera array.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {modes.map((mode) => (
            <div
              key={mode.title}
              className="group rounded-2xl overflow-hidden bg-zinc-950 border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative overflow-hidden bg-black flex justify-center pt-6">
                <Image
                  src={mode.img}
                  alt={`LOTA ${mode.title} mode`}
                  width={240}
                  height={480}
                  className="group-hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <h3 className="text-base font-semibold text-white">
                  {mode.title}
                </h3>
                <p className="text-sm text-zinc-500 mt-2 leading-relaxed">
                  {mode.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
