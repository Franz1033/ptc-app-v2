import Image from "next/image";

import type { Listing } from "@/app/lib/marketplace-data";

type CardArtProps = {
  listing: Listing;
  compact?: boolean;
};

export function CardArt({ listing, compact = false }: CardArtProps) {
  return (
    <div
      className="relative aspect-[4/3] overflow-hidden rounded-[22px] border border-slate-200 bg-slate-100 shadow-[0_8px_24px_rgba(15,23,42,0.05)]"
    >
      <Image
        src={listing.imageSrc}
        alt={listing.title}
        fill
        sizes={
          compact
            ? "(min-width: 1280px) 24vw, (min-width: 768px) 40vw, 100vw"
            : "(min-width: 1024px) 42vw, 100vw"
        }
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(15,23,42,0.08))]" />
      <div className="absolute left-3 bottom-3">
        <span className="rounded-full bg-white/92 px-3 py-1 text-xs font-medium text-slate-700 shadow-[0_8px_18px_rgba(15,23,42,0.12)] backdrop-blur-sm">
          {listing.grade ?? listing.condition}
        </span>
      </div>
    </div>
  );
}
