import "server-only";

import type { Prisma } from "@/generated/prisma/client";
import {
  getListingBySlug,
  isCityFilter,
  listings as sampleListings,
  type DealType,
  type Listing,
  type ListingCategory,
} from "@/app/lib/marketplace-data";
import type {
  ListingBrandOption,
  ListingCityOption,
  ListingConditionOption,
  ListingDealTypeOption,
} from "@/app/create-listing/form-options";
import { getPrismaClient } from "@/lib/prisma";

const marketplaceListingInclude = {
  user: true,
} as const;

type StoredMarketplaceListing = Prisma.MarketplaceListingGetPayload<{
  include: typeof marketplaceListingInclude;
}>;

type CreateStoredMarketplaceListingInput = {
  userId: string;
  title: string;
  subtitle: string;
  franchise: ListingBrandOption;
  setName: string;
  cardNumber: string;
  price: number;
  tradeValue: number;
  location: string;
  city: ListingCityOption;
  condition: ListingConditionOption;
  grade?: string;
  rarity: string;
  shipping: string;
  meetupSpot: string;
  description: string;
  tags: string[];
  wants: string[];
  dealType: ListingDealTypeOption;
};

function hasDatabaseConfig() {
  return Boolean(process.env.DATABASE_URL || process.env.DIRECT_URL);
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

function mapStoredListing(record: StoredMarketplaceListing): Listing {
  const brandPresentation = getBrandPresentation(record.franchise);
  const sellerName = record.user.name || record.user.email.split("@")[0] || "PTC seller";
  const normalizedCity =
    isCityFilter(record.city) && record.city !== "all"
      ? record.city
      : "new-york";

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

  const storedListings = await getPrismaClient().marketplaceListing.findMany({
    include: marketplaceListingInclude,
    orderBy: {
      createdAt: "desc",
    },
  });

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

  const storedListing = await getPrismaClient().marketplaceListing.findUnique({
    where: { slug },
    include: marketplaceListingInclude,
  });

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

  return getPrismaClient().marketplaceListing.create({
    data: {
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
    },
    include: {
      user: true,
    },
  });
}
