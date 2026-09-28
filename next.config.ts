import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Estimate requests can carry up to five photos (resized in the browser).
    serverActions: { bodySizeLimit: "12mb" },
  },
  async redirects() {
    return [
      // www is the primary address; send the bare domain there, keeping the path.
      {
        source: "/:path*",
        has: [{ type: "host", value: "autoandallautomotive.com" }],
        destination: "https://www.autoandallautomotive.com/:path*",
        permanent: true,
      },
      { source: "/gallery", destination: "/work", permanent: true },
      // One form, on the contact page.
      { source: "/estimate", destination: "/contact#estimate-form", permanent: true },
    ];
  },
};

export default nextConfig;
