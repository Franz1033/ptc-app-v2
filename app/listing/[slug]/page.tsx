import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { instrumentSans } from "@/app/fonts";
import { CardArt } from "@/app/components/marketplace/card-art";
import { ListingCard } from "@/app/components/marketplace/listing-card";
import { SectionHeading } from "@/app/components/marketplace/section-heading";
import { SiteHeader } from "@/app/components/marketplace/site-header";
import {
  formatCurrency,
  getListingBySlug,
  getRelatedListings,
  listings,
} from "@/app/lib/marketplace-data";

type ListingPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return listings.map((listing) => ({
    slug: listing.slug,
  }));
}

export async function generateMetadata({
  params,
}: ListingPageProps): Promise<Metadata> {
  const { slug } = await params;
  const listing = getListingBySlug(slug);

  if (!listing) {
    return {
      title: "Listing not found",
    };
  }

  return {
    title: `${listing.title} in ${listing.location}`,
    description: `${listing.subtitle} Listed at ${formatCurrency(
      listing.price
    )} with a trade target of ${formatCurrency(listing.tradeValue)}.`,
  };
}

export default async function ListingPage({ params }: ListingPageProps) {
  const { slug } = await params;
  const listing = getListingBySlug(slug);

  if (!listing) {
    notFound();
  }

  const relatedListings = getRelatedListings(slug);

  return (
    <>
      <SiteHeader />

      <main className="flex-1 bg-white">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                Listing
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-950">
                {listing.location} - {listing.distance}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/marketplace"
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
              >
                Back to marketplace
              </Link>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto grid w-full max-w-7xl gap-14 px-4 py-14 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-20">
            <div className="space-y-8">
              <CardArt listing={listing} />

            <div className="flex flex-wrap gap-2">
              {listing.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-slate-200 bg-[#fbfefb] px-3 py-1 text-xs font-medium text-slate-600"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="grid gap-6 border-t border-slate-200 pt-6 sm:grid-cols-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Posted
                </p>
                <p className="mt-3 text-lg font-semibold text-slate-950">
                  {listing.posted}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Delivery
                </p>
                <p className="mt-3 text-lg font-semibold text-slate-950">
                  {listing.shipping}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Seller rating
                </p>
                <p className="mt-3 text-lg font-semibold text-slate-950">
                  {listing.seller.rating}
                </p>
              </div>
            </div>
          </div>

            <div className="flex flex-col">
              <div className="inline-flex w-fit rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                Listing details
              </div>
              <h1
                className={`${instrumentSans.className} mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl`}
              >
                {listing.title}
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-500">
                {listing.subtitle}
              </p>
              <p className="mt-6 max-w-3xl text-base leading-7 text-slate-500">
                {listing.description}
              </p>

            <div className="mt-10 grid gap-8 border-y border-slate-200 py-8 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Buy now
                </p>
                <p className="mt-3 text-5xl font-semibold tracking-tight text-slate-950">
                  {formatCurrency(listing.price)}
                </p>
                <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500">
                  Fixed price.
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Trade target
                </p>
                <p className="mt-3 text-5xl font-semibold tracking-tight text-slate-950">
                  {formatCurrency(listing.tradeValue)}
                </p>
                <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500">
                  Target trade value.
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                className="rounded-full bg-emerald-800 px-5 py-3 font-medium text-white transition hover:bg-emerald-700"
              >
                Message seller
              </button>
              <button
                type="button"
                className="rounded-full border border-emerald-200 bg-emerald-50 px-5 py-3 font-medium text-emerald-800 transition hover:bg-emerald-100"
              >
                Save listing
              </button>
              <button
                type="button"
                className="rounded-full border border-slate-200 px-5 py-3 font-medium text-slate-700 transition hover:bg-[#fbfefb] hover:text-slate-950"
              >
                Share listing
              </button>
            </div>

            <div className="mt-10 grid gap-8 border-t border-slate-200 pt-8 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  Seller
                </p>
                <p className="mt-3 text-2xl font-semibold text-slate-950">
                  {listing.seller.name}
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  {listing.seller.badge}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  Meetup
                </p>
                <p className="mt-3 text-2xl font-semibold text-slate-950">
                  {listing.meetupSpot}
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Preferred public meetup spot.
                </p>
              </div>
            </div>
          </div>
        </div>
        </section>

        <section className="border-b border-slate-200 bg-[#fbfefb]">
        <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <SectionHeading
              eyebrow="Card profile"
              title="Card details"
              description="Basic card information."
            />

            <dl className="mt-8 border-t border-slate-200">
              {[
                ["Set", listing.set],
                ["Card number", listing.cardNumber],
                ["Condition", listing.grade ?? listing.condition],
                ["Rarity", listing.rarity],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-4 border-b border-slate-200 py-4"
                >
                  <dt className="text-sm text-slate-500">{label}</dt>
                  <dd className="text-right text-sm font-medium text-slate-950">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <SectionHeading
              eyebrow="Deal details"
              title="Deal details"
              description="Location, shipping, and reply time."
            />

            <dl className="mt-8 border-t border-slate-200">
              {[
                ["Location", listing.location],
                ["Distance", listing.distance],
                ["Shipping", listing.shipping],
                ["Response time", listing.seller.responseTime],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-4 border-b border-slate-200 py-4"
                >
                  <dt className="text-sm text-slate-500">{label}</dt>
                  <dd className="text-right text-sm font-medium text-slate-950">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        </section>

        <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div>
            <SectionHeading
              eyebrow="Seller profile"
              title="Seller profile"
              description="A quick view of the seller."
            />

            <div className="mt-8 grid gap-6 border-t border-slate-200 pt-6 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Collector focus
                </p>
                <p className="mt-3 text-base leading-7 text-slate-950">
                  {listing.seller.collectorFocus}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Account history
                </p>
                <p className="mt-3 text-base leading-7 text-slate-950">
                  {listing.seller.sales} completed local deals
                </p>
                <p className="text-base leading-7 text-slate-950">
                  Member since {listing.seller.memberSince}
                </p>
              </div>
            </div>
          </div>

          <div>
            <SectionHeading
              eyebrow="What the seller wants"
              title="Trade targets"
              description="What the seller is looking for."
            />

            <div className="mt-8 border-t border-slate-200">
              {listing.wants.map((want) => (
                <div key={want} className="border-b border-slate-200 py-4">
                  <p className="text-base leading-7 text-slate-950">{want}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        </section>

        <section className="bg-white">
        <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Similar cards"
            title="Similar listings"
            description="Other cards you may want to view."
          />
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {relatedListings.map((relatedListing) => (
              <ListingCard key={relatedListing.slug} listing={relatedListing} />
            ))}
          </div>
        </div>
        </section>
      </main>
    </>
  );
}
