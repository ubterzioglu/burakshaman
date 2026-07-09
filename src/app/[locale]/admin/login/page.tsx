import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AdminLoginForm } from "@/components/admin-login-form";
import { site } from "@/lib/content";
import { l, type Locale } from "@/lib/i18n/config";

export const metadata = {
  title: "Admin Login",
};

export default async function AdminLoginPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const session = await getSession();
  if (session?.role === "ADMIN") {
    redirect(l(locale, "/admin"));
  }

  const t =
    locale === "tr"
      ? {
          eyebrow: "Yönetim Paneli",
          heading: "Shaman Life Yönetimi",
          subtitle: "Devam etmek için yönetici şifrenizi girin.",
          placeholder: "Yönetici şifresi",
          button: "Giriş Yap",
          loading: "Giriş yapılıyor...",
          error: "Geçersiz yönetici şifresi.",
          brandTag: "Human Consciousness Decoded",
          brandLine: "Koçluk, eğitimler, mağaza ve içerik — hepsi tek panelde.",
          note: "Yalnızca yetkili yöneticiler içindir.",
          back: "← Siteye dön",
          feat: ["İçerik & ürün yönetimi", "Sipariş, randevu ve bilet takibi", "Çift dilli (TR/EN) yayın"],
        }
      : {
          eyebrow: "Admin Panel",
          heading: "Shaman Life Admin",
          subtitle: "Enter your admin password to continue.",
          placeholder: "Admin password",
          button: "Sign In",
          loading: "Signing in...",
          error: "Invalid admin password.",
          brandTag: "Human Consciousness Decoded",
          brandLine: "Coaching, training, store and content — in one panel.",
          note: "Authorized administrators only.",
          back: "← Back to site",
          feat: ["Content & product management", "Orders, bookings and tickets", "Bilingual (TR/EN) publishing"],
        };

  return (
    <div className="grid min-h-[100dvh] lg:grid-cols-2">
      {/* Brand column */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-stone-950 p-12 text-white lg:flex">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(120% 90% at 15% 10%, rgba(180,83,9,0.55) 0%, rgba(180,83,9,0) 55%), radial-gradient(90% 70% at 90% 100%, rgba(120,53,15,0.5) 0%, rgba(0,0,0,0) 60%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 top-20 h-96 w-96 rounded-full border border-white/10"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 top-36 h-72 w-72 rounded-full border border-white/10"
        />

        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-amber-300">
            {site.name}
          </p>
          <p className="mt-1 text-sm text-stone-300">{site.owner}</p>
        </div>

        <div className="relative">
          <p className="text-sm uppercase tracking-[0.25em] text-amber-200">
            {t.brandTag}
          </p>
          <h2 className="mt-4 max-w-md text-4xl font-semibold leading-tight">
            {t.brandLine}
          </h2>
          <ul className="mt-8 grid gap-3 text-stone-200">
            {t.feat.map((f) => (
              <li key={f} className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-amber-300">✓</span>
                {f}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-stone-400">{t.note}</p>
      </div>

      {/* Form column */}
      <div className="flex items-center justify-center bg-stone-50 p-6 sm:p-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-amber-700">
              {site.name}
            </p>
          </div>
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.25em] text-amber-700 lg:mt-0">
            {t.eyebrow}
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-stone-950">{t.heading}</h1>
          <p className="mt-3 text-stone-600">{t.subtitle}</p>

          <AdminLoginForm
            adminUrl={l(locale, "/admin")}
            labels={{
              placeholder: t.placeholder,
              button: t.button,
              loading: t.loading,
              error: t.error,
            }}
          />

          <div className="mt-10 flex items-center justify-between text-sm text-stone-500">
            <Link href={l(locale, "/")} className="hover:text-amber-700">
              {t.back}
            </Link>
            <span>{site.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
