import Link from "next/link";

import { SectionHeading } from "@/app/components/marketplace/section-heading";
import { SiteHeader } from "@/app/components/marketplace/site-header";
import {
  marketplacePrinciples,
  marketplaceStats,
  sellingSteps,
  trustedMeetupSpots,
} from "@/app/lib/marketplace-data";

const productPillars = [
  {
    title: "Built for fixed prices",
    copy: "Listings use fixed prices instead of auctions.",
  },
  {
    title: "Local-first trust",
    copy: "Meetup spots, response times, and ratings are easy to check.",
  },
  {
    title: "Created for collectors",
    copy: "Profiles and listings stay focused on the cards and the deal.",
  },
] as const;

const brandSections = [
  {
    eyebrow: "About PTC",
    title: "A card marketplace without auctions.",
    description:
      "Pepe Trading Cards is built for buying, selling, and trading through listings, messages, and public meetups.",
  },
  {
    eyebrow: "Why it exists",
    title: "The goal is simple.",
    description:
      "Show the card, show the price, and make it easy to message the seller.",
  },
] as const;

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      <main className="flex-1 bg-white">
        <section className="border-b border-slate-200">
          <div className="mx-auto grid w-full max-w-7xl gap-14 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24">
            <div className="max-w-4xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                Pepe Trading Cards
              </p>
              <h1 className="mt-6 text-5xl font-semibold leading-[1.02] tracking-tight text-slate-950 sm:text-6xl">
                Buy, sell, and trade cards without auctions.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-500">
                PTC uses fixed prices, direct messages, and public meetup
                details to keep card deals simple.
              </p>

              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  href="/marketplace"
                  className="rounded-full bg-emerald-700 px-5 py-3 font-medium text-white transition hover:bg-emerald-800"
                >
                  Enter marketplace
                </Link>
                <Link
                  href="/create-listing"
                  className="rounded-full border border-emerald-200 px-5 py-3 font-medium text-emerald-700 transition hover:bg-emerald-50"
                >
                  Start selling
                </Link>
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-[#fbfefb] p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                Core ideas
              </p>
              <div className="mt-6 space-y-6">
                {marketplacePrinciples.map((principle) => (
                  <div
                    key={principle.title}
                    className="border-b border-slate-200 pb-6 last:border-b-0 last:pb-0"
                  >
                    <p className="text-lg font-semibold text-slate-950">
                      {principle.title}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-slate-500">
                      {principle.copy}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-[#fbfefb]">
          <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
            {marketplaceStats.map((stat) => (
              <div key={stat.label} className="py-2">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  {stat.label}
                </p>
                <p className="mt-3 font-mono text-3xl font-semibold text-slate-950">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8">
            {brandSections.map((section) => (
              <div key={section.title}>
                <SectionHeading
                  eyebrow={section.eyebrow}
                  title={section.title}
                  description={section.description}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Product pillars"
              title="The product stays focused on the deal."
              description="The main product choices are simple and practical."
            />

            <div className="mt-10 grid gap-8 lg:grid-cols-3">
              {productPillars.map((pillar) => (
                <div
                  key={pillar.title}
                  className="rounded-[24px] border border-slate-200 bg-[#fbfefb] p-6"
                >
                  <p className="text-lg font-semibold text-slate-950">
                    {pillar.title}
                  </p>
                  <p className="mt-4 text-sm leading-7 text-slate-500">
                    {pillar.copy}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-[#fbfefb]">
          <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div>
              <SectionHeading
                eyebrow="How it works"
                title="How it works"
                description="List the card, reply in chat, and meet in public."
              />
              <div className="mt-8 space-y-8">
                {sellingSteps.map((step, index) => (
                  <div
                    key={step}
                    className="flex gap-5 border-b border-slate-200 pb-6"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-sm font-semibold text-white">
                      {index + 1}
                    </span>
                    <p className="text-base leading-7 text-slate-500">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <SectionHeading
                eyebrow="Meetup spots"
                title="Public places for local deals."
                description="Collectors can use known meetup spots to keep deals straightforward."
              />
              <div className="mt-8 space-y-6">
                {trustedMeetupSpots.map((spot) => (
                  <div key={spot.name} className="border-b border-slate-200 pb-6">
                    <p className="text-lg font-semibold text-slate-950">
                      {spot.name}
                    </p>
                    <p className="mt-1 text-sm font-medium text-emerald-700">
                      {spot.city}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-slate-500">
                      {spot.note}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <div className="rounded-[32px] border border-slate-200 bg-[#fbfefb] px-6 py-10 sm:px-8 lg:px-12">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                Next step
              </p>
              <h2 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950">
                Browse the marketplace or post a listing.
              </h2>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/marketplace"
                  className="rounded-full bg-emerald-700 px-5 py-3 font-medium text-white transition hover:bg-emerald-800"
                >
                  Go to marketplace
                </Link>
                <Link
                  href="/create-listing"
                  className="rounded-full border border-emerald-200 px-5 py-3 font-medium text-emerald-700 transition hover:bg-emerald-50"
                >
                  Create listing
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
