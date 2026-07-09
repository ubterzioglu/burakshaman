"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCart } from "@/lib/cart";
import { formatTry } from "@/lib/content";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { l, isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";

type State = "idle" | "loading" | "success" | "error";

export function CheckoutClient() {
  const params = useParams();
  const raw = Array.isArray(params.locale) ? params.locale[0] : params.locale;
  const locale: Locale = raw && isLocale(raw) ? raw : defaultLocale;
  const dict = getDictionary(locale);
  const { items, totalCents, clear } = useCart();

  const [state, setState] = useState<State>("idle");
  const [iframeToken, setIframeToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    setError(null);
    const form = new FormData(event.currentTarget);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ slug: i.slug, quantity: i.quantity })),
          customerName: form.get("customerName"),
          customerEmail: form.get("customerEmail"),
          customerPhone: form.get("customerPhone"),
          billingAddress: form.get("billingAddress"),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Checkout failed");
      setIframeToken(data.iframeToken ?? null);
      setState("success");
      clear();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed");
      setState("error");
    }
  }

  if (items.length === 0 && !iframeToken) {
    return (
      <div className="mt-8">
        <p className="text-stone-600">{dict.cart.empty}</p>
        <Link href={l(locale, "/store")} className="button-small mt-5 inline-flex">
          {dict.cart.continue}
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-2">
      <div>
        <h2 className="text-xl font-semibold">{dict.cart.title}</h2>
        <div className="mt-4 grid gap-2 text-sm">
          {items.map((i) => (
            <div key={i.slug} className="flex justify-between border-b border-stone-100 pb-2">
              <span>
                {i.name} × {i.quantity}
              </span>
              <span className="font-semibold">{formatTry(i.priceCents * i.quantity)}</span>
            </div>
          ))}
          <div className="flex justify-between pt-2 text-base font-semibold">
            <span>{dict.cart.total}</span>
            <span>{formatTry(totalCents)}</span>
          </div>
        </div>
      </div>

      <div>
        {!iframeToken ? (
          <form className="form-panel" onSubmit={submit}>
            <input name="customerName" placeholder={dict.forms.name} required />
            <input name="customerEmail" type="email" placeholder={dict.forms.email} required />
            <input name="customerPhone" placeholder={dict.forms.phone} required />
            <textarea name="billingAddress" placeholder={dict.forms.billingAddress} rows={4} required />
            <button disabled={state === "loading" || items.length === 0}>
              {state === "loading" ? dict.actions.preparing : dict.actions.startCheckout}
            </button>
            {state === "error" && (
              <p className="text-sm text-red-700">{error ?? dict.forms.contactError}</p>
            )}
          </form>
        ) : (
          <iframe
            src={`https://www.paytr.com/odeme/guvenli/${iframeToken}`}
            className="min-h-[720px] w-full rounded-lg border border-stone-200"
            title="PayTR checkout"
          />
        )}
      </div>
    </div>
  );
}
