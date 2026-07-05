import Image from "next/image";
import { notFound } from "next/navigation";
import { CheckoutForm } from "@/components/forms";
import { formatTry, products } from "@/lib/content";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
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
          <CheckoutForm productSlug={product.slug} />
        </div>
      </div>
    </main>
  );
}
