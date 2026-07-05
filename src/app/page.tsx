import Image from "next/image";
import Link from "next/link";
import { ProductCard, ServiceCard } from "@/components/cards";
import {
  aboutParagraphs,
  events,
  posts,
  products,
  services,
  testimonials,
} from "@/lib/content";

export default function Home() {
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
              Science of Enlightenment
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-stone-100">
              Unlock your consciousness, elevate your potential and transform
              your life through coaching, strategic consulting, books and
              educational programs.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/store" className="button bg-amber-600 hover:bg-amber-700">
                View Books
              </Link>
              <Link href="/bookings" className="button bg-white text-stone-950 hover:bg-stone-100">
                Book Coaching
              </Link>
            </div>
          </div>
          <div className="rounded-lg border border-white/20 bg-white/12 p-6 backdrop-blur">
            <p className="text-sm uppercase tracking-[0.25em] text-amber-200">
              Coaching and Strategic Consulting
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
              <div className="rounded-lg bg-white/12 p-4">
                <span className="block text-3xl font-semibold">30+</span>
                years of professional experience
              </div>
              <div className="rounded-lg bg-white/12 p-4">
                <span className="block text-3xl font-semibold">HCD</span>
                holistic consciousness methodology
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">
            About Me
          </p>
          <h2 className="mt-3 text-4xl font-semibold">Burak Akcakanat</h2>
          <div className="relative mt-8 aspect-[4/5] overflow-hidden rounded-lg">
            <Image src="/assets/burak-akcakanat.png" alt="Burak Akcakanat" fill className="object-cover" />
          </div>
        </div>
        <div className="self-center text-lg leading-8 text-stone-700">
          {aboutParagraphs.map((paragraph) => (
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
              Store
            </p>
            <h2 className="mt-3 text-4xl font-semibold">Human Consciousness Decoded</h2>
            <p className="mt-4 text-stone-600">
              Books, digital products and training materials from the public
              Shaman Life catalog.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">
            Coaching
          </p>
          <h2 className="mt-3 text-4xl font-semibold">Personalized Solutions</h2>
          <p className="mt-4 text-stone-600">
            Coaching and guidance processes designed for each person,
            professional and institution.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </section>

      <section className="bg-stone-950 text-white">
        <div className="section">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-300">
            Testimonial
          </p>
          <h2 className="mt-3 text-4xl font-semibold">What my clients say</h2>
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
            Blog
          </p>
          <h2 className="mt-3 text-4xl font-semibold">Latest writing</h2>
          <div className="mt-8 grid gap-4">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="rounded-lg border border-stone-200 bg-white p-5 hover:border-amber-600">
                <h3 className="text-xl font-semibold">{post.title}</h3>
                <p className="mt-2 text-sm leading-6 text-stone-600">{post.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">
            Events
          </p>
          <h2 className="mt-3 text-4xl font-semibold">Constant Events</h2>
          <div className="mt-8 grid gap-4">
            {events.map((event) => (
              <Link key={event.slug} href="/events" className="rounded-lg border border-stone-200 bg-white p-5 hover:border-amber-600">
                <p className="text-sm text-amber-700">{event.date ?? "Program date announced by request"}</p>
                <h3 className="mt-2 text-xl font-semibold">{event.title}</h3>
                <p className="mt-2 text-sm leading-6 text-stone-600">{event.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
