import Image from "next/image";

const modes = [
  {
    title: "Color",
    img: "/LOATAAssests1.jpg",
    desc: "Full RGB capture at 60 FPS with real-time LiDAR depth fusion.",
  },
  {
    title: "Monochrome",
    img: "/LOATAAssests2.jpg",
    desc: "High-contrast grayscale for low-light environments and precision scanning.",
  },
  {
    title: "Depth",
    img: "/LOATAAssests3.jpg",
    desc: "Real-time depth map visualization with thermal-style color mapping.",
  },
  {
    title: "Point Cloud",
    img: "/LOATAAssests4.jpg",
    desc: "Live 3D point cloud generation directly from the LiDAR sensor.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 px-6 bg-zinc-950">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm font-mono text-orange-500 uppercase tracking-widest mb-3">
            Capture Modes
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Four Ways to See the World
          </h2>
          <p className="text-zinc-400 mt-4 max-w-lg mx-auto">
            Switch between capture modes in real time. Each leverages your
            iPhone&apos;s LiDAR sensor for spatial precision.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {modes.map((mode) => (
            <div
              key={mode.title}
              className="group bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-orange-500/30 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative overflow-hidden">
                <Image
                  src={mode.img}
                  alt={`LOTA ${mode.title} mode`}
                  width={400}
                  height={800}
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-white">
                  {mode.title}
                </h3>
                <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
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
