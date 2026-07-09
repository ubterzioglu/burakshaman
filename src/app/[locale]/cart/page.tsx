"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCart } from "@/lib/cart";
import { formatTry } from "@/lib/content";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { l, isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";

export default function CartPage() {
  const params = useParams();
  const raw = Array.isArray(params.locale) ? params.locale[0] : params.locale;
  const locale: Locale = raw && isLocale(raw) ? raw : defaultLocale;
  const dict = getDictionary(locale);
  const { items, totalCents, setQuantity, remove } = useCart();

  return (
    <main className="section max-w-4xl">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">
        {dict.nav.cart}
      </p>
      <h1 className="mt-3 text-5xl font-semibold">{dict.cart.title}</h1>

      {items.length === 0 ? (
        <div className="mt-8">
          <p className="text-stone-600">{dict.cart.empty}</p>
          <Link href={l(locale, "/store")} className="button-small mt-5 inline-flex">
            {dict.cart.continue}
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-4">
            {items.map((item) => (
              <div
                key={item.slug}
                className="flex items-center gap-4 rounded-lg border border-stone-200 bg-white p-4"
              >
                {item.image && (
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{item.name}</p>
                  <p className="text-sm text-stone-600">{formatTry(item.priceCents)}</p>
                </div>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={item.quantity}
                  onChange={(e) => setQuantity(item.slug, Number(e.target.value))}
                  className="input w-16"
                  aria-label={dict.forms.quantity}
                />
                <span className="w-24 text-right font-semibold">
                  {formatTry(item.priceCents * item.quantity)}
                </span>
                <button
                  type="button"
                  onClick={() => remove(item.slug)}
                  className="text-sm text-red-600 hover:underline"
                >
                  {dict.cart.remove}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-stone-200 pt-6">
            <span className="text-lg font-semibold">{dict.cart.total}</span>
            <span className="text-2xl font-semibold">{formatTry(totalCents)}</span>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Link href={l(locale, "/store")} className="button-small">
              {dict.cart.continue}
            </Link>
            <Link href={l(locale, "/checkout")} className="button">
              {dict.cart.proceed}
            </Link>
          </div>
        </>
      )}
    </main>
  );
}
