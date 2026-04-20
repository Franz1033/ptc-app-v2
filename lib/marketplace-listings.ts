import "server-only";

import type { Prisma } from "@/generated/prisma/client";
import {
  getListingBySlug,
  isCityFilter,
  listings as sampleListings,
  type DealType,
  type ListingDetailEntry,
  type Listing,
  type ListingCategory,
} from "@/app/lib/marketplace-data";
import type { ListingCityOption } from "@/app/create-listing/form-options";
import { getPrismaClient } from "@/lib/prisma";

const marketplaceListingInclude = {
  user: true,
} as const;

const legacyMarketplaceListingSelect = {
  id: true,
  slug: true,
  title: true,
  subtitle: true,
  franchise: true,
  setName: true,
  cardNumber: true,
  price: true,
  tradeValue: true,
  location: true,
  city: true,
  condition: true,
  grade: true,
  rarity: true,
  shipping: true,
  meetupSpot: true,
  description: true,
  tags: true,
  wants: true,
  dealType: true,
  createdAt: true,
  user: true,
} as const;

type StoredMarketplaceListing = Prisma.MarketplaceListingGetPayload<{
  include: typeof marketplaceListingInclude;
}>;

type LegacyStoredMarketplaceListing = Prisma.MarketplaceListingGetPayload<{
  select: typeof legacyMarketplaceListingSelect;
}>;

type AnyStoredMarketplaceListing =
  | StoredMarketplaceListing
  | LegacyStoredMarketplaceListing;

type CreateStoredMarketplaceListingInput = {
  userId: string;
  title: string;
  subtitle: string;
  franchise: string;
  setName: string;
  cardNumber: string;
  price: number;
  tradeValue: number;
  location: string;
  city: ListingCityOption;
  condition: string;
  grade?: string;
  rarity: string;
  shipping: string;
  meetupSpot: string;
  description: string;
  tags: string[];
  wants: string[];
  dealType: DealType;
  listingCategory?: string;
  listingType?: string;
  mediaUrls?: string[];
  specifics?: ListingDetailEntry[];
  conditionDetails?: ListingDetailEntry[];
  dealMethods?: string[];
};

function hasDatabaseConfig() {
  return Boolean(process.env.DATABASE_URL || process.env.DIRECT_URL);
}

function isMissingStructuredListingColumnError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2022"
  );
}

function isDatabaseUnavailableError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P1001"
  );
}

function normalizeBrand(value: string) {
  return value.trim().toLowerCase();
}

function getBrandPresentation(franchise: string) {
  const normalizedBrand = normalizeBrand(franchise);

  if (normalizedBrand === "sports") {
    return {
      imageSrc: "/listings/michael-jordan-fleer-sticker-psa7.svg",
      accent: "#2563eb",
      secondary: "#60a5fa",
      surface: "#dbeafe",
      baseCategory: "sports" as const,
    };
  }

  if (normalizedBrand === "tcg") {
    return {
      imageSrc: "/listings/luffy-op05-alt-art-bgs95.svg",
      accent: "#dc2626",
      secondary: "#f59e0b",
      surface: "#ffe4e6",
      baseCategory: "tcg" as const,
    };
  }

  return {
    imageSrc: "/listings/van-gogh-pikachu-sealed-pair.svg",
    accent: "#f97316",
    secondary: "#facc15",
    surface: "#fff1d6",
    baseCategory: "pokemon" as const,
  };
}

function deriveCategories(record: {
  franchise: string;
  title: string;
  subtitle: string;
  condition: string;
  grade: string | null;
}) {
  const presentation = getBrandPresentation(record.franchise);
  const categories = [presentation.baseCategory] as ListingCategory[];
  const combinedText = `${record.title} ${record.subtitle}`.toLowerCase();

  if (
    record.grade ||
    record.condition.toLowerCase() === "graded" ||
    /\bpsa\b|\bbgs\b|\bsgc\b/.test(combinedText)
  ) {
    categories.push("graded");
  }

  if (/\blot\b|\bbinder\b|\bstack\b|\bbundle\b|\bpair\b/.test(combinedText)) {
    categories.push("lots");
  }

  return Array.from(new Set(categories));
}

