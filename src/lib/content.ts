export type ProductSeed = {
  slug: string;
  name: string;
  category: string;
  priceCents: number;
  description: string;
  image: string;
  digital: boolean;
};

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

export const products: ProductSeed[] = [
  {
    slug: "interactive-brokers-investment-portfolio-guide",
    name: "Interactive Brokers and Investment Portfolio Set up Guide",
    category: "Digital Products",
    priceCents: 2400000,
    description:
      "A practical digital guide for investment portfolio setup and operational discipline.",
    image: "/assets/hcd.jpg",
    digital: true,
  },
  {
    slug: "liderlik-101",
    name: "Liderlik 101",
    category: "Digital Products",
    priceCents: 594000,
    description:
      "Leadership fundamentals for young leaders, managers and professionals.",
    image: "/assets/integral-coaching.jpg",
    digital: true,
  },
  {
    slug: "lider-koclugu",
    name: "Lider Koclugu",
    category: "Digital Products",
    priceCents: 495000,
    description:
      "A focused leadership coaching product for decision makers and teams.",
    image: "/assets/coaching.jpg",
    digital: true,
  },
];

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

export const posts = [
  {
    slug: "human-consciousness-decoded",
    title: "Human Consciousness Decoded",
    excerpt: "A powerful method to unravel the functions of consciousness.",
    body: "Human Consciousness Decoded creates a map for understanding awareness, behavior, patterns and transformation. This rebuilt article preserves the public-facing content direction while moving the site to a maintainable content model.",
    image: "/assets/hcd.jpg",
  },
  {
    slug: "balance-of-life-areas",
    title: "Life Areas Balance and Reflections at Work",
    excerpt: "How life balance becomes visible in professional behavior.",
    body: "Personal balance, leadership, communication and decision making are connected. This post introduces the coaching perspective used across Shaman Life programs.",
    image: "/assets/coaching.jpg",
  },
  {
    slug: "find-a-way",
    title: "Find a Way",
    excerpt: "A coaching note on choice, persistence and inner direction.",
    body: "The process starts by clarifying the current reality, locating the repeating pattern and choosing the next concrete step.",
    image: "/assets/integral-coaching.jpg",
  },
];

export const events = [
  {
    slug: "liderlik-101",
    title: "Liderlik 101",
    date: "2024-05-30",
    location: "Online",
    description:
      "A leadership training program for professionals who want a clear working foundation.",
  },
  {
    slug: "bilinc-seviyeleri-calismasi",
    title: "Bilinc Seviyeleri Calismasi",
    date: null,
    location: "Istanbul / Online",
    description:
      "A recurring consciousness-level study connected to the HCD approach.",
  },
];

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

export const staticPages = [
  {
    slug: "about-me",
    title: "About Me",
    body: aboutParagraphs.join("\n\n"),
  },
  {
    slug: "coaching",
    title: "Coaching",
    body: "We help you shape your life with holistic coaching activities, personal guidance and structured development programs.",
  },
  {
    slug: "books",
    title: "Books",
    body: "Human Consciousness Decoded and related publications are available through the Shaman Life store.",
  },
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    body: "Personal data collected through forms, checkout and booking flows is used only to provide the requested service and manage customer communication.",
  },
  {
    slug: "terms-of-use",
    title: "Terms of Use",
    body: "By using this website, customers accept the service, booking and digital product conditions published by Shaman Life.",
  },
];

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
