import Image from "next/image";
import Link from "next/link";
import { ProductCard, ServiceCard } from "@/components/cards";
import {
  aboutParagraphs,
  aboutParagraphsTr,
  events,
  posts,
  products,
  services,
  testimonials,
} from "@/lib/content";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { l, type Locale } from "@/lib/i18n/config";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  return (
    <main className="bg-stone-50 text-stone-950">
      <section className="relative overflow-hidden bg-stone-950 text-white">
        <Image
          src="/assets/hero.jpg"
          alt="Human Consciousness Decoded"
          fill
          priority
          className="object-cover opacity-45"
        />
        <div className="relative mx-auto grid min-h-[78vh] max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-amber-300">
              Human Consciousness Decoded
            </p>
            <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[1.02] sm:text-6xl lg:text-7xl">
              {locale === "tr" ? "Aydınlanmanın Bilimi" : "Science of Enlightenment"}
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-stone-100">
              {locale === "tr"
                ? "Koçluk, stratejik danışmanlık, kitaplar ve eğitim programları ile bilincinizi açığa çıkarın, potansiyelinizi yükseltin ve hayatınızı dönüştürün."
                : "Unlock your consciousness, elevate your potential and transform your life through coaching, strategic consulting, books and educational programs."}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href={l(locale, "/store")} className="button bg-amber-600 hover:bg-amber-700">
                {dict.actions.viewBooks}
              </Link>
              <Link href={l(locale, "/bookings")} className="button bg-white text-stone-950 hover:bg-stone-100">
                {dict.actions.bookCoaching}
              </Link>
            </div>
          </div>
          <div className="rounded-lg border border-white/20 bg-white/12 p-6 backdrop-blur">
            <p className="text-sm uppercase tracking-[0.25em] text-amber-200">
              {locale === "tr" ? "Koçluk ve Stratejik Danışmanlık" : "Coaching and Strategic Consulting"}
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
              <div className="rounded-lg bg-white/12 p-4">
                <span className="block text-3xl font-semibold">30+</span>
                {locale === "tr" ? "yıllık profesyonel deneyim" : "years of professional experience"}
              </div>
              <div className="rounded-lg bg-white/12 p-4">
                <span className="block text-3xl font-semibold">HCD</span>
                {locale === "tr" ? "bütünsel bilinç metodolojisi" : "holistic consciousness methodology"}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">
            {dict.sections.aboutMe}
          </p>
          <h2 className="mt-3 text-4xl font-semibold">Burak Akçakanat</h2>
          <div className="relative mt-8 aspect-[4/5] overflow-hidden rounded-lg">
            <Image src="/assets/burak-akcakanat.png" alt="Burak Akcakanat" fill className="object-cover" />
          </div>
        </div>
        <div className="self-center text-lg leading-8 text-stone-700">
          {(locale === "tr" ? aboutParagraphsTr : aboutParagraphs).map((paragraph) => (
            <p key={paragraph} className="mb-5">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="section">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">
              {dict.sections.store}
            </p>
            <h2 className="mt-3 text-4xl font-semibold">Human Consciousness Decoded</h2>
            <p className="mt-4 text-stone-600">
              {locale === "tr"
                ? "Shaman Life kataloğundan kitaplar, dijital ürünler ve eğitim materyalleri."
                : "Books, digital products and training materials from the Shaman Life catalog."}
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">
            {dict.sections.coaching}
          </p>
          <h2 className="mt-3 text-4xl font-semibold">
            {locale === "tr" ? "Kişiye Özel Çözümler" : "Personalized Solutions"}
          </h2>
          <p className="mt-4 text-stone-600">
            {locale === "tr"
              ? "Her birey, profesyonel ve kurum için tasarlanmış koçluk ve rehberlik süreçleri."
              : "Coaching and guidance processes designed for each person, professional and institution."}
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} locale={locale} />
          ))}
        </div>
      </section>

      <section className="bg-stone-950 text-white">
        <div className="section">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-300">
            {dict.sections.testimonial}
          </p>
          <h2 className="mt-3 text-4xl font-semibold">{dict.sections.whatClientsSay}</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {testimonials.map((item) => (
              <blockquote key={item.name} className="rounded-lg bg-white/10 p-6">
                <p className="leading-7 text-stone-100">{item.quote}</p>
                <cite className="mt-5 block text-sm font-semibold not-italic text-amber-200">
                  {item.name}
                </cite>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="section grid gap-10 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">
            {dict.sections.blog}
          </p>
          <h2 className="mt-3 text-4xl font-semibold">{dict.sections.latestWriting}</h2>
          <div className="mt-8 grid gap-4">
            {posts.slice(0, 4).map((post) => (
              <Link key={post.slug} href={l(locale, `/blog/${post.slug}`)} className="rounded-lg border border-stone-200 bg-white p-5 hover:border-amber-600">
                <h3 className="text-xl font-semibold">{post.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-stone-600">{post.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">
            {dict.sections.events}
          </p>
          <h2 className="mt-3 text-4xl font-semibold">
            {locale === "tr" ? "Etkinlikler" : "Events"}
          </h2>
          <div className="mt-8 grid gap-4">
            {events.slice(0, 4).map((event) => (
              <Link key={event.slug} href={l(locale, `/events/${event.slug}`)} className="rounded-lg border border-stone-200 bg-white p-5 hover:border-amber-600">
                <p className="text-sm text-amber-700">{event.date ?? dict.common.dateByRequest}</p>
                <h3 className="mt-2 text-xl font-semibold">{event.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-stone-600">{event.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
