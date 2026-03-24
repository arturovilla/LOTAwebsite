import {
  Accessibility,
  Mic,
  AArrowUp,
  Contrast,
  Shapes,
  Sun,
  PersonStanding,
} from "lucide-react";

const features = [
  {
    icon: Accessibility,
    title: "VoiceOver",
    desc: "Every control is labeled and announced. Mode switches, streaming state, and recording status are all spoken aloud, so you never have to guess what\u2019s happening.",
  },
  {
    icon: Mic,
    title: "Voice Control",
    desc: 'Say "stream", "record", or "switch to Depth" and LOTA responds. Every button is discoverable by voice with natural alternative commands.',
  },
  {
    icon: AArrowUp,
    title: "Dynamic Type",
    desc: "Text scales up to 200% or more. Every font uses semantic Dynamic Type styles, and the UI reflows to a grid layout at extreme sizes so nothing gets cut off.",
  },
  {
    icon: Contrast,
    title: "Dark Interface",
    desc: "Designed dark from the start. Every screen, menu, and control uses a true dark color scheme for comfortable use in any environment.",
  },
  {
    icon: Shapes,
    title: "Differentiate Without Color",
    desc: "Status indicators swap to distinct symbols when enabled. Shapes, icons, and text labels replace color as the sole differentiator, nothing is lost.",
  },
  {
    icon: Sun,
    title: "Sufficient Contrast",
    desc: "Increase Contrast swaps blur materials for solid backgrounds and boosts status colors for guaranteed readability over any camera feed.",
  },
  {
    icon: PersonStanding,
    title: "Reduce Motion",
    desc: "All transitions respect the system Reduce Motion setting. Visual feedback stays, decorative animation goes.",
  },
];

export default function AccessibilitySection() {
  return (
    <section id="accessibility" className="py-28 px-6 bg-black">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-mono text-zinc-500 uppercase tracking-[0.2em] mb-4">
            Accessibility
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            Built for everyone
          </h2>
          <p className="text-zinc-500 mt-5 max-w-2xl mx-auto leading-relaxed">
            Professional spatial capture shouldn&apos;t require perfect vision, hearing, or
            motor control. LOTA is designed to meet Apple&apos;s App Store accessibility
            standards, so every feature works for every user.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl p-6 bg-zinc-950 border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300"
            >
              <div className="text-zinc-400 group-hover:text-white transition-colors duration-300 mb-4">
                <f.icon className="w-8 h-8" strokeWidth={1.5} />
              </div>
              <h3 className="text-base font-semibold text-white">{f.title}</h3>
              <p className="text-sm text-zinc-500 mt-2 leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
