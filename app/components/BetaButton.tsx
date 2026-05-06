"use client";

import { track } from "@vercel/analytics";

const TESTFLIGHT_URL = "https://testflight.apple.com/join/jFNkCjNF";

export default function BetaButton({
  source,
  className,
  children = "Join the Beta",
}: {
  source: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <a
      href={TESTFLIGHT_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("Join Beta Clicked", { source })}
      className={className}
    >
      {children}
    </a>
  );
}
