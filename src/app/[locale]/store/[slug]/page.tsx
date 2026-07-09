import Image from "next/image";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/add-to-cart";
import { formatTry, products } from "@/lib/content";
import { getProduct } from "@/lib/repository";
import type { Locale } from "@/lib/i18n/config";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string; locale: Locale }>;
}) {
  const { slug, locale } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  return (
    <main className="section grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-stone-200">
        <Image src={product.image} alt={product.name} fill className="object-cover" />
      </div>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">
          {product.category}
        </p>
        <h1 className="mt-3 text-5xl font-semibold">{product.name}</h1>
        <p className="mt-5 text-2xl font-semibold">{formatTry(product.priceCents)}</p>
        <p className="mt-6 text-lg leading-8 text-stone-700">{product.description}</p>
        <div className="mt-8">
          <AddToCart
            product={{
              slug: product.slug,
              name: product.name,
              priceCents: product.priceCents,
              image: product.image,
            }}
            locale={locale}
          />
        </div>
      </div>
    </main>
  );
}
