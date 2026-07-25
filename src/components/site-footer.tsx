import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { site } from "@/lib/content";
import { l, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function SiteFooter({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <footer className="border-t border-stone-200 bg-stone-950 text-stone-100">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:grid-cols-[1.3fr_0.7fr_0.7fr] lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-amber-300">
            {site.name}
          </p>
          <h2 className="mt-3 text-2xl font-semibold">{site.owner}</h2>
          <div className="mt-5 space-y-3 text-sm leading-6 text-stone-300">
            <p className="flex gap-3">
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-amber-300" />
              {site.address}
            </p>
            <p className="flex gap-3">
              <Phone className="mt-1 h-4 w-4 shrink-0 text-amber-300" />
              {site.phone}
            </p>
            <p className="flex gap-3">
              <Mail className="mt-1 h-4 w-4 shrink-0 text-amber-300" />
              {site.email}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-400">
            {dict.footer.site}
          </h3>
          <div className="mt-4 grid gap-2 text-sm text-stone-300">
            <Link href={l(locale, "/about-me")}>{dict.nav.about}</Link>
            <Link href={l(locale, "/classes")}>{dict.nav.classes}</Link>
            <Link href={l(locale, "/trainers")}>{dict.sections.trainers}</Link>
            <Link href={l(locale, "/blog")}>{dict.nav.blog}</Link>
            <Link href={l(locale, "/events")}>{dict.nav.events}</Link>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-400">
            {dict.footer.customer}
          </h3>
          <div className="mt-4 grid gap-2 text-sm text-stone-300">
            <Link href={l(locale, "/store")}>{dict.nav.store}</Link>
            <Link href={l(locale, "/bookings")}>{dict.nav.booking}</Link>
            <Link href={l(locale, "/account")}>{dict.footer.myAccount}</Link>
            <Link href={l(locale, "/privacy-policy")}>{dict.footer.privacy}</Link>
            <span><a href="https://ufuksoynakliyat.com.tr/tuzla-evden-eve-nakliyat" rel="dofollow">Tuzla Evden Eve Nakliyat</a> Firması Ufuksoy Nakliyat A.Ş</span>
            <span><a href="https://tekhurdametal.com/beylikduzu-hurdaci/" rel="dofollow">Beylikdüzü Hurdacı</a> Firması Tek Hurda Metal A.Ş</span>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-stone-400">
        &copy; {site.name} — {site.owner}. {dict.footer.rights}
      </div>
    </footer>
  );
}
