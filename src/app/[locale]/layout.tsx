import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WhatsappButton } from "@/components/whatsapp-button";
import { ChromeGate } from "@/components/chrome-gate";
import { CartProvider } from "@/lib/cart";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";
import {
  defaultDescription,
  defaultTitle,
  organizationJsonLd,
  personJsonLd,
  siteName,
  siteUrl,
  websiteJsonLd,
} from "@/lib/seo";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: "%s | Shaman Life",
  },
  description: defaultDescription,
  applicationName: siteName,
  authors: [{ name: "Burak Akcakanat" }],
  creator: "Burak Akcakanat",
  publisher: siteName,
  category: "Coaching and Strategic Consulting",
  keywords: [
    "Burak Akcakanat",
    "Shaman Life",
    "coaching",
    "strategic consulting",
    "Human Consciousness Decoded",
    "Istanbul",
    "Turkey",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  referrer: "origin-when-cross-origin",
  openGraph: {
    title: defaultTitle,
    description: defaultDescription,
    url: siteUrl,
    siteName,
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/assets/hero.jpg",
        width: 1600,
        height: 900,
        alt: defaultTitle,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: ["/assets/hero.jpg"],
  },
  other: {
    "geo.region": "TR-34",
    "geo.placename": "Besiktas, Istanbul",
    "geo.country": "TR",
  },
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale as Locale);

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd),
          }}
        />
        <CartProvider>
          <ChromeGate
            header={<SiteHeader locale={locale as Locale} dict={dict} />}
            footer={<SiteFooter locale={locale as Locale} dict={dict} />}
            whatsapp={<WhatsappButton />}
          >
            {children}
          </ChromeGate>
        </CartProvider>
      </body>
    </html>
  );
}
