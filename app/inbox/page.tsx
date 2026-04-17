import type { Metadata } from "next";

import { SectionHeading } from "@/app/components/marketplace/section-heading";
import { SiteHeader } from "@/app/components/marketplace/site-header";
import { inboxPreview } from "@/app/lib/marketplace-data";
import { requireSession } from "@/lib/auth-session";

export const metadata: Metadata = {
  title: "Inbox",
};

export default async function InboxPage() {
  const session = await requireSession("/inbox");

  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-white">
        <section className="border-b border-slate-200">
          <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading
              eyebrow="Inbox"
              title="Messages"
              description={`Signed in as ${session.user.email}`}
            />
          </div>
        </section>

        <section className="bg-[#fbfefb]">
          <div className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
              {inboxPreview.map((message) => (
                <div
                  key={message.buyer}
                  className="border-b border-slate-200 px-6 py-5 last:border-b-0"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-slate-950">
                        {message.buyer}
                      </p>
                      <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-500">
                        {message.message}
                      </p>
                    </div>
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                      {message.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
