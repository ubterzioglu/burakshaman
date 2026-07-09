"use client";

import { useState } from "react";

export function AdminLoginForm({
  adminUrl,
  labels,
}: {
  adminUrl: string;
  labels: { placeholder: string; button: string; loading: string; error: string };
}) {
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");

  return (
    <form
      className="mt-8 grid gap-4"
      onSubmit={async (event) => {
        event.preventDefault();
        setState("loading");
        const password = new FormData(event.currentTarget).get("password");
        try {
          const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ password }),
            redirect: "manual",
          });
          // 303 redirect on success surfaces as an opaqueredirect / status 0.
          if (res.ok || res.status === 0 || res.type === "opaqueredirect") {
            window.location.href = adminUrl;
            return;
          }
          setState("error");
        } catch {
          setState("error");
        }
      }}
    >
      <div>
        <input
          name="password"
          type="password"
          placeholder={labels.placeholder}
          autoComplete="current-password"
          required
          autoFocus
          className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3.5 text-base outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-600/20"
        />
        {state === "error" && (
          <p className="mt-2 text-sm font-medium text-red-600">{labels.error}</p>
        )}
      </div>
      <button
        disabled={state === "loading"}
        className="w-full rounded-xl bg-stone-950 px-4 py-3.5 text-base font-semibold text-white transition hover:bg-stone-800 disabled:opacity-60"
      >
        {state === "loading" ? labels.loading : labels.button}
      </button>
    </form>
  );
}
