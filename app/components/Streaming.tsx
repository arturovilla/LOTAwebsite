import Image from "next/image";

const protocols = [
  {
    name: "TCP",
    desc: "Reliable ordered delivery",
  },
  {
    name: "UDP",
    desc: "Low-latency streaming",
  },
  {
    name: "NDI",
    desc: "Network video standard",
  },
  {
    name: "OSC",
    desc: "Creative tool control",
  },
];

export default function Streaming() {
  return (
    <section id="streaming" className="py-24 px-6 bg-zinc-950">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Content */}
          <div className="order-2 md:order-1">
            <p className="text-sm font-mono text-orange-500 uppercase tracking-widest mb-3">
              Real-Time
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Stream to Any Receiver
            </h2>
            <p className="text-zinc-400 mt-4 leading-relaxed">
              Send LiDAR depth, color, and point cloud data over the network in
              real time. Configure your receiver IP and port, pick your
              transport protocol, and start streaming — perfect for live
              visuals, creative coding, and spatial computing workflows.
            </p>

            {/* Protocol badges */}
            <div className="grid grid-cols-2 gap-3 mt-8">
              {protocols.map((proto) => (
                <div
                  key={proto.name}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800"
                >
                  <span className="text-lg font-bold text-orange-400 font-mono">
                    {proto.name}
                  </span>
                  <span className="text-xs text-zinc-500">{proto.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Phone mockup */}
          <div className="flex justify-center order-1 md:order-2">
            <Image
              src="/LOATAAssests5.jpg"
              alt="LOTA streaming settings"
              width={320}
              height={640}
              className="rounded-2xl shadow-2xl shadow-orange-500/10"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
