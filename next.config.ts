import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    root: __dirname,
  },
  async redirects() {
    return [
      { source: "/magaza", destination: "/store", permanent: true },
      { source: "/iletisim", destination: "/contact", permanent: true },
      { source: "/egitimler", destination: "/classes", permanent: true },
      { source: "/etkinlikler", destination: "/events", permanent: true },
      { source: "/kitaplar", destination: "/books", permanent: true },
      { source: "/kocluk-hizmetleri", destination: "/coaching", permanent: true },
      { source: "/product/:slug", destination: "/store/:slug", permanent: true },
      { source: "/en", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
