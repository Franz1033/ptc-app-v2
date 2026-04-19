"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FocusEvent } from "react";

import {
  categoryFilters,
  type CityFilter,
  type CityFilterOption,
  type SortFilter,
} from "@/app/lib/marketplace-data";

type SortOption = {
  slug: SortFilter;
  label: string;
};

type MarketplaceSearchControlsProps = {
  query: string;
  selectedCategory: string;
  selectedCity: CityFilter;
  selectedNearMe: boolean;
  selectedNearCity?: CityFilter;
  selectedNearLabel?: string;
  selectedLatitude?: string;
  selectedLongitude?: string;
  selectedSort: SortFilter;
  cityOptions: CityFilterOption[];
  sortOptions: SortOption[];
};

export function MarketplaceSearchControls({
  query,
  selectedCategory,
  selectedCity,
  selectedNearMe,
  selectedNearCity,
  selectedNearLabel,
  selectedLatitude,
  selectedLongitude,
  selectedSort,
  cityOptions,
  sortOptions,
}: MarketplaceSearchControlsProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(query);
  const [isLocationMenuOpen, setIsLocationMenuOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const selectedCategoryLabel =
    categoryFilters.find((category) => category.slug === selectedCategory)
      ?.label ?? "Category";
  const selectedCityLabel =
    cityOptions.find((city) => city.slug === selectedCity)?.label ??
    "Popular city";
  const selectedNearCityLabel =
    selectedNearLabel ||
    (selectedNearCity
      ? cityOptions.find((city) => city.slug === selectedNearCity)?.label
      : undefined) ||
    "Current city";
  const locationButtonLabel =
    selectedNearMe
      ? selectedNearCityLabel
      : selectedCity === "all"
        ? "Popular city"
        : selectedCityLabel;
  const popularCities = cityOptions.filter(
    (city) => city.slug !== "all" && city.popular
  );

  const buildHref = (overrides: {
    q?: string;
    category?: string;
    city?: CityFilter;
    near?: "me";
    lat?: string;
    lng?: string;
    nearLabel?: string;
    sort?: SortFilter;
  }) => {
    const nextParams = new URLSearchParams();
    const merged = {
      q: searchQuery.trim() || undefined,
      category: selectedCategory === "all" ? undefined : selectedCategory,
      city:
        selectedNearMe || selectedCity === "all" ? undefined : selectedCity,
      near: selectedNearMe ? "me" : undefined,
      lat: selectedNearMe ? selectedLatitude : undefined,
      lng: selectedNearMe ? selectedLongitude : undefined,
      nearLabel: selectedNearMe ? selectedNearLabel : undefined,
      sort: selectedSort === "fresh" ? undefined : selectedSort,
      ...overrides,
    };

    Object.entries(merged).forEach(([key, value]) => {
      if (value) {
        nextParams.set(key, String(value));
      }
    });

    const search = nextParams.toString();
    return search ? `/marketplace?${search}` : "/marketplace";
  };

  const handleLocationBlur = (event: FocusEvent<HTMLDivElement>) => {
    const nextTarget = event.relatedTarget;

    if (
      !(nextTarget instanceof Node) ||
      !event.currentTarget.contains(nextTarget)
    ) {
      setIsLocationMenuOpen(false);
    }
  };

  const applyCityFilter = (city: CityFilter | "all") => {
    setLocationError(null);
    setIsLocationMenuOpen(false);
    router.push(
      buildHref({
        city: city === "all" ? undefined : city,
        near: undefined,
        lat: undefined,
        lng: undefined,
        nearLabel: undefined,
      })
    );
  };

  const clearCategoryFilter = () => {
    setLocationError(null);
    router.push(
      buildHref({
        category: undefined,
      })
    );
  };

  const clearLocationFilter = () => {
    setLocationError(null);
    router.push(
      buildHref({
        city: undefined,
        near: undefined,
        lat: undefined,
        lng: undefined,
        nearLabel: undefined,
      })
    );
  };

  const clearActiveFilters = () => {
    setLocationError(null);
    router.push(
      buildHref({
        category: undefined,
        city: undefined,
        near: undefined,
        lat: undefined,
        lng: undefined,
        nearLabel: undefined,
      })
    );
  };

  const getCurrentCityLabel = async (
    latitude: number,
    longitude: number
  ) => {
    try {
      const url = new URL("https://nominatim.openstreetmap.org/reverse");
      url.searchParams.set("format", "jsonv2");
      url.searchParams.set("lat", latitude.toFixed(4));
      url.searchParams.set("lon", longitude.toFixed(4));
      url.searchParams.set("zoom", "10");
      url.searchParams.set("addressdetails", "1");

      const response = await fetch(url.toString(), {
        headers: {
          Accept: "application/json",
          "Accept-Language": "en",
        },
      });

      if (!response.ok) {
        return null;
      }

      const data = (await response.json()) as {
        address?: {
          city?: string;
          town?: string;
          municipality?: string;
          village?: string;
          suburb?: string;
          county?: string;
        };
      };

      return (
        data.address?.city ||
        data.address?.town ||
        data.address?.municipality ||
        data.address?.village ||
        data.address?.suburb ||
        data.address?.county ||
        null
      );
    } catch {
      return null;
    }
  };

  const handleNearMe = () => {
    setLocationError(null);

    if (!("geolocation" in navigator)) {
      setLocationError("Location is not available in this browser.");
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const nearLabel = await getCurrentCityLabel(latitude, longitude);

        setIsLocating(false);
        setIsLocationMenuOpen(false);
        router.push(
          buildHref({
            city: undefined,
            near: "me",
            lat: latitude.toFixed(4),
            lng: longitude.toFixed(4),
            nearLabel: nearLabel ?? undefined,
          })
        );
      },
      () => {
        setIsLocating(false);
        setLocationError("We couldn't access your location.");
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  };

  return (
    <>
      <form
        id="marketplace-search"
        action="/marketplace"
        className="mb-4 flex flex-col gap-3 sm:flex-row"
      >
        {selectedCategory !== "all" ? (
          <input type="hidden" name="category" value={selectedCategory} />
        ) : null}
        {selectedNearMe ? (
          <>
            <input type="hidden" name="near" value="me" />
            {selectedLatitude ? (
              <input type="hidden" name="lat" value={selectedLatitude} />
            ) : null}
            {selectedLongitude ? (
              <input type="hidden" name="lng" value={selectedLongitude} />
            ) : null}
            {selectedNearLabel ? (
              <input type="hidden" name="nearLabel" value={selectedNearLabel} />
            ) : null}
          </>
        ) : null}
        {!selectedNearMe && selectedCity !== "all" ? (
          <input type="hidden" name="city" value={selectedCity} />
        ) : null}
        {selectedSort !== "fresh" ? (
          <input type="hidden" name="sort" value={selectedSort} />
        ) : null}

        <label className="flex-1">
          <span className="sr-only">Search marketplace listings</span>
          <input
            type="search"
            name="q"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search cards, sets, or sellers"
            className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-400"
          />
        </label>

        <div className="relative sm:w-64" onBlur={handleLocationBlur}>
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={isLocationMenuOpen}
            onClick={() => {
              setLocationError(null);
              setIsLocationMenuOpen((open) => !open);
            }}
            className="inline-flex h-12 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-950 transition hover:border-slate-300"
          >
            <span
              className={`block truncate pr-3 ${
                isLocating
                  ? "text-slate-500"
                  : !selectedNearMe && selectedCity === "all"
                    ? "text-slate-400"
                    : "text-slate-950"
              }`}
              title={locationButtonLabel}
            >
              {isLocating ? "Finding nearby..." : locationButtonLabel}
            </span>
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              className="h-4 w-4 shrink-0 text-slate-400"
              fill="none"
            >
              <path
                d="M4 6.5L8 10L12 6.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {isLocationMenuOpen ? (
            <div className="absolute left-0 top-full z-20 w-full pt-2">
              <div className="rounded-xl border border-slate-200 bg-white p-2 shadow-[0_18px_36px_rgba(15,23,42,0.12)]">
                <button
                  type="button"
                  onClick={handleNearMe}
                  disabled={isLocating}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition disabled:cursor-wait disabled:text-slate-400 ${
                    selectedNearMe
                      ? "bg-emerald-50 text-emerald-800"
                      : "text-slate-700 hover:bg-[#fbfefb] hover:text-slate-950"
                  }`}
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 16 16"
                    className="h-4 w-4 shrink-0"
                    fill="none"
                  >
                    <circle
                      cx="8"
                      cy="8"
                      r="4.5"
                      stroke="currentColor"
                      strokeWidth="1.4"
                    />
                    <path
                      d="M8 1.5V4M8 12V14.5M1.5 8H4M12 8H14.5"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span>
                    {isLocating
                      ? "Finding your location..."
                      : "Listings near me"}
                  </span>
                  {selectedNearMe && !isLocating ? (
                    <span className="ml-auto text-xs font-medium text-emerald-700">
                      Active
                    </span>
                  ) : null}
                </button>

                <div className="mx-1 my-2 h-px bg-slate-100" />

                <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Popular cities
                </p>

                {popularCities.map((city) => {
                  const active = !selectedNearMe && selectedCity === city.slug;

                  return (
                    <button
                      key={city.slug}
                      type="button"
                      onClick={() => applyCityFilter(city.slug)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
                        active
                          ? "bg-emerald-50 text-emerald-800"
                          : "text-slate-700 hover:bg-[#fbfefb] hover:text-slate-950"
                      }`}
                    >
                      <span>{city.label}</span>
                      {active ? (
                        <span className="text-xs font-medium text-emerald-700">
                          Active
                        </span>
                      ) : null}
                    </button>
                  );
                })}

                {selectedNearMe || selectedCity !== "all" ? (
                  <>
                    <div className="mx-1 my-2 h-px bg-slate-100" />
                    <button
                      type="button"
                      onClick={() => applyCityFilter("all")}
                      className="flex w-full items-center rounded-lg px-3 py-2 text-left text-sm text-slate-500 transition hover:bg-[#fbfefb] hover:text-slate-950"
                    >
                      Clear location
                    </button>
                  </>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex gap-3 sm:ml-auto">
          <button
            type="submit"
            className="h-12 rounded-xl bg-emerald-800 px-5 text-sm font-medium text-white transition hover:bg-emerald-700"
          >
            Search
          </button>
          <div className="group relative">
            <button
              type="button"
              aria-label="Sort listings"
              aria-haspopup="menu"
              className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-[#fbfefb] hover:text-slate-950"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                className="h-5 w-5"
                fill="none"
              >
                <path
                  d="M5 3.5V12.5M5 3.5L2.5 6M5 3.5L7.5 6M11 12.5V3.5M11 12.5L8.5 10M11 12.5L13.5 10"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div className="pointer-events-none invisible absolute right-0 top-full z-20 w-48 pt-2 opacity-0 transition duration-150 group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:visible group-focus-within:opacity-100">
              <div className="rounded-xl border border-slate-200 bg-white p-2 shadow-[0_18px_36px_rgba(15,23,42,0.12)]">
                {sortOptions.map((sort) => {
                  const active = selectedSort === sort.slug;

                  return (
                    <Link
                      key={sort.slug}
                      href={buildHref({
                        sort: sort.slug === "fresh" ? undefined : sort.slug,
                      })}
                      className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition ${
                        active
                          ? "bg-emerald-50 text-emerald-800"
                          : "text-slate-700 hover:bg-[#fbfefb] hover:text-slate-950"
                      }`}
                    >
                      <span>{sort.label}</span>
                      {active ? (
                        <span className="text-xs font-medium text-emerald-700">
                          Active
                        </span>
                      ) : null}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </form>

      {locationError ? (
        <p className="mb-4 text-sm text-rose-600">{locationError}</p>
      ) : null}

      {selectedCategory !== "all" || selectedNearMe || selectedCity !== "all" ? (
        <div className="mb-6 flex items-center gap-3 text-sm text-slate-600">
          <span className="text-slate-500">Filtering by:</span>
          {selectedCategory !== "all" ? (
            <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 font-medium text-emerald-800">
              <span>Category: {selectedCategoryLabel}</span>
              <button
                type="button"
                aria-label={`Remove category filter ${selectedCategoryLabel}`}
                onClick={clearCategoryFilter}
                className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full text-emerald-700 transition hover:bg-emerald-100 hover:text-emerald-900"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  className="h-3.5 w-3.5"
                  fill="none"
                >
                  <path
                    d="M4.5 4.5L11.5 11.5M11.5 4.5L4.5 11.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </span>
          ) : null}
          {selectedNearMe || selectedCity !== "all" ? (
            <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 font-medium text-emerald-800">
              <span>
                Location: {selectedNearMe ? selectedNearCityLabel : selectedCityLabel}
              </span>
              <button
                type="button"
                aria-label={`Remove location filter ${selectedNearMe ? selectedNearCityLabel : selectedCityLabel}`}
                onClick={clearLocationFilter}
                className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full text-emerald-700 transition hover:bg-emerald-100 hover:text-emerald-900"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  className="h-3.5 w-3.5"
                  fill="none"
                >
                  <path
                    d="M4.5 4.5L11.5 11.5M11.5 4.5L4.5 11.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </span>
          ) : null}
          <button
            type="button"
            onClick={clearActiveFilters}
            className="text-slate-500 transition hover:text-slate-950"
          >
            Clear
          </button>
        </div>
      ) : null}
    </>
  );
}
