import { ContactForm, NewsletterForm } from "@/components/forms";
import { site } from "@/lib/content";

export const metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <main className="section grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">
          Contact
        </p>
        <h1 className="mt-3 text-5xl font-semibold">Get in touch</h1>
        <div className="mt-8 space-y-4 text-lg leading-8 text-stone-700">
          <p>{site.address}</p>
          <p>{site.phone}</p>
          <p>{site.email}</p>
        </div>
        <div className="mt-10 rounded-lg bg-amber-50 p-5">
          <h2 className="font-semibold">Subscribe!</h2>
          <p className="mt-2 text-sm text-stone-600">
            Sign up for the newsletter and do not miss new trainings.
          </p>
          <div className="mt-5">
            <NewsletterForm />
          </div>
        </div>
      </div>
      <ContactForm />
    </main>
  );
}
