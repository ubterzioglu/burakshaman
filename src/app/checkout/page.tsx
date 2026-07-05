import Link from "next/link";

export const metadata = {
  title: "Checkout",
};

export default function CheckoutPage() {
  return (
    <main className="section">
      <h1 className="text-5xl font-semibold">Checkout</h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-700">
        Select a product from the store to start a PayTR checkout session.
      </p>
      <Link href="/store" className="button mt-8">
        Go to store
      </Link>
    </main>
  );
}
