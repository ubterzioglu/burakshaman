import Link from "next/link";
import { getSession } from "@/lib/auth";
import { getDb, hasDatabase } from "@/lib/db";

export const metadata = {
  title: "Admin",
};

const modules = [
  "Pages",
  "Posts",
  "Products",
  "Classes and Events",
  "Bookings",
  "Orders",
  "Contact Messages",
  "Newsletter Leads",
  "Settings",
];

export default async function AdminPage() {
  const session = await getSession();
  const isAdmin = session?.role === "ADMIN";
  const dashboard =
    isAdmin && hasDatabase()
      ? await Promise.all([
          getDb().product.count(),
          getDb().post.count(),
          getDb().page.count(),
          getDb().event.count(),
          getDb().booking.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
          getDb().order.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
          getDb().contactMessage.findMany({
            orderBy: { createdAt: "desc" },
            take: 6,
          }),
          getDb().newsletterSubscriber.count(),
        ])
      : null;

  return (
    <main className="section">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">
        Admin
      </p>
      <h1 className="mt-3 text-5xl font-semibold">Site Management</h1>
      {!isAdmin ? (
        <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-6">
          <p className="font-semibold">Admin access required.</p>
          <p className="mt-2 text-stone-700">
            Login with an ADMIN user to manage site content, orders and bookings.
          </p>
          <Link href="/account" className="button mt-5">
            Go to account
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {[
              ["Products", dashboard?.[0] ?? 0],
              ["Posts", dashboard?.[1] ?? 0],
              ["Pages", dashboard?.[2] ?? 0],
              ["Events", dashboard?.[3] ?? 0],
              ["Newsletter", dashboard?.[7] ?? 0],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-stone-200 bg-white p-5">
                <p className="text-sm text-stone-500">{label}</p>
                <p className="mt-2 text-3xl font-semibold">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <section className="rounded-lg border border-stone-200 bg-white p-5">
              <h2 className="text-xl font-semibold">Recent bookings</h2>
              <div className="mt-4 grid gap-3 text-sm">
                {(dashboard?.[4] ?? []).map((booking) => (
                  <div key={booking.id} className="border-b border-stone-100 pb-3">
                    <p className="font-semibold">{booking.name}</p>
                    <p className="text-stone-600">{booking.serviceName} | {booking.status}</p>
                  </div>
                ))}
              </div>
            </section>
            <section className="rounded-lg border border-stone-200 bg-white p-5">
              <h2 className="text-xl font-semibold">Recent orders</h2>
              <div className="mt-4 grid gap-3 text-sm">
                {(dashboard?.[5] ?? []).map((order) => (
                  <div key={order.id} className="border-b border-stone-100 pb-3">
                    <p className="font-semibold">{order.merchantOid}</p>
                    <p className="text-stone-600">{order.status} | {(order.totalCents / 100).toFixed(2)} {order.currency}</p>
                  </div>
                ))}
              </div>
            </section>
            <section className="rounded-lg border border-stone-200 bg-white p-5">
              <h2 className="text-xl font-semibold">Messages</h2>
              <div className="mt-4 grid gap-3 text-sm">
                {(dashboard?.[6] ?? []).map((message) => (
                  <div key={message.id} className="border-b border-stone-100 pb-3">
                    <p className="font-semibold">{message.name}</p>
                    <p className="text-stone-600">{message.email} | {message.handled ? "Handled" : "Open"}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {modules.map((module) => (
              <div key={module} className="rounded-lg border border-stone-200 bg-white p-5">
                <h2 className="text-xl font-semibold">{module}</h2>
                <p className="mt-2 text-sm text-stone-600">
                  Manage through `/api/admin/*` endpoints with an ADMIN session.
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
