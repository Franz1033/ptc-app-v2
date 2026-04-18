import Link from "next/link";

import { instrumentSans } from "@/app/fonts";
import { ListingCard } from "@/app/components/marketplace/listing-card";
import { SectionHeading } from "@/app/components/marketplace/section-heading";
import { SiteHeader } from "@/app/components/marketplace/site-header";
import {
  categoryFilters,
  cityFilters,
  dealFilters,
  formatCurrency,
  isCategoryFilter,
  isCityFilter,
  isDealFilter,
  isSortFilter,
  listings,
  marketplacePrinciples,
  marketplaceStats,
  sortFilters,
  trustedMeetupSpots,
  type DealFilter,
  type SortFilter,
} from "@/app/lib/marketplace-data";

type MarketplacePageProps = {
  searchParams: Promise<{
    q?: string | string[];
    category?: string | string[];
    city?: string | string[];
    sort?: string | string[];
    deal?: string | string[];
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
  const params = await searchParams;
  const query = getSingleValue(params.q).trim();

  const rawCategory = getSingleValue(params.category);
  const rawCity = getSingleValue(params.city);
  const rawSort = getSingleValue(params.sort);
  const rawDeal = getSingleValue(params.deal);

  const selectedCategory = isCategoryFilter(rawCategory) ? rawCategory : "all";
  const selectedCity = isCityFilter(rawCity) ? rawCity : "all";
  const selectedSort = isSortFilter(rawSort) ? rawSort : "fresh";
  const selectedDeal = isDealFilter(rawDeal) ? rawDeal : "all";

  const buildHref = (overrides: {
    q?: string;
    category?: string;
    city?: string;
    sort?: SortFilter;
    deal?: DealFilter;
  }) => {
    const nextParams = new URLSearchParams();
    const merged = {
      q: query || undefined,
      category: selectedCategory === "all" ? undefined : selectedCategory,
      city: selectedCity === "all" ? undefined : selectedCity,
      sort: selectedSort === "fresh" ? undefined : selectedSort,
      deal: selectedDeal === "all" ? undefined : selectedDeal,
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

      const matchesCity =
        selectedCity === "all" || listing.city === selectedCity;

      const matchesDeal =
        selectedDeal === "all" ||
        (selectedDeal === "trade-friendly" &&
          listing.dealType !== "buy-only") ||
        (selectedDeal === "meetup-only" &&
          listing.shipping.toLowerCase().includes("meetup only")) ||
        (selectedDeal === "under-250" && listing.price <= 250);

      return matchesQuery && matchesCategory && matchesCity && matchesDeal;
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

  const featuredListing = visibleListings[0] ?? listings[0];

  return (
    <>
      <SiteHeader />

      <main className="flex-1 bg-white">
        <section className="border-b border-slate-200">
          <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  Marketplace
                </p>
                <h1
                  className={`${instrumentSans.className} mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl`}
                >
                  Live listings
                </h1>
                <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500">
                  Browse cards, compare prices, and message sellers.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="#inventory"
                  className="rounded-full bg-emerald-800 px-5 py-3 font-medium text-white transition hover:bg-emerald-700"
                >
                  Jump to listings
                </Link>
                <Link
                  href="/create-listing"
                  className="rounded-full border border-emerald-200 bg-emerald-50 px-5 py-3 font-medium text-emerald-800 transition hover:bg-emerald-100"
                >
                  Create listing
                </Link>
              </div>
            </div>

            <div className="mt-6 grid gap-4 border-t border-slate-200 pt-6 md:grid-cols-[0.9fr_0.9fr_1.2fr]">
              {marketplaceStats.slice(0, 2).map((stat) => (
                <div key={stat.label}>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    {stat.label}
                  </p>
                  <p className="mt-3 font-mono text-3xl font-semibold text-slate-950">
                    {stat.value}
                  </p>
                </div>
              ))}
              <div className="rounded-[24px] border border-slate-200 bg-[#fbfefb] px-5 py-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                      Featured right now
                    </p>
                    <h2 className="mt-2 text-xl font-semibold text-slate-950">
                      {featuredListing.title}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {featuredListing.subtitle}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-emerald-100 bg-white px-3 py-2 text-right">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Buy now
                    </p>
                    <p className="mt-1 text-lg font-semibold text-slate-950">
                      {formatCurrency(featuredListing.price)}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/listing/${featuredListing.slug}`}
                  className="mt-4 inline-flex text-sm font-medium text-emerald-700 transition hover:text-emerald-800"
                >
                  Open full listing
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="inventory" className="bg-white">
          <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
            <form
              className="grid gap-3 lg:grid-cols-[minmax(0,1.4fr)_0.8fr_0.8fr_0.8fr]"
              action="/marketplace"
            >
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Search cards or sets
                <input
                  name="q"
                  defaultValue={query}
                  placeholder="Pikachu, Wemby, PSA 10..."
                  className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-400"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Category
                <select
                  name="category"
                  defaultValue={selectedCategory}
                  className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-slate-950 outline-none transition focus:border-emerald-400"
                >
                  {categoryFilters.map((category) => (
                    <option key={category.slug} value={category.slug}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                City
                <select
                  name="city"
                  defaultValue={selectedCity}
                  className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-slate-950 outline-none transition focus:border-emerald-400"
                >
                  {cityFilters.map((city) => (
                    <option key={city.slug} value={city.slug}>
                      {city.label}
                    </option>
                  ))}
                </select>
              </label>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700">
                  Sort
                </label>
                <div className="flex gap-2">
                  <select
                    name="sort"
                    defaultValue={selectedSort}
                    className="h-12 min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white px-4 text-slate-950 outline-none transition focus:border-emerald-400"
                  >
                    {sortFilters.map((sort) => (
                      <option key={sort.slug} value={sort.slug}>
                        {sort.label}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    className="h-12 rounded-2xl bg-emerald-800 px-5 font-medium text-white transition hover:bg-emerald-700"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </form>
            <div className="mt-8 flex flex-col gap-4 border-t border-slate-200 pt-8 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  Inventory
                </p>
                <h2
                  className={`${instrumentSans.className} mt-2 text-3xl font-semibold tracking-tight text-slate-950`}
                >
                  {visibleListings.length} active listings
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Filters stay close so you can scan listings quickly.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={buildHref({ sort: "fresh" })}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                    selectedSort === "fresh"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                      : "border-slate-200 text-slate-600 hover:bg-[#fbfefb] hover:text-slate-950"
                  }`}
                >
                  Fresh first
                </Link>
                <Link
                  href={buildHref({ sort: "price-low" })}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                    selectedSort === "price-low"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                      : "border-slate-200 text-slate-600 hover:bg-[#fbfefb] hover:text-slate-950"
                  }`}
                >
                  Lowest price
                </Link>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 border-b border-slate-200 pb-6">
              {dealFilters.map((deal) => {
                const active = selectedDeal === deal.slug;

                return (
                  <Link
                    key={deal.slug}
                    href={buildHref({
                      deal: deal.slug === "all" ? undefined : deal.slug,
                    })}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                      active
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 text-slate-600 hover:bg-[#fbfefb] hover:text-slate-950"
                    }`}
                  >
                    {deal.label}
                  </Link>
                );
              })}
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
              <aside className="space-y-8">
                <div>
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

                <div className="border-t border-slate-200 pt-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                    Why it works
                  </p>
                  <div className="mt-4 space-y-5">
                    {marketplacePrinciples.map((principle) => (
                      <div key={principle.title}>
                        <p className="text-sm font-semibold text-slate-950">
                          {principle.title}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                          {principle.copy}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </aside>

              <div>
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
                      Try a different city, category, or deal filter.
                  </p>
                </div>
              )}
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200 bg-[#fbfefb]">
          <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div>
              <SectionHeading
                eyebrow="Trusted meetups"
                title="Meetup spots"
                description="Simple public places for local deals."
              />
              <div className="mt-8 space-y-6">
                {trustedMeetupSpots.map((spot) => (
                  <div
                    key={spot.name}
                    className="border-b border-slate-200 pb-6"
                  >
                    <p className="text-lg font-semibold text-slate-950">
                      {spot.name}
                    </p>
                    <p className="mt-1 text-sm font-medium text-emerald-700">
                      {spot.city}
                    </p>
                    <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
                      {spot.note}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <SectionHeading
                eyebrow="Marketplace workflow"
                title="How deals move"
                description="The goal is to keep the flow short."
              />
              <div className="mt-8 space-y-8">
                {marketplaceStats.slice(0, 3).map((stat, index) => (
                  <div
                    key={stat.label}
                    className="flex gap-5 border-b border-slate-200 pb-6"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-sm font-semibold text-white">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-lg font-semibold text-slate-950">
                        {stat.label}
                      </p>
                      <p className="mt-2 text-base leading-7 text-slate-500">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
