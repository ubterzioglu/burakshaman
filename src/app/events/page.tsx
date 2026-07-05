import { events } from "@/lib/content";

export const metadata = {
  title: "Events",
};

export default function EventsPage() {
  return (
    <main className="section">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">
        Events
      </p>
      <h1 className="mt-3 text-5xl font-semibold">Constant Events</h1>
      <div className="mt-10 grid gap-5">
        {events.map((event) => (
          <article key={event.slug} className="rounded-lg border border-stone-200 bg-white p-6">
            <p className="text-sm font-semibold text-amber-700">
              {event.date ?? "Date by request"} | {event.location}
            </p>
            <h2 className="mt-2 text-2xl font-semibold">{event.title}</h2>
            <p className="mt-3 leading-7 text-stone-700">{event.description}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
