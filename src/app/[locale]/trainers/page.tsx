import Image from "next/image";
import Link from "next/link";
import { listTrainers } from "@/lib/repository";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { l, type Locale } from "@/lib/i18n/config";

export const metadata = {
  title: "Trainers",
};

export default async function TrainersPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const trainers = await listTrainers();

  return (
    <main className="section">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">
        {dict.sections.trainers}
      </p>
      <h1 className="mt-3 text-5xl font-semibold">
        {locale === "tr" ? "Eğitmenler" : "Trainers"}
      </h1>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {trainers.map((t) => (
          <Link
            key={t.slug}
            href={l(locale, `/trainers/${t.slug}`)}
            className="group overflow-hidden rounded-lg border border-stone-200 bg-white transition hover:border-amber-600"
          >
            {t.image && (
              <div className="relative aspect-square">
                <Image
                  src={t.image}
                  alt={t.name}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
              </div>
            )}
            <div className="p-5">
              <h2 className="text-xl font-semibold">{t.name}</h2>
              {t.job && <p className="mt-1 text-sm text-amber-700">{t.job}</p>}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
