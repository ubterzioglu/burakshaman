"use client";

import { useState } from "react";

type FormState = "idle" | "loading" | "success" | "error";

async function submitForm(endpoint: string, form: HTMLFormElement) {
  const payload = Object.fromEntries(new FormData(form).entries());
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Request failed");
  return response.json();
}

export function ContactForm() {
  const [state, setState] = useState<FormState>("idle");

  return (
    <form
      className="form-panel"
      onSubmit={async (event) => {
        event.preventDefault();
        setState("loading");
        try {
          await submitForm("/api/contact", event.currentTarget);
          event.currentTarget.reset();
          setState("success");
        } catch {
          setState("error");
        }
      }}
    >
      <input name="name" placeholder="Name" required />
      <input name="email" type="email" placeholder="Email" required />
      <input name="phone" placeholder="Phone" />
      <input name="subject" placeholder="Subject" />
      <textarea name="message" placeholder="Message" required rows={6} />
      <button disabled={state === "loading"}>{state === "loading" ? "Sending..." : "Send"}</button>
      {state === "success" && <p>Your message was received.</p>}
      {state === "error" && <p>Could not send the message. Check server configuration.</p>}
    </form>
  );
}

export function NewsletterForm() {
  const [state, setState] = useState<FormState>("idle");

  return (
    <form
      className="flex flex-col gap-3 sm:flex-row"
      onSubmit={async (event) => {
        event.preventDefault();
        setState("loading");
        try {
          await submitForm("/api/newsletter", event.currentTarget);
          event.currentTarget.reset();
          setState("success");
        } catch {
          setState("error");
        }
      }}
    >
      <input className="input" name="name" placeholder="Name" />
      <input className="input" name="email" type="email" placeholder="Email" required />
      <button className="button" disabled={state === "loading"}>
        Subscribe
      </button>
      {state === "success" && <span className="text-sm text-green-700">Subscribed.</span>}
      {state === "error" && <span className="text-sm text-red-700">Could not subscribe.</span>}
    </form>
  );
}

export function BookingForm({
  serviceSlug,
  serviceName,
}: {
  serviceSlug?: string;
  serviceName?: string;
}) {
  const [state, setState] = useState<FormState>("idle");

  return (
    <form
      className="form-panel"
      onSubmit={async (event) => {
        event.preventDefault();
        setState("loading");
        try {
          await submitForm("/api/bookings", event.currentTarget);
          event.currentTarget.reset();
          setState("success");
        } catch {
          setState("error");
        }
      }}
    >
      <input name="serviceSlug" type="hidden" value={serviceSlug ?? "consultation"} />
      <input name="serviceName" type="hidden" value={serviceName ?? "Consultation"} />
      <input name="name" placeholder="Name" required />
      <input name="email" type="email" placeholder="Email" required />
      <input name="phone" placeholder="Phone" required />
      <input name="startsAt" type="datetime-local" />
      <textarea name="message" placeholder="Message" rows={5} />
      <button disabled={state === "loading"}>{state === "loading" ? "Sending..." : "Request booking"}</button>
      {state === "success" && <p>Your booking request was received.</p>}
      {state === "error" && <p>Could not create booking. Check server configuration.</p>}
    </form>
  );
}

export function CheckoutForm({ productSlug }: { productSlug: string }) {
  const [state, setState] = useState<FormState>("idle");
  const [iframeToken, setIframeToken] = useState<string | null>(null);

  return (
    <div className="grid gap-6">
      <form
        className="form-panel"
        onSubmit={async (event) => {
          event.preventDefault();
          setState("loading");
          try {
            const data = await submitForm("/api/checkout", event.currentTarget);
            setIframeToken(data.iframeToken ?? null);
            setState("success");
          } catch {
            setState("error");
          }
        }}
      >
        <input name="productSlug" type="hidden" value={productSlug} />
        <input name="quantity" type="number" min="1" max="10" defaultValue="1" />
        <input name="customerName" placeholder="Name" required />
        <input name="customerEmail" type="email" placeholder="Email" required />
        <input name="customerPhone" placeholder="Phone" required />
        <textarea name="billingAddress" placeholder="Billing address" rows={4} required />
        <button disabled={state === "loading"}>{state === "loading" ? "Preparing..." : "Start PayTR checkout"}</button>
        {state === "error" && <p>Checkout could not start. Check payment and database configuration.</p>}
      </form>
      {iframeToken && (
        <iframe
          src={`https://www.paytr.com/odeme/guvenli/${iframeToken}`}
          className="min-h-[720px] w-full rounded-lg border border-stone-200"
          title="PayTR checkout"
        />
      )}
    </div>
  );
}
