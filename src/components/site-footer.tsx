import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { site } from "@/lib/content";

export function SiteFooter() {
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
            Site
          </h3>
          <div className="mt-4 grid gap-2 text-sm text-stone-300">
            <Link href="/about-me">About Me</Link>
            <Link href="/classes">Classes</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/events">Events</Link>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-400">
            Customer
          </h3>
          <div className="mt-4 grid gap-2 text-sm text-stone-300">
            <Link href="/store">E-Store</Link>
            <Link href="/bookings">Bookings</Link>
            <Link href="/account">My Account</Link>
            <Link href="/privacy-policy">Privacy Policy</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-stone-400">
        All Rights Reserved | Shaman Coaching and Strategic Consulting
      </div>
    </footer>
  );
}
