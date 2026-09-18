import type { MetadataRoute } from "next";
import { PAGES, SITE } from "@/common/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return Object.entries(PAGES).map(([key, page]) => ({
    url: `${SITE.url}${page.path}`,
    changeFrequency: key === "home" ? "weekly" : "monthly",
    priority: key === "home" ? 1 : 0.7,
  }));
}
