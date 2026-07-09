"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

type State = "idle" | "loading" | "success" | "error";

export function TicketForm({ slug, locale }: { slug: string; locale: Locale }) {
  const dict = getDictionary(locale);
  const [state, setState] = useState<State>("idle");
  const [codes, setCodes] = useState<string[]>([]);

  const labels = locale === "tr"
    ? { title: "Bilet Al", cta: "Bilet Al", success: "Biletiniz oluşturuldu. Kodlarınız:" }
    : { title: "Get Ticket", cta: "Get Ticket", success: "Your ticket was issued. Your codes:" };

  return (
    <div className="rounded-lg border border-stone-200 bg-white p-6">
      <h2 className="text-xl font-semibold">{labels.title}</h2>
      {state === "success" ? (
        <div className="mt-4">
          <p className="text-sm text-green-700">{labels.success}</p>
          <div className="mt-3 grid gap-2">
            {codes.map((c) => (
              <div
                key={c}
                className="rounded-lg border border-dashed border-amber-400 bg-amber-50 px-4 py-3 text-center font-mono text-lg font-semibold tracking-widest text-amber-800"
              >
                {c}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <form
          className="mt-4 grid gap-3"
          onSubmit={async (event) => {
            event.preventDefault();
            setState("loading");
            const form = new FormData(event.currentTarget);
            try {
              const res = await fetch(`/api/events/${slug}/tickets`, {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                  name: form.get("name"),
                  email: form.get("email"),
                  phone: form.get("phone"),
                  quantity: Number(form.get("quantity") ?? 1),
                }),
              });
              const data = await res.json();
              if (!res.ok) throw new Error(data?.error ?? "failed");
              setCodes(data.tickets ?? []);
              setState("success");
            } catch {
              setState("error");
            }
          }}
        >
          <input name="name" placeholder={dict.forms.name} required />
          <input name="email" type="email" placeholder={dict.forms.email} required />
          <input name="phone" placeholder={dict.forms.phone} />
          <input name="quantity" type="number" min={1} max={6} defaultValue={1} aria-label={dict.forms.quantity} />
          <button disabled={state === "loading"}>
            {state === "loading" ? dict.actions.sending : labels.cta}
          </button>
          {state === "error" && (
            <p className="text-sm text-red-700">{dict.forms.bookingError}</p>
          )}
        </form>
      )}
    </div>
  );
}
