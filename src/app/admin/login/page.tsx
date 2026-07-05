import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export const metadata = {
  title: "Admin Login",
};

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session?.role === "ADMIN") {
    redirect("/admin");
  }

  return (
    <main className="section max-w-xl">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">
        Admin
      </p>
      <h1 className="mt-3 text-5xl font-semibold">Admin Login</h1>
      <form className="form-panel mt-8" action="/api/auth/login" method="post">
        <input
          name="password"
          type="password"
          placeholder="Admin password"
          autoComplete="current-password"
          required
        />
        <button>Login</button>
      </form>
    </main>
  );
}
