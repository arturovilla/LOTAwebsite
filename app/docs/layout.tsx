import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "Setup guides, capture modes, streaming protocols, TouchDesigner integration, 3D export workflows, and accessibility features for the LOTA iOS app.",
  openGraph: {
    title: "Documentation — LOTA",
    description:
      "Setup guides, streaming protocols, TouchDesigner integration, and 3D export workflows for LOTA.",
    url: "https://lidarota.app/docs",
  },
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
