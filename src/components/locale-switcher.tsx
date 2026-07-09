"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale, isLocale } from "@/lib/i18n/config";

export function LocaleSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname() || "/";

  function pathFor(target: Locale) {
    const segments = pathname.split("/");
    // segments[0] === "" ; segments[1] === current locale (if present)
    if (segments[1] && isLocale(segments[1])) {
      segments[1] = target;
    } else {
      segments.splice(1, 0, target);
    }
    return segments.join("/") || `/${target}`;
  }

  return (
    <div className="flex items-center gap-1 text-xs font-semibold uppercase">
      {locales.map((loc) => (
        <Link
          key={loc}
          href={pathFor(loc)}
          className={
            loc === locale
              ? "rounded px-1.5 py-0.5 text-amber-700"
              : "rounded px-1.5 py-0.5 text-stone-400 hover:text-stone-700"
          }
          aria-current={loc === locale ? "true" : undefined}
        >
          {loc}
        </Link>
      ))}
    </div>
  );
}
