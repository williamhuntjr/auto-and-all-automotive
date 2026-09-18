import { SITE } from "@/common/lib/seo";

/** schema.org LocalBusiness data so search engines can show the shop's details. */
export function LocalBusinessJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": ["AutoBodyShop", "AutoRepair"],
    "@id": `${SITE.url}/#business`,
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    email: SITE.email,
    image: `${SITE.url}/api/og?page=home`,
    logo: `${SITE.url}/auto-and-all-logo-clean.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.state,
      postalCode: SITE.address.zip,
      addressCountry: SITE.address.country,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "17:00",
      },
    ],
    areaServed: SITE.serviceArea.map((name) => ({ "@type": "Place", name })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
