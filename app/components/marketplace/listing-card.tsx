import Image from "next/image";
import Link from "next/link";

import { formatCurrency, type Listing } from "@/app/lib/marketplace-data";

type ListingCardProps = {
  listing: Listing;
};

export function ListingCard({ listing }: ListingCardProps) {
  const conditionLabel = listing.grade ?? listing.condition;

  return (
    <Link
      href={`/listing/${listing.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.05)] transition duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_14px_32px_rgba(15,23,42,0.08)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-50">
        <Image
          src={listing.imageSrc}
          alt={listing.title}
          fill
          sizes="(min-width: 1280px) 24vw, (min-width: 768px) 40vw, 100vw"
          className="object-contain p-2 transition duration-500 group-hover:scale-[1.02]"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="min-w-0">
          <h3 className="text-[0.92rem] font-normal leading-[1.15] tracking-tight text-slate-950 sm:text-[0.96rem]">
            {listing.title}
          </h3>
          <div className="mt-2">
            <p className="text-[1.1rem] font-semibold tracking-tight text-slate-950 sm:text-[1.15rem]">
            {formatCurrency(listing.price)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-800">
            {listing.franchise}
          </span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700">
            {conditionLabel}
          </span>
        </div>

        <div className="mt-auto flex items-center gap-2 border-t border-slate-100 pt-3">
          <div
            aria-hidden="true"
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9px] font-semibold text-white"
            style={{ backgroundColor: listing.accent }}
          >
            {listing.seller.name.charAt(0)}
          </div>
          <p className="min-w-0 truncate text-[12px] font-semibold text-slate-900">
            {listing.seller.name}
          </p>
          <div className="ml-auto flex shrink-0 items-center gap-0.5 text-[10px] font-semibold text-emerald-700">
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              className="h-3 w-3"
              fill="none"
            >
              <path
                d="M8 14C10.7 11.2 12.5 9.1 12.5 6.8C12.5 4.3 10.5 2.5 8 2.5C5.5 2.5 3.5 4.3 3.5 6.8C3.5 9.1 5.3 11.2 8 14Z"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
              <circle cx="8" cy="6.75" r="1.35" fill="currentColor" />
            </svg>
            <span>{listing.location}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
