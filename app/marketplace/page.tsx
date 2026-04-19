import Link from "next/link";

import { instrumentSans } from "@/app/fonts";
import { ListingCard } from "@/app/components/marketplace/listing-card";
import { MarketplaceSearchControls } from "@/app/components/marketplace/marketplace-search-controls";
import { SiteHeader } from "@/app/components/marketplace/site-header";
import {
  categoryFilters,
  cityFilters,
  getSameCityFilter,
  isCategoryFilter,
  isCityFilter,
  isSortFilter,
  sortFilters,
  type SortFilter,
} from "@/app/lib/marketplace-data";
import { getSession } from "@/lib/auth-session";
import { getMarketplaceListings } from "@/lib/marketplace-listings";
import { buildSignInHref } from "@/lib/safe-redirect";

type MarketplacePageProps = {
  searchParams: Promise<{
    q?: string | string[];
    category?: string | string[];
    city?: string | string[];
    near?: string | string[];
    lat?: string | string[];
    lng?: string | string[];
    nearLabel?: string | string[];
    sort?: string | string[];
  }>;
};

function getSingleValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

export default async function MarketplacePage({
  searchParams,
}: MarketplacePageProps) {
  const session = await getSession();
  const listings = await getMarketplaceListings();
  const createListingHref = session
    ? "/create-listing"
    : buildSignInHref("/create-listing");
  const params = await searchParams;
  const query = getSingleValue(params.q).trim();

  const rawCategory = getSingleValue(params.category);
  const rawCity = getSingleValue(params.city);
  const rawNear = getSingleValue(params.near);
  const rawLatitude = getSingleValue(params.lat);
  const rawLongitude = getSingleValue(params.lng);
  const rawNearLabel = getSingleValue(params.nearLabel).trim();
  const rawSort = getSingleValue(params.sort);

  const selectedCategory = isCategoryFilter(rawCategory) ? rawCategory : "all";
  const selectedCity = isCityFilter(rawCity) ? rawCity : "all";
  const selectedLatitude = Number.parseFloat(rawLatitude);
  const selectedLongitude = Number.parseFloat(rawLongitude);
  const selectedNearMe =
    rawNear === "me" &&
    Number.isFinite(selectedLatitude) &&
    Number.isFinite(selectedLongitude);
  const selectedNearCity = selectedNearMe
    ? getSameCityFilter(selectedLatitude, selectedLongitude)
    : null;
  const selectedSort = isSortFilter(rawSort) ? rawSort : "fresh";

  const buildHref = (overrides: {
    q?: string;
    category?: string;
    city?: string;
    near?: string;
    lat?: string;
    lng?: string;
    nearLabel?: string;
    sort?: SortFilter;
  }) => {
    const nextParams = new URLSearchParams();
    const merged = {
      q: query || undefined,
      category: selectedCategory === "all" ? undefined : selectedCategory,
      city:
        selectedNearMe || selectedCity === "all" ? undefined : selectedCity,
      near: selectedNearMe ? "me" : undefined,
      lat: selectedNearMe ? String(selectedLatitude) : undefined,
      lng: selectedNearMe ? String(selectedLongitude) : undefined,
      nearLabel: selectedNearMe && rawNearLabel ? rawNearLabel : undefined,
      sort: selectedSort === "fresh" ? undefined : selectedSort,
      ...overrides,
    };

    Object.entries(merged).forEach(([key, value]) => {
      if (value) {
        nextParams.set(key, value);
      }
    });

    const search = nextParams.toString();
    return search ? `/marketplace?${search}` : "/marketplace";
  };

  const visibleListings = listings
    .filter((listing) => {
      const haystack = [
        listing.title,
        listing.subtitle,
        listing.franchise,
        listing.set,
        listing.location,
        listing.seller.name,
        listing.rarity,
      ]
        .join(" ")
        .toLowerCase();

      const matchesQuery =
        query.length === 0 || haystack.includes(query.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" ||
        listing.categories.includes(selectedCategory);

      const matchesLocation = selectedNearMe
        ? selectedNearCity
          ? listing.city === selectedNearCity.slug
          : false
        : selectedCity === "all" || listing.city === selectedCity;

      return matchesQuery && matchesCategory && matchesLocation;
    })
    .sort((left, right) => {
      if (selectedSort === "price-low") {
        return left.price - right.price;
      }

      if (selectedSort === "price-high") {
        return right.price - left.price;
      }

      if (selectedSort === "trade-value") {
        return right.tradeValue - left.tradeValue;
      }

      return left.postedRank - right.postedRank;
    });

  return (
    <>
      <SiteHeader />

      <main className="flex-1 bg-white">
        <section id="inventory" className="bg-white">
          <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
            <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2
                  className={`${instrumentSans.className} text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl`}
                >
                  Marketplace
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Browse listings from collectors, compare prices, and find cards that match your collection.
                </p>
              </div>
              <div id="marketplace-sort" className="flex shrink-0 items-center">
                <Link
                  href={createListingHref}
                  className="inline-flex h-12 items-center justify-center rounded-full bg-emerald-700 px-5 text-sm font-medium !text-white transition hover:bg-emerald-800 hover:!text-white"
                >
                  Create listing
                </Link>
              </div>
            </div>

            <div className="grid gap-8 pt-6 lg:grid-cols-[220px_minmax(0,1fr)]">
              <aside className="space-y-8">
                <div id="marketplace-filters">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                    Categories
                  </p>
                  <div className="mt-4 space-y-2">
                    {categoryFilters.map((category) => {
                      const active = selectedCategory === category.slug;

                      return (
                        <Link
                          key={category.slug}
                          href={buildHref({
                            category:
                              category.slug === "all"
                              ? undefined
                              : category.slug,
                          })}
                          className={`block rounded-2xl px-4 py-3 transition ${
                            active
                              ? "bg-emerald-50 text-slate-950"
                              : "text-slate-600 hover:bg-[#fbfefb] hover:text-slate-950"
                          }`}
                        >
                          <p className="font-medium">{category.label}</p>
                          <p className="mt-1 text-sm text-slate-500">
                            {category.countLabel}
                          </p>
                        </Link>
                      );
                    })}
                  </div>
                </div>

              </aside>

              <div id="listing-results">
                <MarketplaceSearchControls
                  query={query}
                  selectedCategory={selectedCategory}
                  selectedCity={selectedCity}
                  selectedNearMe={selectedNearMe}
                  selectedNearCity={selectedNearCity?.slug}
                  selectedNearLabel={rawNearLabel || undefined}
                  selectedLatitude={
                    selectedNearMe ? String(selectedLatitude) : undefined
                  }
                  selectedLongitude={
                    selectedNearMe ? String(selectedLongitude) : undefined
                  }
                  selectedSort={selectedSort}
                  cityOptions={cityFilters}
                  sortOptions={sortFilters}
                />
                {visibleListings.length > 0 ? (
                  <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {visibleListings.map((listing) => (
                      <ListingCard key={listing.slug} listing={listing} />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-[24px] border border-slate-200 bg-[#fbfefb] p-10 text-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                      No exact matches
                    </p>
                  <h3 className="mt-4 text-3xl font-semibold text-slate-950">
                      No matches found.
                  </h3>
                  <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-500">
                      {selectedNearMe && !selectedNearCity
                        ? `We don't have same-city listings for ${rawNearLabel || "your current location"} yet. Try a popular city or browse the broader marketplace.`
                        : "Try a different category, location, or a broader marketplace view."}
                  </p>
                </div>
              )}
              </div>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
