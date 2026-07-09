import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { parityReportHtml } from "@/lib/parity-report";
import { l, type Locale } from "@/lib/i18n/config";

export const metadata = {
  title: "Parite Raporu",
};

export default async function AdminReportPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const session = await getSession();
  if (session?.role !== "ADMIN") {
    redirect(l(locale, "/admin/login"));
  }

  return (
    <main className="section">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">
            Admin
          </p>
          <h1 className="mt-2 text-3xl font-semibold">Parite Raporu</h1>
        </div>
        <Link href={l(locale, "/admin")} className="button-small">
          ← Admin
        </Link>
      </div>
      <div className="mt-6 overflow-hidden rounded-lg border border-stone-200 bg-white">
        {/* Admin-gated: the report HTML is only delivered to an authenticated ADMIN. */}
        <iframe
          srcDoc={parityReportHtml}
          title="Parite Raporu"
          className="h-[80vh] w-full"
        />
      </div>
    </main>
  );
}
