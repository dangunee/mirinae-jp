import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://mirinae.jp";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: { path: string; priority: number; changeFrequency: "weekly" | "monthly" | "yearly" }[] = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/about", priority: 0.9, changeFrequency: "monthly" },
    { path: "/kojin", priority: 0.9, changeFrequency: "weekly" },
    { path: "/group", priority: 0.9, changeFrequency: "weekly" },
    { path: "/kaiwa", priority: 0.9, changeFrequency: "weekly" },
    { path: "/special", priority: 0.9, changeFrequency: "weekly" },
    { path: "/syutyu", priority: 0.9, changeFrequency: "weekly" },
    { path: "/trial", priority: 0.9, changeFrequency: "monthly" },
    { path: "/book", priority: 0.8, changeFrequency: "monthly" },
    { path: "/cancel", priority: 0.7, changeFrequency: "yearly" },
    { path: "/voice", priority: 0.8, changeFrequency: "monthly" },
    { path: "/netlesson", priority: 0.9, changeFrequency: "weekly" },
    { path: "/sitemap.html", priority: 0.5, changeFrequency: "monthly" },
  ];

  return pages.map(({ path, priority, changeFrequency }) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
