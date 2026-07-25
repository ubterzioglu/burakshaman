import Link from "next/link";
import { getSession } from "@/lib/auth";
import { getDb, hasDatabase } from "@/lib/db";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { l, type Locale } from "@/lib/i18n/config";
import { buildNoIndexMetadata } from "@/lib/seo";

type AccountOrder = {
  id: string;
  merchantOid: string;
  status: string;
  totalCents: number;
  currency: string;
};

type AccountBooking = {
  id: string;
  serviceName: string;
  status: string;
  startsAt: Date | null;
};

export const metadata = buildNoIndexMetadata(
  "My Account",
  "Customer account area for orders, bookings and session access.",
);

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const session = await getSession();
  const history =
    session && hasDatabase()
      ? await getDb().user.findUnique({
          where: { id: session.userId },
          include: {
            orders: {
              include: { items: true },
              orderBy: { createdAt: "desc" },
              take: 10,
            },
            bookings: {
              orderBy: { createdAt: "desc" },
              take: 10,
            },
          },
        })
      : null;

  return (
    <main className="section">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">
        {dict.nav.account}
      </p>
      <h1 className="mt-3 text-5xl font-semibold">
        {locale === "tr" ? "Hesabım" : "My Account"}
      </h1>
      {session ? (
        <div className="mt-8 rounded-lg border border-stone-200 bg-white p-6">
          <p className="font-semibold">{session.email}</p>
          <p className="mt-2 text-stone-600">
            Order and booking history appears below when records are connected
            to your account.
          </p>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <section>
              <h2 className="text-xl font-semibold">Orders</h2>
              <div className="mt-3 grid gap-3">
                {(history?.orders ?? []).length === 0 ? (
                  <p className="text-sm text-stone-500">No orders yet.</p>
                ) : (
                  history?.orders.map((order: AccountOrder) => (
                    <div key={order.id} className="rounded-lg border border-stone-200 p-4">
                      <p className="font-semibold">{order.merchantOid}</p>
                      <p className="text-sm text-stone-600">
                        {order.status} | {(order.totalCents / 100).toFixed(2)} {order.currency}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </section>
            <section>
              <h2 className="text-xl font-semibold">Bookings</h2>
              <div className="mt-3 grid gap-3">
                {(history?.bookings ?? []).length === 0 ? (
                  <p className="text-sm text-stone-500">No bookings yet.</p>
                ) : (
                  history?.bookings.map((booking: AccountBooking) => (
                    <div key={booking.id} className="rounded-lg border border-stone-200 p-4">
                      <p className="font-semibold">{booking.serviceName}</p>
                      <p className="text-sm text-stone-600">
                        {booking.status}
                        {booking.startsAt ? ` | ${booking.startsAt.toLocaleString()}` : ""}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
          <form action="/api/auth/logout" method="post" className="mt-5">
            <button className="button">{dict.actions.logout}</button>
          </form>
        </div>
      ) : (
        <div className="mt-8 max-w-xl">
          <Link className="button" href={l(locale, "/admin/login")}>
            {locale === "tr" ? "Yönetici Girişi" : "Admin Login"}
          </Link>
        </div>
      )}
    </main>
  );
}
