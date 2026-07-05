import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
    default: "Shaman Life | Burak Akcakanat",
    template: "%s | Shaman Life",
  },
  description:
    "Burak Akcakanat ile koçluk, stratejik danışmanlık, eğitimler ve Human Consciousness Decoded çalışmaları.",
  openGraph: {
    title: "Shaman Life | Burak Akcakanat",
    description:
      "Koçluk, stratejik danışmanlık, eğitimler ve Human Consciousness Decoded.",
    url: "https://shamanlife.com",
    siteName: "Shaman Life",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
