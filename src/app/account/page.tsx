import Link from "next/link";
import { getSession } from "@/lib/auth";
import { getDb, hasDatabase } from "@/lib/db";

export const metadata = {
  title: "My Account",
};

export default async function AccountPage() {
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
        My Account
      </p>
      <h1 className="mt-3 text-5xl font-semibold">Admin Login</h1>
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
                  history?.orders.map((order) => (
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
                  history?.bookings.map((booking) => (
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
            <button className="button">Logout</button>
          </form>
        </div>
      ) : (
        <div className="mt-8 max-w-xl">
          <Link className="button" href="/admin/login">
            Admin Login
          </Link>
        </div>
      )}
    </main>
  );
}
