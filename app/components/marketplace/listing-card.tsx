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
      className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.05)] transition duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_14px_28px_rgba(15,23,42,0.06)]"
    >
      <CardArt listing={listing} compact />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
              {listing.location}
            </p>
            <h3 className="mt-2 text-xl font-semibold leading-tight text-slate-950">
              {listing.title}
            </h3>
          </div>
          <p className="shrink-0 text-xl font-semibold tracking-tight text-slate-950">
            {formatCurrency(listing.price)}
          </p>
        </div>
        <p className="text-sm leading-6 text-slate-500">{listing.set}</p>
      </div>
    </Link>
  );
}