function formatPosted(createdAt: Date) {
  const diffInMinutes = Math.max(
    0,
    Math.floor((Date.now() - createdAt.getTime()) / 60000),
  );

  if (diffInMinutes < 1) {
    return "Just now";
  }

  if (diffInMinutes < 60) {
    return `${diffInMinutes} min ago`;
  }

  if (diffInMinutes < 24 * 60) {
    const diffInHours = Math.floor(diffInMinutes / 60);
    return `${diffInHours} hr ago`;
  }

  const diffInDays = Math.floor(diffInMinutes / (24 * 60));
  return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
}

function parseDetailEntries(value: Prisma.JsonValue | null) {
  if (!Array.isArray(value)) {
    return [] as ListingDetailEntry[];
  }

  return value.flatMap<ListingDetailEntry>((entry) => {
    if (
      !entry ||
      typeof entry !== "object" ||
      Array.isArray(entry) ||
      typeof entry.label !== "string" ||
      typeof entry.value !== "string"
    ) {
      return [];
    }

    return [
      {
        label: entry.label,
        value: entry.value,
      },
    ];
  });
}

function hasStructuredListingFields(
  record: AnyStoredMarketplaceListing,
): record is StoredMarketplaceListing {
  return "listingCategory" in record;
}

async function findStoredMarketplaceListings() {
  const prisma = getPrismaClient();

  try {
    return await prisma.marketplaceListing.findMany({
      include: marketplaceListingInclude,
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    if (isDatabaseUnavailableError(error)) {
      return [];
    }

    if (!isMissingStructuredListingColumnError(error)) {
      throw error;
    }

    return prisma.marketplaceListing.findMany({
      select: legacyMarketplaceListingSelect,
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}

async function findStoredMarketplaceListingBySlug(slug: string) {
  const prisma = getPrismaClient();

  try {
    return await prisma.marketplaceListing.findUnique({
      where: { slug },
      include: marketplaceListingInclude,
    });
  } catch (error) {
    if (isDatabaseUnavailableError(error)) {
      return null;
    }

    if (!isMissingStructuredListingColumnError(error)) {
      throw error;
    }

    return prisma.marketplaceListing.findUnique({
      where: { slug },
      select: legacyMarketplaceListingSelect,
    });
  }
}

function mapStoredListing(record: AnyStoredMarketplaceListing): Listing {
  const brandPresentation = getBrandPresentation(record.franchise);
  const sellerName = record.user.name || record.user.email.split("@")[0] || "PTC seller";
  const normalizedCity =
    isCityFilter(record.city) && record.city !== "all"
      ? record.city
      : "new-york";
  const hasStructuredFields = hasStructuredListingFields(record);

  return {
    slug: record.slug,
    title: record.title,
    subtitle: record.subtitle,
    imageSrc: brandPresentation.imageSrc,
    franchise: record.franchise,
    set: record.setName,
    cardNumber: record.cardNumber,
    price: record.price,
    tradeValue: record.tradeValue,
    location: record.location,
    city: normalizedCity,
    distance: "Fresh listing",
    condition: record.condition,
    grade: record.grade ?? undefined,
    rarity: record.rarity,
    shipping: record.shipping,
    meetupSpot: record.meetupSpot,
    posted: formatPosted(record.createdAt),
    postedRank: -record.createdAt.getTime(),
    description: record.description,
    categories: deriveCategories(record),
    dealType: record.dealType as DealType,
    accent: brandPresentation.accent,
    secondary: brandPresentation.secondary,
    surface: brandPresentation.surface,
    tags: record.tags,
    wants: record.wants,
    listingCategory: hasStructuredFields
      ? record.listingCategory ?? undefined
      : undefined,
    listingType: hasStructuredFields ? record.listingType ?? undefined : undefined,
    mediaUrls: hasStructuredFields ? record.mediaUrls : undefined,
    specifics: hasStructuredFields
      ? parseDetailEntries(record.specifics)
      : undefined,
    conditionDetails: hasStructuredFields
      ? parseDetailEntries(record.conditionDetails)
      : undefined,
    dealMethods: hasStructuredFields ? record.dealMethods : undefined,
    seller: {
      name: sellerName,
      badge: "PTC marketplace seller",
      responseTime: "Fresh listing",
      sales: 0,
      rating: "New",
      memberSince: String(record.user.createdAt.getFullYear()),
      collectorFocus: `${record.franchise} cards and local deals`,
    },
  };
}

function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
}

async function buildUniqueSlug(title: string, cardNumber: string) {
  const prisma = getPrismaClient();
  const seed = slugify(`${title} ${cardNumber}`) || "listing";
  let candidate = seed;
  let suffix = 2;

  while (true) {
    const existingStoredListing = await prisma.marketplaceListing.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });

    if (!existingStoredListing && !getListingBySlug(candidate)) {
      return candidate;
    }

    candidate = `${seed}-${suffix}`;
    suffix += 1;
  }
}

export async function getMarketplaceListings() {
  if (!hasDatabaseConfig()) {
    return sampleListings;
  }

  const storedListings = await findStoredMarketplaceListings();

  return [...storedListings.map(mapStoredListing), ...sampleListings].sort(
    (left, right) => left.postedRank - right.postedRank,
  );
}

export async function getMarketplaceListingBySlug(slug: string) {
  const sampleListing = getListingBySlug(slug);

  if (sampleListing) {
    return sampleListing;
  }

  if (!hasDatabaseConfig()) {
    return null;
  }

  const storedListing = await findStoredMarketplaceListingBySlug(slug);

  return storedListing ? mapStoredListing(storedListing) : null;
}

export async function getRelatedMarketplaceListings(slug: string) {
  const currentListing = await getMarketplaceListingBySlug(slug);

  if (!currentListing) {
    return [];
  }

  const allListings = await getMarketplaceListings();

  return allListings
    .filter((listing) => listing.slug !== slug)
    .sort((left, right) => {
      const rightMatches = right.categories.filter((category) =>
        currentListing.categories.includes(category)
      ).length;
      const leftMatches = left.categories.filter((category) =>
        currentListing.categories.includes(category)
      ).length;

      if (rightMatches !== leftMatches) {
        return rightMatches - leftMatches;
      }

      return left.postedRank - right.postedRank;
    })
    .slice(0, 3);
}

export async function createStoredMarketplaceListing(
  input: CreateStoredMarketplaceListingInput,
) {
  if (!hasDatabaseConfig()) {
    throw new Error("Database configuration is required to create listings.");
  }

  const slug = await buildUniqueSlug(input.title, input.cardNumber);
  const prisma = getPrismaClient();
  const baseData = {
    slug,
    title: input.title,
    subtitle: input.subtitle,
    franchise: input.franchise,
    setName: input.setName,
    cardNumber: input.cardNumber,
    price: input.price,
    tradeValue: input.tradeValue,
    location: input.location,
    city: input.city,
    condition: input.condition,
    grade: input.grade || null,
    rarity: input.rarity,
    shipping: input.shipping,
    meetupSpot: input.meetupSpot,
    description: input.description,
    tags: input.tags,
    wants: input.wants,
    dealType: input.dealType,
    userId: input.userId,
  } as const;

  try {
    return await prisma.marketplaceListing.create({
      data: {
        ...baseData,
        listingCategory: input.listingCategory ?? null,
        listingType: input.listingType ?? null,
        mediaUrls: input.mediaUrls ?? [],
        specifics: input.specifics,
        conditionDetails: input.conditionDetails,
        dealMethods: input.dealMethods ?? [],
      },
      select: {
        slug: true,
      },
    });
  } catch (error) {
    if (!isMissingStructuredListingColumnError(error)) {
      throw error;
    }

    throw new Error(
      "Structured listing columns are unavailable in the current database schema.",
    );
  }
}
