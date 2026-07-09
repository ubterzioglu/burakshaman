import { CheckoutClient } from "@/components/checkout-client";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

export const metadata = {
  title: "Checkout",
};

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  return (
    <main className="section">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">
        {dict.actions.checkout}
      </p>
      <h1 className="mt-3 text-5xl font-semibold">
        {locale === "tr" ? "Ödeme" : "Checkout"}
      </h1>
      <CheckoutClient />
    </main>
  );
}
