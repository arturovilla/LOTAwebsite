import Image from "next/image";

const protocols = [
  {
    name: "NDI",
    desc: "Industry-standard video-over-IP. Auto-discovered by TouchDesigner, OBS, vMix, and Resolume.",
  },
  {
    name: "TCP / UDP",
    desc: "H.264 video for color modes, raw Float32 depth maps for depth and point cloud. Configurable host and port.",
  },
  {
    name: "OSC",
    desc: "Real-time camera position, rotation, and euler angles streamed at 30 Hz over UDP.",
  },
  {
    name: "PLY",
    desc: "Live point cloud data streamed as CSV frames for TouchDesigner via TCP/IP DAT.",
  },
];

export default function Streaming() {
  return (
    <section id="streaming" className="py-28 px-6 bg-black">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="order-2 lg:order-1">
            <p className="text-xs font-mono text-zinc-500 uppercase tracking-[0.2em] mb-4">
              Network Streaming
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Stream to any receiver
            </h2>
            <p className="text-zinc-500 mt-5 leading-relaxed">
              Send LiDAR depth, color, point cloud, and camera tracking data over
              the network in real time. Four protocols, all independently
              configurable, all running simultaneously.
            </p>

            <div className="flex flex-col gap-4 mt-10">
              {protocols.map((proto) => (
                <div
                  key={proto.name}
                  className="flex gap-4 items-start p-4 rounded-xl bg-zinc-950 border border-white/[0.06]"
                >
                  <span className="text-sm font-bold text-white font-mono shrink-0 w-20">
                    {proto.name}
                  </span>
                  <span className="text-sm text-zinc-500 leading-relaxed">
                    {proto.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Phone mockup */}
          <div className="flex justify-center order-1 lg:order-2">
            <Image
              src="/settings.webp"
              alt="LOTA streaming settings"
              width={300}
              height={640}
              className="rounded-[2.5rem] drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
