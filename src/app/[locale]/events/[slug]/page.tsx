import Image from "next/image";
import { notFound } from "next/navigation";
import { events } from "@/lib/content";
import { getEvent } from "@/lib/repository";
import { HtmlContent } from "@/components/html-content";
import { TicketForm } from "@/components/ticket-form";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

export function generateStaticParams() {
  return events.map((event) => ({ slug: event.slug }));
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string; locale: Locale }>;
}) {
  const { slug, locale } = await params;
  const dict = getDictionary(locale);
  const event = await getEvent(slug);
  if (!event) notFound();

  return (
    <main className="section max-w-5xl">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">
        {dict.sections.events}
      </p>
      <h1 className="mt-3 text-5xl font-semibold">{event.title}</h1>
      <p className="mt-3 text-amber-700">
        {event.date ?? dict.common.dateByRequest} · {event.location}
      </p>
      {event.image && (
        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-lg">
          <Image src={event.image} alt={event.title} fill className="object-cover" />
        </div>
      )}
      <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_0.6fr]">
        <div>
          {event.body ? (
            <HtmlContent html={event.body} className="prose prose-stone max-w-none text-lg leading-8 prose-a:text-amber-700 prose-img:rounded-lg" />
          ) : (
            <p className="text-lg leading-8 text-stone-700">{event.description}</p>
          )}
        </div>
        <aside>
          <TicketForm slug={event.slug} locale={locale} />
        </aside>
      </div>
    </main>
  );
}
