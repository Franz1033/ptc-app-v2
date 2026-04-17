import type { Metadata } from "next";

import { SectionHeading } from "@/app/components/marketplace/section-heading";
import { SiteHeader } from "@/app/components/marketplace/site-header";
import { sellingSteps } from "@/app/lib/marketplace-data";
import { requireSession } from "@/lib/auth-session";

const formSections = [
  {
    title: "Card details",
    fields: ["Title", "Set and card number", "Condition or grade"],
  },
  {
    title: "Deal setup",
    fields: ["Fixed price", "Optional trade target", "Meetup preference"],
  },
  {
    title: "Trust signals",
    fields: ["Photos", "Delivery options", "Notes for buyers"],
  },
] as const;

export const metadata: Metadata = {
  title: "Create Listing",
};

export default async function CreateListingPage() {
  const session = await requireSession("/create-listing");

  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-white">
        <section className="border-b border-slate-200">
          <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading
              eyebrow="Create listing"
              title="Post a card"
              description={`Signed in as ${session.user.email}`}
            />
          </div>
        </section>

        <section className="border-b border-slate-200 bg-[#fbfefb]">
          <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-3 lg:px-8">
            {formSections.map((section) => (
              <div
                key={section.title}
                className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.05)]"
              >
                <p className="text-sm font-semibold text-slate-950">
                  {section.title}
                </p>
                <div className="mt-5 space-y-3">
                  {section.fields.map((field) => (
                    <div
                      key={field}
                      className="rounded-2xl border border-slate-200 bg-[#fbfefb] px-4 py-3 text-sm text-slate-500"
                    >
                      {field}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Posting workflow"
              title="Posting steps"
              description="A short path from photos to meetup."
            />
            <div className="mt-8 grid gap-6 border-t border-slate-200 pt-8 sm:grid-cols-3">
              {sellingSteps.map((step, index) => (
                <div key={step}>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                    Step {index + 1}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
