import { ProductCard } from "@/components/cards";
import { listProducts } from "@/lib/repository";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "E-Store",
  description:
    "Human Consciousness Decoded kitaplari, dijital urunler ve egitim materyalleri.",
  path: "/store",
  keywords: ["e-store", "digital products", "books", "Human Consciousness Decoded"],
});

export default async function StorePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const products = await listProducts();

  return (
    <main className="section">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">
        {dict.nav.store}
      </p>
      <h1 className="mt-3 text-5xl font-semibold">
        {locale === "tr" ? "Kitaplar ve Dijital Ürünler" : "Books and Digital Products"}
      </h1>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} locale={locale} />
        ))}
      </div>
    </main>
  );
}
