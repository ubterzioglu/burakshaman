export const locales = ["tr", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "tr";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Prefix an internal path with the active locale, e.g. l("tr", "/store") -> "/tr/store". */
export function l(locale: Locale, path = "/"): string {
  if (!path.startsWith("/")) path = `/${path}`;
  if (path === "/") return `/${locale}`;
  return `/${locale}${path}`;
}
