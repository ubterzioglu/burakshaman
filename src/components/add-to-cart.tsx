"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";
import { l, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export function AddToCart({
  product,
  locale,
}: {
  product: { slug: string; name: string; priceCents: number; image?: string };
  locale: Locale;
}) {
  const dict = getDictionary(locale);
  const { add } = useCart();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <input
        type="number"
        min={1}
        max={10}
        value={qty}
        onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
        className="input w-20"
        aria-label={dict.forms.quantity}
      />
      <button
        type="button"
        className="button-small"
        onClick={() => {
          add(
            {
              slug: product.slug,
              name: product.name,
              priceCents: product.priceCents,
              image: product.image,
            },
            qty,
          );
          setAdded(true);
        }}
      >
        {dict.actions.addToCart}
      </button>
      <button
        type="button"
        className="button"
        onClick={() => {
          add(
            {
              slug: product.slug,
              name: product.name,
              priceCents: product.priceCents,
              image: product.image,
            },
            qty,
          );
          router.push(l(locale, "/checkout"));
        }}
      >
        {dict.actions.buyNow}
      </button>
      {added && (
        <span className="text-sm text-green-700">✓ {dict.nav.cart}</span>
      )}
    </div>
  );
}
