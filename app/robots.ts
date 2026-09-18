import type { MetadataRoute } from "next";
import { SITE } from "@/common/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The OG image endpoint stays crawlable so link previews can load it.
      disallow: ["/admin", "/parts-inventory", "/api/admin", "/api/categories", "/api/vin"],
    },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
