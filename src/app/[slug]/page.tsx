import { notFound } from "next/navigation";
import { staticPages } from "@/lib/content";
import { getPage } from "@/lib/repository";

export function generateStaticParams() {
  return staticPages.map((page) => ({ slug: page.slug }));
}

export default async function StaticPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) notFound();

  return (
    <main className="section max-w-4xl">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">
        Shaman Life
      </p>
      <h1 className="mt-3 text-5xl font-semibold">{page.title}</h1>
      <article className="mt-8 whitespace-pre-line text-lg leading-8 text-stone-700">
        {page.body}
      </article>
    </main>
  );
}
