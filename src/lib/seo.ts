import type { Metadata } from "next";
import { site } from "@/lib/content";

export const siteUrl = "https://shamanlife.com";
export const siteName = site.name;
export const defaultTitle = `${siteName} | ${site.owner}`;
export const defaultDescription =
  "Burak Akcakanat ile kocluk, stratejik danismanlik, egitimler, Human Consciousness Decoded calismalari ve dijital urunler.";
export const defaultKeywords = [
  "Burak Akcakanat",
  "Shaman Life",
  "kocluk",
  "holistic coaching",
  "strategic consulting",
  "Human Consciousness Decoded",
  "liderlik egitimi",
  "Istanbul coaching",
  "kurumsal kocluk",
  "yasam koclugu",
];

const defaultOgImage = {
  url: "/assets/hero.jpg",
  width: 1600,
  height: 900,
  alt: `${siteName} hero image`,
};

type PageMetadataInput = {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  image?: string;
};

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}

export function buildMetadata({
  title,
  description,
  path = "/",
  keywords = [],
  image,
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const ogImages = image
    ? [{ url: image, alt: title }]
    : [defaultOgImage];

  return {
    title,
    description,
    keywords: [...defaultKeywords, ...keywords],
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url,
      siteName,
      images: ogImages,
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImages.map((entry) => entry.url),
    },
  };
}

export function buildNoIndexMetadata(title: string, description: string): Metadata {
  return {
    title,
    description,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export function excerptText(value: string, maxLength = 160) {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength - 1).trimEnd()}...`;
}

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${siteUrl}/#organization`,
  name: siteName,
  legalName: "Shaman Life",
  description: defaultDescription,
  url: siteUrl,
  image: absoluteUrl("/assets/hero.jpg"),
  telephone: site.phone,
  email: site.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address,
    addressLocality: "Istanbul",
    addressRegion: "Istanbul",
    postalCode: "34330",
    addressCountry: "TR",
  },
  areaServed: [
    {
      "@type": "Country",
      name: "Turkey",
    },
    {
      "@type": "City",
      name: "Istanbul",
    },
    {
      "@type": "Place",
      name: "Online",
    },
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer support",
      telephone: site.phone,
      email: site.email,
      areaServed: ["TR", "Worldwide"],
      availableLanguage: ["en", "tr"],
    },
  ],
};

export const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${siteUrl}/#person`,
  name: site.owner,
  jobTitle: "Coach and Strategic Consultant",
  worksFor: {
    "@id": `${siteUrl}/#organization`,
  },
  url: siteUrl,
  image: absoluteUrl("/assets/burak-akcakanat.png"),
  email: site.email,
  telephone: site.phone,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Istanbul",
    addressCountry: "TR",
  },
};

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  name: siteName,
  url: siteUrl,
  description: defaultDescription,
  inLanguage: ["en", "tr"],
  publisher: {
    "@id": `${siteUrl}/#organization`,
  },
};
