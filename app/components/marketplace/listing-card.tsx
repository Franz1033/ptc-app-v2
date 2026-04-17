import Link from "next/link";

import { CardArt } from "@/app/components/marketplace/card-art";
import { formatCurrency, type Listing } from "@/app/lib/marketplace-data";

type ListingCardProps = {
  listing: Listing;
};

export function ListingCard({ listing }: ListingCardProps) {
  return (
    <Link
      href={`/listing/${listing.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-slate-200 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.05)] transition duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_14px_28px_rgba(15,23,42,0.06)]"
    >
      <CardArt listing={listing} compact />
      <div className="mt-4 flex flex-1 flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
              {listing.location}
            </p>
            <h3 className="mt-2 text-xl font-semibold text-slate-950">
              {listing.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {listing.subtitle}
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 px-3 py-2 text-right">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Buy now
            </p>
            <p className="mt-1 text-lg font-semibold text-slate-950">
              {formatCurrency(listing.price)}
            </p>
          </div>
        </div>

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

        <div className="mt-auto grid gap-3 rounded-[20px] border border-slate-200 bg-[#fbfefb] p-4 text-sm text-slate-600 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Trade target
            </p>
            <p className="mt-2 font-mono text-base text-slate-950">
              {formatCurrency(listing.tradeValue)}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Seller
            </p>
            <p className="mt-2 text-slate-950">{listing.seller.name}</p>
            <p className="text-slate-500">{listing.seller.responseTime}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
