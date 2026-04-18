import { instrumentSans } from "@/app/fonts";
import { SiteHeader } from "@/app/components/marketplace/site-header";

export default function CommunityPage() {
  return (
    <>
      <SiteHeader />

      <main className="bg-white">
        <section className="border-b border-slate-200">
          <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Community
            </p>
            <h1
              className={`${instrumentSans.className} mt-4 max-w-3xl text-5xl font-semibold leading-[1.02] tracking-tight text-slate-950 sm:text-6xl`}
            >
              Meet other collectors outside the listing grid.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-500">
              Community is where collectors share pickups, talk shop, plan
              meetup events, and build trust beyond a single transaction.
            </p>
          </div>
        </section>

        <section className="bg-[#fbfefb]">
          <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-3 lg:px-8">
            {[
              {
                title: "Collector posts",
                copy: "Share recent pickups, trade targets, and collection updates.",
              },
              {
                title: "Local meetup circles",
                copy: "Stay in touch with nearby collectors and recurring card events.",
              },
              {
                title: "Reputation and trust",
                copy: "Build familiarity through conversations, replies, and repeat deals.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-[24px] border border-slate-200 bg-white p-6"
              >
                <p className="text-lg font-semibold text-slate-950">
                  {item.title}
                </p>
                <p className="mt-4 text-sm leading-7 text-slate-500">
                  {item.copy}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
