"use client";

import { usePathname } from "next/navigation";

/**
 * Hides the public site chrome (header, footer, WhatsApp button) on admin
 * routes so the admin area — including the login panel — is a clean, full-screen
 * surface. Header/footer/whatsapp are passed as pre-rendered elements.
 */
export function ChromeGate({
  header,
  footer,
  whatsapp,
  children,
}: {
  header: React.ReactNode;
  footer: React.ReactNode;
  whatsapp: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname() || "";
  const segments = pathname.split("/").filter(Boolean); // [locale, section, ...]
  const isAdmin = segments[1] === "admin";

  if (isAdmin) {
    return <div className="flex-1">{children}</div>;
  }

  return (
    <>
      {header}
      <div className="flex-1">{children}</div>
      {footer}
      {whatsapp}
    </>
  );
}
