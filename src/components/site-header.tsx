import Link from "next/link";
import { CalendarDays, ShoppingBag, UserRound } from "lucide-react";
import { navItems, site } from "@/lib/content";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/92 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link href="/" className="leading-tight">
          <span className="block text-xs font-semibold uppercase tracking-[0.28em] text-amber-700">
            {site.name}
          </span>
          <span className="block text-sm font-medium text-stone-700">
            {site.owner}
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-stone-700 lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-amber-700">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link className="icon-link" href="/bookings" aria-label="Bookings">
            <CalendarDays size={18} />
          </Link>
          <Link className="icon-link" href="/store" aria-label="Store">
            <ShoppingBag size={18} />
          </Link>
          <Link className="icon-link" href="/account" aria-label="Account">
            <UserRound size={18} />
          </Link>
        </div>
      </div>
    </header>
  );
}
