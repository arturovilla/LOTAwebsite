import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Standard crawlers
      {
        userAgent: "Googlebot",
        allow: "/",
      },
      {
        userAgent: "Bingbot",
        allow: "/",
      },
      // AI retrieval bots — power AI search results (Perplexity, ChatGPT, Claude)
      {
        userAgent: [
          "ChatGPT-User",
          "OAI-SearchBot",
          "Claude-SearchBot",
          "Claude-User",
          "PerplexityBot",
          "Perplexity-User",
          "Amazonbot",
        ],
        allow: "/",
      },
      // AI training bots — allow for maximum exposure during launch
      {
        userAgent: ["GPTBot", "ClaudeBot", "Google-Extended", "Applebot-Extended"],
        allow: "/",
      },
      // Block pure scrapers with no benefit
      {
        userAgent: ["Bytespider", "Diffbot", "img2dataset", "Omgili", "CCBot"],
        disallow: "/",
      },
      // Default: allow everything
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: "https://lidarota.app/sitemap.xml",
  };
}
