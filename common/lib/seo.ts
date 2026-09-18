import type { Metadata } from "next";

export const SITE = {
  name: "Auto And All Automotive",
  url: process.env.SITE_URL || "https://autoandallautomotive.com",
  description:
    "Collision repair, custom paint, diagnostics, maintenance and mechanical repairs at Auto And All Automotive in Sunbury, North Carolina.",
  email: "contact@autoandallautomotive.com",
  estimatesEmail: "estimates@autoandallautomotive.com",
  address: {
    street: "1050 US Highway 158 E",
    city: "Sunbury",
    state: "NC",
    zip: "27979",
    country: "US",
  },
  serviceArea: [
    "Outer Banks",
    "Chesapeake",
    "Virginia Beach",
    "Norfolk",
    "Portsmouth",
    "Hampton",
  ],
} as const;

export type PageKey =
  | "home"
  | "body-shop"
  | "custom-paint"
  | "auto-service"
  | "work"
  | "contact";

type PageSeo = {
  path: string;
  /** Browser tab and search-result title (the site name is added for you). */
  title: string;
  description: string;
  /** Small label and large headline used on the social preview image. */
  ogKicker: string;
  ogTitle: string;
};

export const PAGES: Record<PageKey, PageSeo> = {
  home: {
    path: "/",
    title: "Collision Repair & Custom Paint in Sunbury, NC",
    description: SITE.description,
    ogKicker: "Sunbury, North Carolina",
    ogTitle: "Repair the damage. Reimagine the finish.",
  },
  "body-shop": {
    path: "/body-shop",
    title: "Collision & Body Repair in Sunbury, NC",
    description:
      "Collision repair, panel and dent work, and paint matching in Sunbury, NC — a methodical path from visible damage to a safe, straight and properly finished vehicle.",
    ogKicker: "Collision & body repair",
    ogTitle: "Restore the structure. Refine every surface.",
  },
  "custom-paint": {
    path: "/custom-paint",
    title: "Custom Paint & Refinishing in Sunbury, NC",
    description:
      "Complete color changes, custom graphics and specialty finishes in Sunbury, NC — every project starts with the idea and succeeds through preparation.",
    ogKicker: "Custom paint & refinishing",
    ogTitle: "A finish made to be remembered.",
  },
  "auto-service": {
    path: "/auto-service",
    title: "Auto Service & Mechanical Repair in Sunbury, NC",
    description:
      "Diagnostics, maintenance, brakes, steering, suspension and engine repair in Sunbury, NC, organized by safety, reliability and your priorities.",
    ogKicker: "Auto service & repair",
    ogTitle: "Find the cause. Fix what matters.",
  },
  work: {
    path: "/work",
    title: "Our Work",
    description:
      "Collision restoration, custom color, panel refinishing and mechanical care from Auto And All Automotive in Sunbury, NC.",
    ogKicker: "Selected work",
    ogTitle: "Quality lives in the details.",
  },
  contact: {
    path: "/contact",
    title: "Request an Estimate & Contact",
    description:
      "Request an estimate from Auto And All Automotive by sending your vehicle details and photos, or visit the shop at 1050 US Highway 158 E, Sunbury, NC 27979. Hours, directions and email.",
    ogKicker: "Visit the shop",
    ogTitle: "Your local shop in Sunbury.",
  },
};

export const ogImagePath = (page: PageKey) => `/api/og?page=${page}`;

/**
 * Complete metadata for a public page: title, description, canonical URL and
 * the Open Graph / Twitter tags that drive link previews. Relative URLs are
 * resolved against `metadataBase` in the root layout.
 */
export function pageMetadata(page: PageKey): Metadata {
  const { path, title, description, ogTitle } = PAGES[page];
  const fullTitle = `${title} | ${SITE.name}`;
  const socialTitle = page === "home" ? `${SITE.name} | ${title}` : fullTitle;
  const image = {
    url: ogImagePath(page),
    width: 1200,
    height: 630,
    alt: `${SITE.name} — ${ogTitle}`,
  };
  return {
    title: page === "home" ? { absolute: socialTitle } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE.name,
      locale: "en_US",
      url: path,
      title: socialTitle,
      description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [image.url],
    },
  };
}
