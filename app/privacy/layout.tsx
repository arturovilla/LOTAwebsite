import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — LOTA",
  description:
    "How LOTA handles your data — privacy policy for the LOTA iOS app and website.",
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
