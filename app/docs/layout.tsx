import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentation — LOTA",
  description:
    "Learn how to capture, stream, and export 3D spatial data with LOTA.",
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
