import Link from "next/link";
import { getSession } from "@/lib/auth";

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
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {modules.map((module) => (
            <div key={module} className="rounded-lg border border-stone-200 bg-white p-5">
              <h2 className="text-xl font-semibold">{module}</h2>
              <p className="mt-2 text-sm text-stone-600">
                CRUD screens connect to the Prisma models created for this
                module.
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
