import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Changelog — LOTA",
  description:
    "See what's new in LOTA — latest features, improvements, and fixes.",
};

export default function ChangelogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
