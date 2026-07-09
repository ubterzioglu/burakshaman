import Image from "next/image";
import Link from "next/link";
import { listEvents } from "@/lib/repository";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { l, type Locale } from "@/lib/i18n/config";

export const metadata = {
  title: "Events",
};

export default async function EventsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const events = await listEvents();

  return (
    <main className="section">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">
        {dict.sections.events}
      </p>
      <h1 className="mt-3 text-5xl font-semibold">
        {locale === "tr" ? "Etkinlikler ve Eğitimler" : "Events and Workshops"}
      </h1>
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <Link
            key={event.slug}
            href={l(locale, `/events/${event.slug}`)}
            className="group overflow-hidden rounded-lg border border-stone-200 bg-white transition hover:border-amber-600"
          >
            <div className="relative aspect-[16/10]">
              <Image
                src={event.image}
                alt={event.title}
                fill
                className="object-cover transition duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-5">
              <p className="text-sm font-semibold text-amber-700">
                {event.date ?? dict.common.dateByRequest} · {event.location}
              </p>
              <h2 className="mt-2 text-xl font-semibold">{event.title}</h2>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-stone-600">
                {event.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
