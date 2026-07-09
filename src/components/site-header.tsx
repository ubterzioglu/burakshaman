"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarDays, Menu, ShoppingBag, UserRound, X } from "lucide-react";
import { site } from "@/lib/content";
import { l, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { useCart } from "@/lib/cart";
import { LocaleSwitcher } from "@/components/locale-switcher";

export function SiteHeader({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [open, setOpen] = useState(false);
  const { count } = useCart();

  const nav = [
    { href: l(locale, "/about-me"), label: dict.nav.about },
    { href: l(locale, "/classes"), label: dict.nav.classes },
    { href: l(locale, "/blog"), label: dict.nav.blog },
    { href: l(locale, "/store"), label: dict.nav.store },
    { href: l(locale, "/events"), label: dict.nav.events },
    { href: l(locale, "/bookings"), label: dict.nav.booking },
    { href: l(locale, "/contact"), label: dict.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/92 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link href={l(locale, "/")} className="leading-tight">
          <span className="block text-xs font-semibold uppercase tracking-[0.28em] text-amber-700">
            {site.name}
          </span>
          <span className="block text-sm font-medium text-stone-700">
            {site.owner}
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-stone-700 lg:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-amber-700">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LocaleSwitcher locale={locale} />
          <Link className="icon-link" href={l(locale, "/bookings")} aria-label={dict.nav.booking}>
            <CalendarDays size={18} />
          </Link>
          <Link className="icon-link relative" href={l(locale, "/cart")} aria-label={dict.nav.cart}>
            <ShoppingBag size={18} />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-600 px-1 text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>
          <Link className="icon-link" href={l(locale, "/account")} aria-label={dict.nav.account}>
            <UserRound size={18} />
          </Link>
          <button
            type="button"
            className="icon-link lg:hidden"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-stone-200 bg-white px-5 py-3 lg:hidden">
          <div className="grid gap-1 text-sm font-medium text-stone-700">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded px-2 py-2 hover:bg-stone-50 hover:text-amber-700"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
