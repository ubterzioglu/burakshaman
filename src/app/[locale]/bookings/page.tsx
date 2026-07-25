import { BookingForm } from "@/components/forms";
import { services } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Bookings",
  description:
    "Kocluk ve rehberlik randevusu talebi olusturun. Ozel seanslar ve uygunluk takibi bu sayfadan yapilir.",
  path: "/bookings",
  keywords: ["booking", "randevu", "coaching session"],
});

export default function BookingsPage() {
  return (
    <main className="section grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">
          Bookings
        </p>
        <h1 className="mt-3 text-5xl font-semibold">Private Appointments</h1>
        <p className="mt-5 text-lg leading-8 text-stone-700">
          Request a coaching or guidance session. The admin panel tracks new
          requests and confirms availability.
        </p>
        <div className="mt-8 grid gap-3">
          {services.map((service) => (
            <div key={service.slug} className="rounded-lg border border-stone-200 bg-white p-4">
              <h2 className="font-semibold">{service.title}</h2>
              <p className="mt-1 text-sm text-stone-600">{service.text}</p>
            </div>
          ))}
        </div>
      </div>
      <BookingForm />
    </main>
  );
}
