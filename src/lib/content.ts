import {
  realProducts,
  realPosts,
  realPages,
  realEvents,
  realTrainer,
} from "./content-data";

export type ProductSeed = {
  slug: string;
  name: string;
  category: string;
  priceCents: number;
  description: string;
  image: string;
  digital: boolean;
};

const FALLBACK_IMAGE = "/assets/hcd.jpg";

export const site = {
  name: "Shaman Life",
  owner: "Burak Akcakanat",
  email: "info@shamanlife.com",
  phone: "+90 532 436 2909",
  whatsapp: "https://wa.me/905324362909",
  address:
    "Levent Mahallesi, Comert Sokak, Yapi Kredi Plaza C Blok No: 1C Ic Kapi No: 23 PK: 34330 Besiktas - Istanbul",
};

export const navItems = [
  { href: "/about-me", label: "About Me" },
  { href: "/classes", label: "Classes" },
  { href: "/blog", label: "Blog" },
  { href: "/store", label: "E-Store" },
  { href: "/events", label: "Events" },
  { href: "/contact", label: "Contact" },
];

export const aboutParagraphs = [
  "The last 20 years of Burak Akcakanat's business life, built on more than 30 years of experience, mainly consist of coaching, guidance and training services provided to individuals, professionals and institutions.",
  "With a foundation in Industrial Design from METU and certifications in Life, Executive and Corporate Coaching, his work combines psychology, philosophy, neurology, biology, physics, mystical traditions and the study of human consciousness.",
  "Human Consciousness Decoded is the nucleus of this work: a holistic approach that treats people within the fabric of the universe they inhabit and helps clients navigate self-discovery, growth and potential.",
];

export const aboutParagraphsTr = [
  "Burak Akçakanat'ın 30 yılı aşkın deneyime dayanan son 20 yıllık iş hayatı; bireylere, profesyonellere ve kurumlara sunulan koçluk, rehberlik ve eğitim hizmetlerinden oluşmaktadır.",
  "ODTÜ Endüstriyel Tasarım temeli ile Yaşam, Yönetici ve Kurumsal Koçluk sertifikalarını birleştiren çalışması; psikoloji, felsefe, nöroloji, biyoloji, fizik, mistik gelenekler ve insan bilinci çalışmalarını bir araya getirir.",
  "Human Consciousness Decoded bu çalışmanın çekirdeğidir: insanı içinde yaşadığı evrenin dokusuyla birlikte ele alan, danışanların kendini keşif, gelişim ve potansiyel yolculuğunda rehberlik eden bütünsel bir yaklaşımdır.",
];

export const products: ProductSeed[] = realProducts.map((p) => ({
  slug: p.slug,
  name: p.name,
  category: p.category,
  priceCents: p.priceCents,
  description: p.description,
  image: p.image ?? FALLBACK_IMAGE,
  digital: p.digital,
}));

export const services = [
  {
    slug: "holistic-coaching",
    title: "Holistic Coaching",
    text: "Shape your life with a holistic coaching process designed around awareness and practical action.",
    image: "/assets/coaching.jpg",
  },
  {
    slug: "integral-coaching",
    title: "Integral Coaching",
    text: "Work with the personal, professional and relational dimensions of change together.",
    image: "/assets/integral-coaching.jpg",
  },
  {
    slug: "skype-coaching",
    title: "Skype Coaching",
    text: "Remote coaching sessions for clients who need location-independent support.",
    image: "/assets/skype-coaching.jpg",
  },
];

export type PostSeed = {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  image: string;
};

export const posts: PostSeed[] = realPosts.map((p) => ({
  slug: p.slug,
  title: p.title,
  excerpt: p.excerpt,
  body: p.body,
  image: p.image ?? FALLBACK_IMAGE,
}));

export type EventSeed = {
  slug: string;
  title: string;
  date: string | null;
  location: string;
  description: string;
  body: string;
  image: string;
};

export const events: EventSeed[] = realEvents.map((e) => ({
  slug: e.slug,
  title: e.title,
  date: null,
  location: "İstanbul / Online",
  description: e.description,
  body: e.body,
  image: e.image ?? FALLBACK_IMAGE,
}));

export const testimonials = [
  {
    name: "Sydney Au",
    quote:
      "Burak taught me how to choose my own directions and grow as a person. I learned to trust my inner compass.",
  },
  {
    name: "Isabelle Sennery",
    quote:
      "His methodology is insightful and powerful. It changed how I work as a transformational coach.",
  },
  {
    name: "Halim Tansug",
    quote:
      "Excellent communicator, amazing listening skills and a perspective that helped me in career and personal life.",
  },
];

export type PageSeed = { slug: string; title: string; body: string };

// Synthetic nav pages kept for header/footer links, then merged with the real
// pages recovered from the WordPress cache (Turkish slugs).
const syntheticPages: PageSeed[] = [
  {
    slug: "about-me",
    title: "Hakkımda",
    body:
      "<p>" + aboutParagraphs.join("</p><p>") + "</p>",
  },
];

const extractedPages: PageSeed[] = realPages.map((p) => ({
  slug: p.slug,
  title: p.title,
  body: p.body,
}));

export const staticPages: PageSeed[] = [
  ...syntheticPages,
  ...extractedPages.filter(
    (p) => !syntheticPages.some((s) => s.slug === p.slug),
  ),
];

export const trainer = realTrainer;

export const redirects = [
  { source: "/magaza", destination: "/store", permanent: true },
  { source: "/iletisim", destination: "/contact", permanent: true },
  { source: "/egitimler", destination: "/classes", permanent: true },
  { source: "/etkinlikler", destination: "/events", permanent: true },
  { source: "/kitaplar", destination: "/books", permanent: true },
  { source: "/kocluk-hizmetleri", destination: "/coaching", permanent: true },
];

export function formatTry(cents: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
  }).format(cents / 100);
}
