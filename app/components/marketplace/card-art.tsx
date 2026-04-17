import type { Listing } from "@/app/lib/marketplace-data";

type CardArtProps = {
  listing: Listing;
  compact?: boolean;
};

export function CardArt({ listing, compact = false }: CardArtProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.05)] ${
        compact ? "aspect-[4/4.8]" : "aspect-[4/5]"
      }`}
    >
      <div className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(34,197,94,0.14),rgba(255,255,255,0))]" />
      <div className="absolute inset-x-4 top-4 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
        <span className="rounded-full border border-emerald-100 bg-white px-3 py-1 text-emerald-700">
          {listing.franchise}
        </span>
        <span>{listing.cardNumber}</span>
      </div>

      <div className="absolute inset-x-4 top-[4.5rem] rounded-[18px] border border-slate-200 bg-[#fbfefb] p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
          {listing.grade ?? listing.condition}
        </p>
        <p className="mt-2 text-sm font-medium text-slate-700">
          {listing.rarity}
        </p>
      </div>

      <div className="absolute inset-x-4 bottom-4 space-y-3 text-slate-950">
        <div className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-700">
          {compact ? listing.location : listing.meetupSpot}
        </div>
        <div>
          <p className="max-w-[14ch] text-2xl font-semibold leading-tight">
            {listing.title}
          </p>
          <p className="mt-2 max-w-[26ch] text-sm leading-6 text-slate-500">
            {listing.set}
          </p>
        </div>
      </div>
    </div>
  );
}
