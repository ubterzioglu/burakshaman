import Image from "next/image";
import Link from "next/link";
import { formatTry } from "@/lib/content";

export function ProductCard({
  product,
}: {
  product: {
    slug: string;
    name: string;
    category: string;
    priceCents: number;
    description: string;
    image: string;
  };
}) {
  return (
    <article className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
      <div className="relative aspect-[4/3]">
        <Image src={product.image} alt={product.name} fill className="object-cover" />
      </div>
      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
          {product.category}
        </p>
        <h3 className="mt-2 text-xl font-semibold text-stone-950">
          {product.name}
        </h3>
        <p className="mt-3 text-sm leading-6 text-stone-600">
          {product.description}
        </p>
        <div className="mt-5 flex items-center justify-between gap-4">
          <span className="font-semibold text-stone-950">
            {formatTry(product.priceCents)}
          </span>
          <Link className="button-small" href={`/store/${product.slug}`}>
            View
          </Link>
        </div>
      </div>
    </article>
  );
}

export function ServiceCard({
  service,
}: {
  service: { slug: string; title: string; text: string; image: string };
}) {
  return (
    <article className="group overflow-hidden rounded-lg border border-stone-200 bg-white">
      <div className="relative aspect-[4/3]">
        <Image
          src={service.image}
          alt={service.title}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <h3 className="text-xl font-semibold text-stone-950">{service.title}</h3>
        <p className="mt-3 text-sm leading-6 text-stone-600">{service.text}</p>
        <Link className="mt-5 inline-flex text-sm font-semibold text-amber-700" href="/bookings">
          Book a session
        </Link>
      </div>
    </article>
  );
}
