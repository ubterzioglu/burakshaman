export default function Home() {
  return (
    <main className="min-h-screen bg-[#f6f1e8] text-[#211a14]">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-between px-6 py-8 sm:px-10 lg:px-12">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#967346]">
              Shaman Life
            </p>
            <p className="mt-1 text-sm text-[#6e5b45]">Burak Akcakanat</p>
          </div>
          <a
            href="mailto:info@shamanlife.com"
            className="rounded-full border border-[#c7a36f] px-4 py-2 text-sm font-medium text-[#5c4022] transition hover:bg-[#eadbc4]"
          >
            Contact
          </a>
        </header>

        <div className="grid items-center gap-12 py-20 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[#9b6b38]">
              Coming Soon
            </p>
            <h1 className="mt-5 max-w-3xl text-5xl font-semibold leading-[1.02] text-[#1d1711] sm:text-6xl lg:text-7xl">
              Human Consciousness Decoded, rebuilt for the modern web.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#5f5142]">
              Coaching, strategic consulting, books, trainings, events and
              appointments are being moved to a new Next.js experience.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="https://wa.me/905324362909"
                className="rounded-full bg-[#1d1711] px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#3b2b1c]"
              >
                WhatsApp
              </a>
              <a
                href="mailto:info@shamanlife.com"
                className="rounded-full border border-[#b99766] px-6 py-3 text-center text-sm font-semibold text-[#3b2b1c] transition hover:bg-white/60"
              >
                info@shamanlife.com
              </a>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#d9c39e] bg-white/45 p-6 shadow-2xl shadow-[#8a6433]/10">
            <div className="aspect-[4/5] rounded-[1.5rem] bg-[linear-gradient(145deg,#2b2017,#9a7040_52%,#ead7b9)] p-8 text-white">
              <div className="flex h-full flex-col justify-between">
                <p className="text-sm uppercase tracking-[0.28em] text-[#f1dfbf]">
                  New Site
                </p>
                <div>
                  <p className="text-4xl font-semibold leading-tight">
                    Coaching and Strategic Consulting
                  </p>
                  <p className="mt-4 text-sm leading-6 text-[#f4e7d1]">
                    All services, store, events and booking flows are being
                    rebuilt with Next.js.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="border-t border-[#d8c39f] py-6 text-sm text-[#6e5b45]">
          All Rights Reserved | Shaman Coaching and Strategic Consulting
        </footer>
      </section>
    </main>
  );
}
