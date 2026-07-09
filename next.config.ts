import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    root: __dirname,
  },
  async redirects() {
    // Legacy WordPress URLs whose slug CHANGED -> new locale-prefixed routes.
    // Same-name Turkish slugs (kitaplar, kocluk-hizmetleri, ...) are real pages now
    // and the proxy adds the default locale automatically, so they need no entry here.
    return [
      { source: "/magaza", destination: "/tr/store", permanent: true },
      { source: "/iletisim", destination: "/tr/contact", permanent: true },
      { source: "/egitimler", destination: "/tr/classes", permanent: true },
      { source: "/etkinlikler", destination: "/tr/events", permanent: true },
      { source: "/product/:slug", destination: "/tr/store/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
