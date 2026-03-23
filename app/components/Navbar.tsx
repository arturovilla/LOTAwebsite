/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";

const links = [
  { label: "Features", href: "#features" },
  { label: "Streaming", href: "#streaming" },
  { label: "Export", href: "#export" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/80 backdrop-blur-xl border-b border-white/[0.06]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#hero" className="flex items-center gap-2.5">
          <img
            src="https://pub-42e3bdd794c24301bd74d193c44417c6.r2.dev/LOTA-dark.jpg"
            alt="LOTA"
            width={32}
            height={32}
            className="rounded-lg"
          />
          <span className="text-lg font-semibold text-white tracking-tight">
            LOTA
          </span>
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
          <span
            className="text-sm font-medium px-5 py-2 rounded-full bg-white/10 text-zinc-300 border border-white/[0.1] cursor-default"
          >
            Coming Soon
          </span>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-5 h-0.5 bg-white transition-all duration-200 ${
              menuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-white transition-all duration-200 ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-white transition-all duration-200 ${
              menuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/[0.06] px-6 pb-6 pt-4 flex flex-col gap-4">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
          <span
            className="text-sm font-medium px-5 py-2.5 rounded-full bg-white/10 text-zinc-300 border border-white/[0.1] text-center cursor-default"
          >
            Coming Soon
          </span>
        </div>
      )}
    </nav>
  );
}
