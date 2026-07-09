import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getDb, hasDatabase } from "@/lib/db";

export const metadata = {
  title: "Admin",
};

const modules = [
  "Pages",
  "Posts",
  "Products",
  "Classes and Events",
  "Bookings",
  "Orders",
  "Contact Messages",
  "Newsletter Leads",
  "Settings",
];

const missingItems = [
  {
    title: "Çift dilli içerik ve dil değiştirici",
    status: "Tamamlandı",
    detail:
      "TR/EN [locale] route yapısı, dil değiştirici, sözlük tabanlı arayüz çevirisi ve proxy yönlendirmesi eklendi. TR birincil dil.",
  },
  {
    title: "Gerçek içerik göçü (blog, ürün, sayfa, etkinlik)",
    status: "Tamamlandı",
    detail:
      "WP Rocket cache'inden ~44 gerçek sayfa (18 blog, 6 ürün, 5 etkinlik, 10+ sayfa, eğitmen) ve görseller çıkarılıp içerik modeline ve seed'e aktarıldı.",
  },
  {
    title: "Etkinlik detay ve biletleme",
    status: "Tamamlandı",
    detail:
      "Etkinlik detay sayfaları (görsel + içerik) ve kodlu bilet oluşturma (QR token) eklendi. QR görseli için qrcode paketi ileride eklenecek.",
  },
  {
    title: "Sepet ve çok ürünlü ödeme",
    status: "Tamamlandı",
    detail:
      "İstemci tarafı sepet, mini-cart rozeti, sepet/checkout sayfaları ve DB ürünleri üzerinden çok kalemli PayTR ödemesi. Eski statik-ürün hatası giderildi.",
  },
  {
    title: "Eğitmen profilleri",
    status: "Tamamlandı",
    detail: "Eğitmen dizini ve profil sayfaları (bio + görsel) DB/fallback ile eklendi.",
  },
  {
    title: "Blog yorumları",
    status: "Kısmen",
    detail:
      "PostComment modeli şemaya eklendi; yorum formu ve moderasyon arayüzü sonraki adımda bağlanacak.",
  },
  {
    title: "Randevu (slot bazlı) sistemi",
    status: "Kısmen",
    detail:
      "Service/AvailabilitySlot şeması hazır; mevcut basit randevu formu çalışıyor. BookingPress benzeri slot seçici ileride tamamlanacak.",
  },
  {
    title: "Ders programı takvimi (FullCalendar)",
    status: "Kısmen",
    detail:
      "Class/Trainer/Level/Room şeması hazır; ancak cache'de haftalık ders programı verisi bulunmadığından takvim boş. Veri girildiğinde aktif olacak.",
  },
  {
    title: "Rusça (RU) dili ve bülten kampanya gönderimi",
    status: "Sonra",
    detail:
      "Şema/i18n RU için hazır ancak yalnızca TR+EN bağlandı. Bülten aboneliği çalışıyor; kampanya gönderimi kapsam dışı.",
  },
];

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getSession();
  const isAdmin = session?.role === "ADMIN";
  if (!isAdmin) {
    redirect(`/${locale}/admin/login`);
  }

  const dashboard =
    isAdmin && hasDatabase()
      ? await Promise.all([
          getDb().product.count(),
          getDb().post.count(),
          getDb().page.count(),
          getDb().event.count(),
          getDb().booking.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
          getDb().order.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
          getDb().contactMessage.findMany({
            orderBy: { createdAt: "desc" },
            take: 6,
          }),
          getDb().newsletterSubscriber.count(),
          getDb().revisionRequest.findMany({
            include: {
              comments: { include: { author: true }, orderBy: { createdAt: "asc" } },
              createdBy: true,
            },
            orderBy: { createdAt: "desc" },
            take: 12,
          }),
          getDb().revisionRequest.count(),
        ])
      : null;

  return (
    <main className="section">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">
            Admin
          </p>
          <h1 className="mt-3 text-5xl font-semibold">Site Management</h1>
        </div>
        <nav className="flex flex-wrap gap-2">
          <Link href={`/${locale}/admin/rapor`} className="button-small">
            📊 Parite Raporu
          </Link>
          <Link href="#revisions" className="button-small">
            Revizyonlar
          </Link>
          <Link href="#missing-items" className="button-small">
            Eksik Kalanlar
          </Link>
        </nav>
      </div>
      <>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {[
              ["Products", dashboard?.[0] ?? 0],
              ["Posts", dashboard?.[1] ?? 0],
              ["Pages", dashboard?.[2] ?? 0],
              ["Events", dashboard?.[3] ?? 0],
              ["Newsletter", dashboard?.[7] ?? 0],
              ["Revisions", dashboard?.[9] ?? 0],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-stone-200 bg-white p-5">
                <p className="text-sm text-stone-500">{label}</p>
                <p className="mt-2 text-3xl font-semibold">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <section className="rounded-lg border border-stone-200 bg-white p-5">
              <h2 className="text-xl font-semibold">Recent bookings</h2>
              <div className="mt-4 grid gap-3 text-sm">
                {(dashboard?.[4] ?? []).map((booking) => (
                  <div key={booking.id} className="border-b border-stone-100 pb-3">
                    <p className="font-semibold">{booking.name}</p>
                    <p className="text-stone-600">{booking.serviceName} | {booking.status}</p>
                  </div>
                ))}
              </div>
            </section>
            <section className="rounded-lg border border-stone-200 bg-white p-5">
              <h2 className="text-xl font-semibold">Recent orders</h2>
              <div className="mt-4 grid gap-3 text-sm">
                {(dashboard?.[5] ?? []).map((order) => (
                  <div key={order.id} className="border-b border-stone-100 pb-3">
                    <p className="font-semibold">{order.merchantOid}</p>
                    <p className="text-stone-600">{order.status} | {(order.totalCents / 100).toFixed(2)} {order.currency}</p>
                  </div>
                ))}
              </div>
            </section>
            <section className="rounded-lg border border-stone-200 bg-white p-5">
              <h2 className="text-xl font-semibold">Messages</h2>
              <div className="mt-4 grid gap-3 text-sm">
                {(dashboard?.[6] ?? []).map((message) => (
                  <div key={message.id} className="border-b border-stone-100 pb-3">
                    <p className="font-semibold">{message.name}</p>
                    <p className="text-stone-600">{message.email} | {message.handled ? "Handled" : "Open"}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
          <section id="revisions" className="mt-8 rounded-lg border border-stone-200 bg-white p-5">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <h2 className="text-2xl font-semibold">Revision Requests</h2>
                <p className="mt-2 text-sm text-stone-600">
                  Submit site revision requests and keep comments attached to each item.
                </p>
              </div>
              <Link href="#revisions" className="button-small">
                New revision
              </Link>
            </div>

            <form className="mt-6 grid gap-3 rounded-lg bg-stone-50 p-4" action="/api/admin/revisions" method="post">
              <div className="grid gap-3 md:grid-cols-[1fr_0.7fr_0.4fr]">
                <input name="title" placeholder="Revision title" required />
                <input name="targetPath" placeholder="Page or URL, e.g. /store" />
                <select name="priority" defaultValue="normal">
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <textarea name="description" placeholder="Describe the requested change" rows={4} required />
              <button className="button justify-self-start">Submit revision</button>
            </form>

            <div className="mt-6 grid gap-4">
              {(dashboard?.[8] ?? []).length === 0 ? (
                <p className="text-sm text-stone-500">No revision requests yet.</p>
              ) : (
                (dashboard?.[8] ?? []).map((revision) => (
                  <article key={revision.id} className="rounded-lg border border-stone-200 p-4">
                    <div className="flex flex-col justify-between gap-3 md:flex-row">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                          {revision.priority} | {revision.status}
                        </p>
                        <h3 className="mt-2 text-xl font-semibold">{revision.title}</h3>
                        {revision.targetPath && (
                          <p className="mt-1 text-sm text-stone-500">{revision.targetPath}</p>
                        )}
                      </div>
                      <form action={`/api/admin/revisions/${revision.id}`} method="post">
                        <select name="status" defaultValue={revision.status} className="input min-w-36">
                          <option value="OPEN">Open</option>
                          <option value="IN_REVIEW">In review</option>
                          <option value="DONE">Done</option>
                          <option value="ARCHIVED">Archived</option>
                        </select>
                        <button className="button-small mt-2 w-full">Update</button>
                      </form>
                    </div>
                    <p className="mt-4 whitespace-pre-line text-sm leading-6 text-stone-700">
                      {revision.description}
                    </p>

                    <div className="mt-5 grid gap-3 border-t border-stone-100 pt-4">
                      {revision.comments.map((comment) => (
                        <div key={comment.id} className="rounded-lg bg-stone-50 p-3 text-sm">
                          <p className="font-semibold">
                            {comment.author?.name ?? "Admin"}{" "}
                            <span className="font-normal text-stone-500">
                              {comment.createdAt.toLocaleString()}
                            </span>
                          </p>
                          <p className="mt-2 whitespace-pre-line text-stone-700">{comment.body}</p>
                        </div>
                      ))}
                      <form
                        action={`/api/admin/revisions/${revision.id}/comments`}
                        method="post"
                        className="grid gap-2"
                      >
                        <textarea name="body" placeholder="Add a comment" rows={2} required />
                        <button className="button-small justify-self-start">Add comment</button>
                      </form>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
          <section id="missing-items" className="mt-8 rounded-lg border border-stone-200 bg-white p-5">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <h2 className="text-2xl font-semibold">Eksik Kalanlar</h2>
                <p className="mt-2 text-sm text-stone-600">
                  Baz alinan eski Shaman Life sitesinden yeni yapida birebir alinmayan veya kismen tasinan alanlar.
                </p>
              </div>
              <Link href="#revisions" className="button-small">
                Revizyon ac
              </Link>
            </div>

            <div className="mt-6 grid gap-3">
              {missingItems.map((item) => (
                <article key={item.title} className="rounded-lg border border-stone-200 p-4">
                  <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <span className="self-start rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-amber-800 md:self-auto">
                      {item.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-stone-700">{item.detail}</p>
                </article>
              ))}
            </div>
          </section>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {modules.map((module) => (
              <div key={module} className="rounded-lg border border-stone-200 bg-white p-5">
                <h2 className="text-xl font-semibold">{module}</h2>
                <p className="mt-2 text-sm text-stone-600">
                  Manage through `/api/admin/*` endpoints with an ADMIN session.
                </p>
              </div>
            ))}
          </div>
        </>
    </main>
  );
}
