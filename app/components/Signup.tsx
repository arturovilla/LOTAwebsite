"use client";

import { useState } from "react";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error();
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="py-28 px-6 bg-black">
      <div className="max-w-xl mx-auto text-center">
        <p className="text-xs font-mono text-zinc-500 uppercase tracking-[0.2em] mb-4">
          Stay in the Loop
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          Get Development Updates
        </h2>
        <p className="text-zinc-500 mb-10 leading-relaxed">
          Be the first to know when LOTA launches.
        </p>

        {status === "success" ? (
          <p className="text-sm text-green-400 font-medium">
            You&apos;re on the list — we&apos;ll be in touch.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="flex-1 px-4 py-3 bg-white/[0.06] border border-white/[0.1] rounded-full text-sm text-white placeholder:text-zinc-600 outline-none focus:border-white/[0.25] transition-colors"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-6 py-3 bg-white text-black font-semibold text-sm rounded-full hover:bg-zinc-200 transition-colors disabled:opacity-50"
            >
              {status === "loading" ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
        )}

        {status === "error" && (
          <p className="text-sm text-red-400 mt-4">
            Something went wrong — please try again.
          </p>
        )}
      </div>
    </section>
  );
}
