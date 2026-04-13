import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://lidarota.app",
      lastModified: new Date("2026-04-03"),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://lidarota.app/docs",
      lastModified: new Date("2026-04-12"),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: "https://lidarota.app/changelog",
      lastModified: new Date("2026-04-12"),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: "https://lidarota.app/privacy",
      lastModified: new Date("2026-04-01"),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];
}
