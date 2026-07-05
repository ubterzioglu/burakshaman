import { getSession } from "@/lib/auth";

export const metadata = {
  title: "My Account",
};

export default async function AccountPage() {
  const session = await getSession();

  return (
    <main className="section">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">
        My Account
      </p>
      <h1 className="mt-3 text-5xl font-semibold">Customer Account</h1>
      {session ? (
        <div className="mt-8 rounded-lg border border-stone-200 bg-white p-6">
          <p className="font-semibold">{session.email}</p>
          <p className="mt-2 text-stone-600">
            Order and booking history will appear here after database-backed
            purchases and appointment requests.
          </p>
          <form action="/api/auth/logout" method="post" className="mt-5">
            <button className="button">Logout</button>
          </form>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <form className="form-panel" action="/api/auth/login" method="post">
            <h2 className="text-2xl font-semibold">Login</h2>
            <input name="email" type="email" placeholder="Email" required />
            <input name="password" type="password" placeholder="Password" required />
            <button>Login</button>
          </form>
          <form className="form-panel" action="/api/auth/register" method="post">
            <h2 className="text-2xl font-semibold">Register</h2>
            <input name="name" placeholder="Name" required />
            <input name="email" type="email" placeholder="Email" required />
            <input name="phone" placeholder="Phone" />
            <input name="password" type="password" placeholder="Password" required />
            <button>Create account</button>
          </form>
        </div>
      )}
    </main>
  );
}
