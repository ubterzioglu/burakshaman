import Image from "next/image";
import { notFound } from "next/navigation";
import { listTrainers, getTrainer } from "@/lib/repository";
import { HtmlContent } from "@/components/html-content";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

export async function generateStaticParams() {
  const trainers = await listTrainers();
  return trainers.map((t) => ({ slug: t.slug }));
}

export default async function TrainerDetailPage({
  params,
}: {
  params: Promise<{ slug: string; locale: Locale }>;
}) {
  const { slug, locale } = await params;
  const dict = getDictionary(locale);
  const trainer = await getTrainer(slug);
  if (!trainer) notFound();

  return (
    <main className="section grid max-w-5xl gap-10 lg:grid-cols-[0.7fr_1.3fr]">
      <div>
        {trainer.image && (
          <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
            <Image src={trainer.image} alt={trainer.name} fill className="object-cover" />
          </div>
        )}
      </div>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">
          {dict.common.trainer}
        </p>
        <h1 className="mt-3 text-5xl font-semibold">{trainer.name}</h1>
        {trainer.job && <p className="mt-2 text-lg text-amber-700">{trainer.job}</p>}
        {trainer.bio ? (
          <HtmlContent html={trainer.bio} className="prose prose-stone mt-6 max-w-none text-lg leading-8 prose-a:text-amber-700" />
        ) : null}
      </div>
    </main>
  );
}
