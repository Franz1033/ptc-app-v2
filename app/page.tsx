import Link from "next/link";

import { instrumentSans } from "@/app/fonts";
import { HeroIllustration } from "@/app/components/marketplace/hero-illustration";
import { SectionHeading } from "@/app/components/marketplace/section-heading";
import { SiteHeader } from "@/app/components/marketplace/site-header";
import {
  featuredCollections,
  marketplaceStats,
  sellingSteps,
  trustedMeetupSpots,
} from "@/app/lib/marketplace-data";

const productPillars = [
  {
    title: "Clear values up front",
    copy: "Prices and trade values are visible up front, so collectors can decide faster and message with confidence.",
  },
  {
    title: "Direct conversation first",
    copy: "Each listing is built for questions, offers, and trade talks before anyone commits to a deal.",
  },
  {
    title: "Made for collector trust",
    copy: "Profiles, response times, and seller preferences give buyers and sellers more context before they deal.",
  },
] as const;

const trustSignals = [
  "Set a cash price, trade value, or both.",
  "Talk in chat before you commit.",
  "Show key deal details clearly.",
] as const;

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      <main className="bg-white">
        <section className="relative h-[calc(100svh-var(--site-header-height))] border-b border-slate-200">
          <div className="mx-auto grid h-full w-full max-w-7xl items-center gap-14 px-4 pt-4 pb-8 sm:px-6 sm:pt-5 sm:pb-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:pt-4 lg:pb-10">
            <div className="max-w-4xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                Pepe Trading Cards
              </p>
              <h1
                className={`${instrumentSans.className} mt-6 text-5xl font-semibold leading-[1.02] tracking-tight text-slate-950 sm:text-6xl`}
              >
                The social marketplace for trading cards.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-500">
                Build your collector profile, connect with buyers and sellers,
                and make card deals through listings, chat, and trusted
                collector context.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/marketplace"
                  className="group inline-flex h-14 items-center gap-3 rounded-full bg-emerald-700 pl-6 pr-5 text-base font-medium text-white shadow-[0_16px_36px_rgba(104,153,78,0.22)] transition duration-200 hover:-translate-y-0.5 hover:bg-emerald-800 hover:shadow-[0_20px_42px_rgba(82,119,60,0.24)]"
                >
                  <span className="text-white">Enter marketplace</span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/16 text-white transition group-hover:bg-white/22">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 16 16"
                      className="h-4 w-4"
                      fill="none"
                    >
                      <path
                        d="M3.5 8H12.5M8.5 4L12.5 8L8.5 12"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </Link>
                <Link
                  href="/create-listing"
                  className="inline-flex h-14 items-center justify-center rounded-full border border-emerald-200 bg-white px-6 text-base font-medium text-black shadow-[0_10px_28px_rgba(15,23,42,0.05)] transition duration-200 hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-white hover:shadow-[0_14px_28px_rgba(15,23,42,0.06)]"
                >
                  Start selling
                </Link>
              </div>
            </div>

            <HeroIllustration />
          </div>

          <Link
            href="#homepage-overview"
            aria-label="Scroll to more homepage content"
            className="absolute right-5 bottom-5 inline-flex h-12 w-12 items-center justify-center rounded-full border border-emerald-700 bg-emerald-700 text-white shadow-[0_16px_34px_rgba(104,153,78,0.24)] transition duration-200 hover:-translate-y-0.5 hover:bg-emerald-800 hover:shadow-[0_20px_40px_rgba(82,119,60,0.28)] sm:right-6 sm:bottom-6 lg:right-8 lg:bottom-8"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              className="h-4 w-4 text-white"
              fill="none"
            >
              <path
                d="M8 3.5V12.5M4 8.5L8 12.5L12 8.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </section>

        <section
          id="homepage-overview"
          className="border-b border-slate-200 bg-[#fbfefb]"
        >
          <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="What PTC is"
              title="A marketplace shaped around real collector behavior."
              description="PTC is a social marketplace where collectors list cards, message directly, agree on value, and close deals with clearer context and stronger trust."
            />

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {marketplaceStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-[24px] border border-slate-200 bg-white p-6"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    {stat.label}
                  </p>
                  <p className="mt-4 font-mono text-3xl font-semibold text-slate-950">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Why PTC"
              title="Built around the way collectors actually buy, sell, and trade."
              description="The platform is designed to feel closer to a card show or local trade night, with clearer communication and stronger collector context."
            />

            <div className="mt-10 grid gap-6 lg:grid-cols-3">
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
          <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
            <div>
              <SectionHeading
                eyebrow="How it works"
                title="Browse, message, and close the deal."
                description="The core flow stays simple so buyers and sellers can move from listing to agreement without extra friction."
              />
              <div className="mt-8 space-y-5">
                {sellingSteps.map((step, index) => (
                  <div
                    key={step}
                    className="flex gap-5 rounded-[24px] border border-slate-200 bg-white p-5"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-sm font-semibold text-white">
                      {index + 1}
                    </span>
                    <p className="pt-1 text-base leading-7 text-slate-500">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <SectionHeading
                eyebrow="Trust and safety"
                title="Deals work better with context."
                description="PTC keeps key listing details, seller preferences, and profile context visible so people can make cleaner, more informed decisions."
              />

              <div className="mt-8 rounded-[28px] border border-slate-200 bg-white p-6">
                <div className="space-y-5">
                  {trustedMeetupSpots.map((spot) => (
                    <div
                      key={spot.name}
                      className="border-b border-slate-200 pb-5 last:border-b-0 last:pb-0"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <p className="text-base font-semibold text-slate-950">
                          {spot.name}
                        </p>
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                          {spot.city}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-7 text-slate-500">
                        {spot.note}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 rounded-[22px] bg-[#fbfefb] p-5">
                  <p className="text-sm font-semibold text-slate-950">
                    Every listing can support:
                  </p>
                  <div className="mt-4 space-y-3">
                    {trustSignals.map((signal) => (
                      <div key={signal} className="flex items-start gap-3">
                        <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-700" />
                        <p className="text-sm leading-6 text-slate-500">
                          {signal}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Collector activity"
              title="What people come to PTC to do."
              description="The marketplace supports quick pickups, trade-night planning, and the everyday buying and selling that happens around real collecting communities."
            />

            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {featuredCollections.map((collection) => (
                <div
                  key={collection.name}
                  className="rounded-[24px] border border-slate-200 bg-[#fbfefb] p-6"
                >
                  <span
                    className="block h-1.5 w-16 rounded-full"
                    style={{ backgroundColor: collection.accent }}
                  />
                  <p className="mt-5 text-lg font-semibold text-slate-950">
                    {collection.name}
                  </p>
                  <p className="mt-4 text-sm leading-7 text-slate-500">
                    {collection.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <div className="rounded-[32px] border border-slate-200 bg-[#fbfefb] px-6 py-10 sm:px-8 lg:px-12">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                Start on PTC
              </p>
              <h2
                className={`${instrumentSans.className} mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950`}
              >
                Join the marketplace, talk to collectors, and make your next deal.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-500">
                Browse live listings if you are buying, or post your own card if
                you want to sell or trade.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/marketplace"
                  className="group inline-flex h-14 items-center gap-3 rounded-full bg-emerald-700 pl-6 pr-5 text-base font-medium text-white shadow-[0_16px_36px_rgba(104,153,78,0.22)] transition duration-200 hover:-translate-y-0.5 hover:bg-emerald-800 hover:shadow-[0_20px_42px_rgba(82,119,60,0.24)]"
                >
                  <span className="text-white">Go to marketplace</span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/16 text-white transition group-hover:bg-white/22">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 16 16"
                      className="h-4 w-4"
                      fill="none"
                    >
                      <path
                        d="M3.5 8H12.5M8.5 4L12.5 8L8.5 12"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </Link>
                <Link
                  href="/create-listing"
                  className="inline-flex h-14 items-center justify-center rounded-full border border-emerald-200 bg-white px-6 text-base font-medium text-black shadow-[0_10px_28px_rgba(15,23,42,0.05)] transition duration-200 hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-white hover:shadow-[0_14px_28px_rgba(15,23,42,0.06)]"
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
