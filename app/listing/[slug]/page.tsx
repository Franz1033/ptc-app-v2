import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { instrumentSans } from "@/app/fonts";
import { CardArt } from "@/app/components/marketplace/card-art";
import { ListingCard } from "@/app/components/marketplace/listing-card";
import { SectionHeading } from "@/app/components/marketplace/section-heading";
import { SiteHeader } from "@/app/components/marketplace/site-header";
import {
  formatCurrency,
  listings,
} from "@/app/lib/marketplace-data";
import {
  getMarketplaceListingBySlug,
  getRelatedMarketplaceListings,
} from "@/lib/marketplace-listings";

type ListingPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function isVideoMediaPath(mediaPath: string) {
  return /\.(mp4|mov|webm|ogg)$/i.test(mediaPath);
}

export function generateStaticParams() {
  return listings.map((listing) => ({
    slug: listing.slug,
  }));
}

export async function generateMetadata({
  params,
}: ListingPageProps): Promise<Metadata> {
  const { slug } = await params;
  const listing = await getMarketplaceListingBySlug(slug);

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
  const listing = await getMarketplaceListingBySlug(slug);

  if (!listing) {
    notFound();
  }

  const relatedListings = await getRelatedMarketplaceListings(slug);
  const mediaLinks = listing.mediaUrls ?? [];
  const categoryLabel = [listing.listingCategory, listing.listingType]
    .filter(Boolean)
    .join(" / ");
  const categoryEntries = categoryLabel
    ? [
        {
          label: "Category",
          value: categoryLabel,
        },
      ]
    : [];
  const specificEntries =
    listing.specifics && listing.specifics.length > 0
      ? [
          ...categoryEntries,
          ...listing.specifics,
        ]
      : categoryEntries.length > 0
        ? [
            ...categoryEntries,
            ...(listing.set && listing.set !== categoryLabel
              ? [{ label: "Collection", value: listing.set }]
              : []),
            ...(listing.cardNumber
              ? [{ label: "Reference", value: listing.cardNumber }]
              : []),
            { label: "Condition", value: listing.grade ?? listing.condition },
          ]
      : [
          { label: "Set", value: listing.set },
          { label: "Card number", value: listing.cardNumber },
          { label: "Condition", value: listing.grade ?? listing.condition },
          { label: "Rarity", value: listing.rarity },
        ];
  const conditionEntries =
    listing.conditionDetails && listing.conditionDetails.length > 0
      ? listing.conditionDetails
      : [{ label: "Condition", value: listing.grade ?? listing.condition }];
  const deliveryEntries = [
    ...conditionEntries,
    { label: "Location", value: listing.location },
    { label: "Distance", value: listing.distance },
    { label: "Shipping", value: listing.shipping },
    { label: "Response time", value: listing.seller.responseTime },
    ...(listing.dealMethods && listing.dealMethods.length > 0
      ? [
          {
            label: "Deal methods",
            value: listing.dealMethods.join(", "),
          },
        ]
      : []),
  ];
  const hasTradeTargets = listing.wants.length > 0;
  const valueHighlights =
    listing.dealType === "buy-only"
      ? [
          {
            label: "Price",
            value: formatCurrency(listing.price),
            note: "Listed price.",
          },
          {
            label: "Delivery",
            value:
              listing.dealMethods && listing.dealMethods.length > 0
                ? listing.dealMethods.join(", ")
                : listing.shipping,
            note: "Available handoff methods.",
          },
        ]
      : [
          {
            label: "Buy now",
            value: formatCurrency(listing.price),
            note: "Fixed price.",
          },
          {
            label: "Trade target",
            value: formatCurrency(listing.tradeValue),
            note: "Target trade value.",
          },
        ];

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
              {listing.listingType ? (
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
                  {listing.listingType}
                </span>
              ) : null}
              {listing.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-slate-200 bg-[#fbfefb] px-3 py-1 text-xs font-medium text-slate-600"
                >
                  {tag}
                </span>
              ))}
            </div>

            {mediaLinks.length > 0 ? (
              <div className="rounded-[24px] border border-slate-200 bg-[#fbfefb] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  Seller media
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {mediaLinks.map((mediaLink, index) => (
                    <div
                      key={mediaLink}
                      className="group overflow-hidden rounded-[22px] border border-slate-200 bg-white transition hover:border-emerald-200"
                    >
                      <div className="relative aspect-[4/3] bg-slate-100">
                        {isVideoMediaPath(mediaLink) ? (
                          <video
                            controls
                            preload="metadata"
                            className="h-full w-full object-cover"
                          >
                            <source src={mediaLink} />
                            Your browser does not support embedded video playback.
                          </video>
                        ) : (
                          <Image
                            src={mediaLink}
                            alt={`${listing.title} media ${index + 1}`}
                            fill
                            sizes="(min-width: 1024px) 20vw, (min-width: 640px) 40vw, 100vw"
                            className="object-cover transition duration-300 group-hover:scale-[1.02]"
                          />
                        )}
                      </div>
                      <div className="flex items-center justify-between gap-3 px-4 py-3">
                        <p className="text-sm font-medium text-slate-700">
                          {isVideoMediaPath(mediaLink) ? "Video" : "Image"} {index + 1}
                        </p>
                        <a
                          href={mediaLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700"
                        >
                          Open
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

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
              {valueHighlights.map((highlight) => (
                <div key={highlight.label}>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    {highlight.label}
                  </p>
                  <p className="mt-3 text-5xl font-semibold tracking-tight text-slate-950">
                    {highlight.value}
                  </p>
                  <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500">
                    {highlight.note}
                  </p>
                </div>
              ))}
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
              eyebrow="Specifics"
              title="Listing specifics"
              description="Structured item details captured from the listing form."
            />

            <dl className="mt-8 border-t border-slate-200">
              {specificEntries.map(({ label, value }) => (
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
              eyebrow="Condition & delivery"
              title="Condition and delivery"
              description="Condition state, handoff details, and seller response context."
            />

            <dl className="mt-8 border-t border-slate-200">
              {deliveryEntries.map(({ label, value }) => (
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
              eyebrow={hasTradeTargets ? "What the seller wants" : "Deal methods"}
              title={hasTradeTargets ? "Trade targets" : "Available handoff methods"}
              description={
                hasTradeTargets
                  ? "What the seller is looking for."
                  : "How the seller can complete the deal."
              }
            />

            <div className="mt-8 border-t border-slate-200">
              {(hasTradeTargets
                ? listing.wants
                : listing.dealMethods && listing.dealMethods.length > 0
                  ? listing.dealMethods
                  : [listing.shipping]
              ).map((item) => (
                <div key={item} className="border-b border-slate-200 py-4">
                  <p className="text-base leading-7 text-slate-950">{item}</p>
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
