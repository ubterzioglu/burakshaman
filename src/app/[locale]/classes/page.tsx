import { ServiceCard } from "@/components/cards";
import { services } from "@/lib/content";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

export const metadata = {
  title: "Classes",
};

export default async function ClassesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  return (
    <main className="section">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">
        {dict.sections.classes}
      </p>
      <h1 className="mt-3 text-5xl font-semibold">
        {locale === "tr" ? "Eğitimler" : "Educational Studies"}
      </h1>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-stone-700">
        {locale === "tr"
          ? "Kişisel gelişim, liderlik ve bütünsel farkındalığı destekleyen eğitimler."
          : "Trainings that help personal development, leadership and holistic integrity."}
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {services.map((service) => (
          <ServiceCard key={service.slug} service={service} locale={locale} />
        ))}
      </div>
    </main>
  );
}
