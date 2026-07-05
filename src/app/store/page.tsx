import { ProductCard } from "@/components/cards";
import { products } from "@/lib/content";

export const metadata = {
  title: "E-Store",
};

export default function StorePage() {
  return (
    <main className="section">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">
        E-Store
      </p>
      <h1 className="mt-3 text-5xl font-semibold">Books and Digital Products</h1>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </main>
  );
}
