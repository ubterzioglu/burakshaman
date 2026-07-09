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
  metadataBase: new URL("https://shamanlife.com"),
  title: {
    default: "Shaman Life | Burak Akçakanat",
    template: "%s | Shaman Life",
  },
  description:
    "Burak Akçakanat ile koçluk, stratejik danışmanlık, eğitimler ve Human Consciousness Decoded çalışmaları.",
  openGraph: {
    title: "Shaman Life | Burak Akçakanat",
    description:
      "Koçluk, stratejik danışmanlık, eğitimler ve Human Consciousness Decoded.",
    url: "https://shamanlife.com",
    siteName: "Shaman Life",
    type: "website",
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
