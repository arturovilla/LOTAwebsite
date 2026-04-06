/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import Link from "next/link";
import Signup from "../components/Signup";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Changelog",
  description:
    "Version history and release notes for the LOTA iOS app. New features, improvements, and fixes for every release.",
  openGraph: {
    title: "Changelog — LOTA",
    description:
      "Version history and release notes for the LOTA iOS app.",
    url: "https://lidarota.app/changelog",
  },
};

/* ── markdown parser ──────────────────────────────────────────── */

interface ChangeEntry {
  text: string;
}

interface ChangeCategory {
  name: string;
  entries: ChangeEntry[];
}

interface Release {
  version: string;
  date: string;
  categories: ChangeCategory[];
}

function parseChangelog(raw: string): Release[] {
  const releases: Release[] = [];
  let currentRelease: Release | null = null;
  let currentCategory: ChangeCategory | null = null;

  for (const line of raw.split("\n")) {
    // ## [1.0.2] - 2026-03-31
    const releaseMatch = line.match(/^## \[(.+?)\] - (\d{4}-\d{2}-\d{2})/);
    if (releaseMatch) {
      currentRelease = {
        version: releaseMatch[1],
        date: releaseMatch[2],
        categories: [],
      };
      releases.push(currentRelease);
      currentCategory = null;
      continue;
    }

    // ### Added
    const categoryMatch = line.match(/^### (.+)/);
    if (categoryMatch && currentRelease) {
      currentCategory = { name: categoryMatch[1], entries: [] };
      currentRelease.categories.push(currentCategory);
      continue;
    }

    // - **Something**: description
    if (line.startsWith("- ") && currentCategory) {
      currentCategory.entries.push({ text: line.slice(2) });
    }
  }

  return releases;
}

/* ── format helpers ───────────────────────────────────────────── */

function formatDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function categoryColor(name: string) {
  switch (name.toLowerCase()) {
    case "added":
      return "text-emerald-400 border-emerald-400/20 bg-emerald-400/[0.06]";
    case "changed":
      return "text-amber-400 border-amber-400/20 bg-amber-400/[0.06]";
    case "fixed":
      return "text-blue-400 border-blue-400/20 bg-blue-400/[0.06]";
    case "removed":
      return "text-red-400 border-red-400/20 bg-red-400/[0.06]";
    case "planned":
      return "text-purple-400 border-purple-400/20 bg-purple-400/[0.06]";
    default:
      return "text-zinc-400 border-zinc-400/20 bg-zinc-400/[0.06]";
  }
}

/* ── inline markdown (bold + code) ────────────────────────────── */

function InlineMarkdown({ text }: { text: string }) {
  // Split on **bold**, `code`, and plain text
  const parts = text.split(/(\*\*.+?\*\*|`.+?`)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="text-white font-semibold">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code
              key={i}
              className="text-xs font-mono text-zinc-300 bg-white/[0.06] px-1.5 py-0.5 rounded"
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

/* ── page ─────────────────────────────────────────────────────── */

export default function ChangelogPage() {
  const filePath = path.join(process.cwd(), "CHANGELOG.md");
  const raw = fs.readFileSync(filePath, "utf-8");
  const releases = parseChangelog(raw);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* ── top bar ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5">
              <img
                src="https://pub-42e3bdd794c24301bd74d193c44417c6.r2.dev/LOTA-dark.jpg"
                alt="LOTA"
                width={28}
                height={28}
                className="rounded-lg"
              />
              <span className="text-lg font-semibold text-white tracking-tight">
                LOTA
              </span>
            </Link>
            <span className="hidden sm:inline text-zinc-600 text-sm">/</span>
            <span className="hidden sm:inline text-sm text-zinc-400">
              Changelog
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/docs"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Docs
            </Link>
            <Link
              href="/"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Home
            </Link>
          </div>
        </div>
      </header>

      {/* ── content ─────────────────────────────────────────── */}
      <main className="max-w-3xl mx-auto px-6 md:px-12 py-16">
        <div className="mb-16">
          <p className="text-xs font-mono text-zinc-600 uppercase tracking-[0.2em] mb-2">
            Updates
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Changelog
          </h1>
          <p className="text-zinc-400 leading-relaxed">
            New features, improvements, and fixes for every release of LOTA.
          </p>
        </div>

        <div className="space-y-16">
          {releases.map((release) => (
            <article key={release.version}>
              {/* version header */}
              <div className="flex flex-wrap items-baseline gap-3 mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  {release.version}
                </h2>
                <time className="text-sm text-zinc-500 font-mono">
                  {formatDate(release.date)}
                </time>
              </div>

              {/* categories */}
              <div className="space-y-6">
                {release.categories.map((cat) => (
                  <div key={cat.name}>
                    <span
                      className={`inline-block text-xs font-mono uppercase tracking-wider px-2.5 py-1 rounded-full border mb-4 ${categoryColor(cat.name)}`}
                    >
                      {cat.name}
                    </span>
                    <ul className="space-y-2.5">
                      {cat.entries.map((entry, i) => (
                        <li key={i} className="flex gap-3 text-sm leading-relaxed">
                          <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-700" />
                          <span className="text-zinc-400">
                            <InlineMarkdown text={entry.text} />
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* divider (except last) */}
              {release !== releases[releases.length - 1] && (
                <div className="mt-12 border-t border-white/[0.06]" />
              )}
            </article>
          ))}
        </div>
      </main>
      <Signup />
      <Footer />
    </div>
  );
}
