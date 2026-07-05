import { ServiceCard } from "@/components/cards";
import { services } from "@/lib/content";

export const metadata = {
  title: "Classes",
};

export default function ClassesPage() {
  return (
    <main className="section">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">
        Classes
      </p>
      <h1 className="mt-3 text-5xl font-semibold">Educational Studies</h1>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-stone-700">
        Trainings that help personal development, leadership and holistic
        integrity.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {services.map((service) => (
          <ServiceCard key={service.slug} service={service} />
        ))}
      </div>
    </main>
  );
}
