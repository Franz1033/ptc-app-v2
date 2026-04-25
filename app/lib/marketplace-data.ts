export type ListingCategory = "pokemon" | "sports" | "tcg" | "graded" | "lots";

export type CityFilter =
  | "all"
  | "new-york"
  | "jersey-city"
  | "chicago"
  | "miami"
  | "atlanta"
  | "austin"
  | "dallas"
  | "los-angeles"
  | "seattle"
  | "washington-dc"
  | "boston"
  | "philadelphia"
  | "baltimore"
  | "charlotte"
  | "raleigh"
  | "orlando"
  | "tampa"
  | "jacksonville"
  | "nashville"
  | "memphis"
  | "new-orleans"
  | "detroit"
  | "cleveland"
  | "columbus"
  | "cincinnati"
  | "indianapolis"
  | "milwaukee"
  | "minneapolis"
  | "st-louis"
  | "kansas-city"
  | "omaha"
  | "houston"
  | "san-antonio"
  | "el-paso"
  | "denver"
  | "phoenix"
  | "las-vegas"
  | "salt-lake-city"
  | "albuquerque"
  | "boise"
  | "portland"
  | "san-francisco"
  | "san-jose"
  | "sacramento"
  | "san-diego";

export type SortFilter = "fresh" | "price-low" | "price-high" | "trade-value";
export type CityFilterOption = {
  slug: CityFilter;
  label: string;
  popular?: boolean;
  latitude?: number;
  longitude?: number;
};

export type DealType = "buy-only" | "buy-trade" | "trade-only";

export type SellerProfile = {
  name: string;
  badge: string;
  responseTime: string;
  sales: number;
  rating: string;
  memberSince: string;
  collectorFocus: string;
};

export type ListingDetailEntry = {
  label: string;
  value: string;
};

export type Listing = {
  slug: string;
  title: string;
  subtitle: string;
  imageSrc: string;
  franchise: string;
  set: string;
  cardNumber: string;
  price: number;
  tradeValue: number;
  location: string;
  city: Exclude<CityFilter, "all">;
  distance: string;
  condition: string;
  grade?: string;
  rarity: string;
  shipping: string;
  meetupSpot: string;
  posted: string;
  postedRank: number;
  description: string;
  categories: ListingCategory[];
  dealType: DealType;
  accent: string;
  secondary: string;
  surface: string;
  tags: string[];
  wants: string[];
  listingCategory?: string;
  listingType?: string;
  mediaUrls?: string[];
  specifics?: ListingDetailEntry[];
  conditionDetails?: ListingDetailEntry[];
  dealMethods?: string[];
  ownerUserId?: string;
  seller: SellerProfile;
};

export const categoryFilters: Array<{
  slug: "all" | ListingCategory;
  label: string;
  countLabel: string;
}> = [
  { slug: "all", label: "All cards", countLabel: "Fresh local drops" },
  { slug: "pokemon", label: "Pokemon", countLabel: "Modern hits and promos" },
  { slug: "sports", label: "Sports", countLabel: "Rookies, autos, slabs" },
  { slug: "tcg", label: "TCG", countLabel: "One Piece, Lorcana, Yu-Gi-Oh!" },
  { slug: "graded", label: "Graded", countLabel: "PSA, BGS, SGC" },
  { slug: "lots", label: "Lots", countLabel: "Binders and starter stacks" },
];

export const cityFilters: CityFilterOption[] = [
  { slug: "all", label: "Anywhere" },
  {
    slug: "new-york",
    label: "New York, NY",
    popular: true,
    latitude: 40.7128,
    longitude: -74.006,
  },
  {
    slug: "jersey-city",
    label: "Jersey City, NJ",
    popular: true,
    latitude: 40.7178,
    longitude: -74.0431,
  },
  {
    slug: "chicago",
    label: "Chicago, IL",
    popular: true,
    latitude: 41.8781,
    longitude: -87.6298,
  },
  {
    slug: "miami",
    label: "Miami, FL",
    popular: true,
    latitude: 25.7617,
    longitude: -80.1918,
  },
  {
    slug: "atlanta",
    label: "Atlanta, GA",
    popular: true,
    latitude: 33.749,
    longitude: -84.388,
  },
  {
    slug: "austin",
    label: "Austin, TX",
    popular: true,
    latitude: 30.2672,
    longitude: -97.7431,
  },
  {
    slug: "dallas",
    label: "Dallas, TX",
    popular: true,
    latitude: 32.7767,
    longitude: -96.797,
  },
  {
    slug: "los-angeles",
    label: "Los Angeles, CA",
    popular: true,
    latitude: 34.0522,
    longitude: -118.2437,
  },
  {
    slug: "seattle",
    label: "Seattle, WA",
    popular: true,
    latitude: 47.6062,
    longitude: -122.3321,
  },
  {
    slug: "washington-dc",
    label: "Washington, DC",
    latitude: 38.9072,
    longitude: -77.0369,
  },
  {
    slug: "boston",
    label: "Boston, MA",
    latitude: 42.3601,
    longitude: -71.0589,
  },
  {
    slug: "philadelphia",
    label: "Philadelphia, PA",
    latitude: 39.9526,
    longitude: -75.1652,
  },
  {
    slug: "baltimore",
    label: "Baltimore, MD",
    latitude: 39.2904,
    longitude: -76.6122,
  },
  {
    slug: "charlotte",
    label: "Charlotte, NC",
    latitude: 35.2271,
    longitude: -80.8431,
  },
  {
    slug: "raleigh",
    label: "Raleigh, NC",
    latitude: 35.7796,
    longitude: -78.6382,
  },
  {
    slug: "orlando",
    label: "Orlando, FL",
    latitude: 28.5383,
    longitude: -81.3792,
  },
  {
    slug: "tampa",
    label: "Tampa, FL",
    latitude: 27.9506,
    longitude: -82.4572,
  },
  {
    slug: "jacksonville",
    label: "Jacksonville, FL",
    latitude: 30.3322,
    longitude: -81.6557,
  },
  {
    slug: "nashville",
    label: "Nashville, TN",
    latitude: 36.1627,
    longitude: -86.7816,
  },
  {
    slug: "memphis",
    label: "Memphis, TN",
    latitude: 35.1495,
    longitude: -90.049,
  },
  {
    slug: "new-orleans",
    label: "New Orleans, LA",
    latitude: 29.9511,
    longitude: -90.0715,
  },
  {
    slug: "detroit",
    label: "Detroit, MI",
    latitude: 42.3314,
    longitude: -83.0458,
  },
  {
    slug: "cleveland",
    label: "Cleveland, OH",
    latitude: 41.4993,
    longitude: -81.6944,
  },
  {
    slug: "columbus",
    label: "Columbus, OH",
    latitude: 39.9612,
    longitude: -82.9988,
  },
  {
    slug: "cincinnati",
    label: "Cincinnati, OH",
    latitude: 39.1031,
    longitude: -84.512,
  },
  {
    slug: "indianapolis",
    label: "Indianapolis, IN",
    latitude: 39.7684,
    longitude: -86.1581,
  },
  {
    slug: "milwaukee",
    label: "Milwaukee, WI",
    latitude: 43.0389,
    longitude: -87.9065,
  },
  {
    slug: "minneapolis",
    label: "Minneapolis, MN",
    latitude: 44.9778,
    longitude: -93.265,
  },
  {
    slug: "st-louis",
    label: "St. Louis, MO",
    latitude: 38.627,
    longitude: -90.1994,
  },
  {
    slug: "kansas-city",
    label: "Kansas City, MO",
    latitude: 39.0997,
    longitude: -94.5786,
  },
  {
    slug: "omaha",
    label: "Omaha, NE",
    latitude: 41.2565,
    longitude: -95.9345,
  },
  {
    slug: "houston",
    label: "Houston, TX",
    latitude: 29.7604,
    longitude: -95.3698,
  },
  {
    slug: "san-antonio",
    label: "San Antonio, TX",
    latitude: 29.4241,
    longitude: -98.4936,
  },
  {
    slug: "el-paso",
    label: "El Paso, TX",
    latitude: 31.7619,
    longitude: -106.485,
  },
  {
    slug: "denver",
    label: "Denver, CO",
    latitude: 39.7392,
    longitude: -104.9903,
  },
  {
    slug: "phoenix",
    label: "Phoenix, AZ",
    latitude: 33.4484,
    longitude: -112.074,
  },
  {
    slug: "las-vegas",
    label: "Las Vegas, NV",
    latitude: 36.1699,
    longitude: -115.1398,
  },
  {
    slug: "salt-lake-city",
    label: "Salt Lake City, UT",
    latitude: 40.7608,
    longitude: -111.891,
  },
  {
    slug: "albuquerque",
    label: "Albuquerque, NM",
    latitude: 35.0844,
    longitude: -106.6504,
  },
  {
    slug: "boise",
    label: "Boise, ID",
    latitude: 43.615,
    longitude: -116.2023,
  },
  {
    slug: "portland",
    label: "Portland, OR",
    latitude: 45.5152,
    longitude: -122.6784,
  },
  {
    slug: "san-francisco",
    label: "San Francisco, CA",
    latitude: 37.7749,
    longitude: -122.4194,
  },
  {
    slug: "san-jose",
    label: "San Jose, CA",
    latitude: 37.3382,
    longitude: -121.8863,
  },
  {
    slug: "sacramento",
    label: "Sacramento, CA",
    latitude: 38.5816,
    longitude: -121.4944,
  },
  {
    slug: "san-diego",
    label: "San Diego, CA",
    latitude: 32.7157,
    longitude: -117.1611,
  },
];

export const sortFilters: Array<{
  slug: SortFilter;
  label: string;
}> = [
  { slug: "fresh", label: "Fresh first" },
  { slug: "price-low", label: "Lowest price" },
  { slug: "price-high", label: "Highest price" },
  { slug: "trade-value", label: "Best trade value" },
];

export const SAME_CITY_MATCH_MAX_DISTANCE_MILES = 35;

export const marketplaceStats = [
  { label: "Active listings", value: "148" },
  { label: "Active sellers", value: "72" },
  { label: "Completed deals", value: "1,284" },
  { label: "New listings this week", value: "41" },
] as const;

export const featuredCollections = [
  {
    name: "Binder refresh under $75",
    summary: "Raw singles and clean promos for quick upgrades after league night.",
    accent: "#60a5fa",
  },
  {
    name: "Trade night heat check",
    summary: "High-interest slabs priced to move in person before the weekend card show.",
    accent: "#f97316",
  },
  {
    name: "Starter lots for new collectors",
    summary: "Team bags, partial sets, and starter stacks sold as community-friendly bundles.",
    accent: "#34d399",
  },
] as const;

export const trustedMeetupSpots = [
  {
    name: "Bleecker Street Card Loft",
    city: "New York",
    note: "Well-lit tables and easy parking nearby.",
  },
  {
    name: "Hudson Hobby Exchange",
    city: "Jersey City",
    note: "Front counter check-in and cameras.",
  },
  {
    name: "North Loop Card Club",
    city: "Austin",
    note: "Common spot for same-day pickups.",
  },
] as const;

export const sellingSteps = [
  "Upload clear front and back photos.",
  "Set a price, trade value, and shipping or meetup preferences.",
  "Reply in chat and confirm shipping, delivery, or meetup details.",
] as const;

export const inboxPreview = [
  {
    buyer: "Jordan V.",
    message: "Can do cash plus a PSA 9 Gengar if you can meet at 7:15.",
    status: "Seen 2m ago",
  },
  {
    buyer: "Nina S.",
    message: "Interested in both Wemby cards if you still have the silver holo clean.",
    status: "New message",
  },
  {
    buyer: "Chris P.",
    message: "Can meet at the shop counter tomorrow afternoon. Want me to bring comp screenshots?",
    status: "Replied",
  },
] as const;

export const listings: Listing[] = [
  {
    slug: "van-gogh-pikachu-sealed-pair",
    title: "Van Gogh Pikachu sealed pair",
    subtitle: "Two sealed promos in Card Saver sleeves.",
    imageSrc: "/listings/van-gogh-pikachu-sealed-pair.svg",
    franchise: "Pokemon",
    set: "Van Gogh Museum Promo",
    cardNumber: "085",
    price: 165,
    tradeValue: 190,
    location: "Queens, NY",
    city: "new-york",
    distance: "4 miles away",
    condition: "Sealed",
    rarity: "Promo",
    shipping: "Meetup or tracked shipping",
    meetupSpot: "Shops at Skyview card tables",
    posted: "42 minutes ago",
    postedRank: 1,
    description:
      "Seller wants a quick, straightforward meetup and is open to a clean promo swap plus cash.",
    categories: ["pokemon"],
    dealType: "buy-trade",
    accent: "#f97316",
    secondary: "#facc15",
    surface: "#fff1d6",
    tags: ["Fixed price", "Trade friendly", "Meet tonight"],
    wants: ["151 illustration rares", "Japanese promos", "cash plus slabs"],
    seller: {
      name: "Maya C.",
      badge: "Top meetup seller",
      responseTime: "Replies in 9 min",
      sales: 41,
      rating: "4.9",
      memberSince: "2019",
      collectorFocus: "Modern Pokemon slabs and sealed promos",
    },
  },
  {
    slug: "michael-jordan-fleer-sticker-psa7",
    title: "1986 Fleer Jordan sticker PSA 7",
    subtitle: "Centered well with a clean surface and sharp eye appeal.",
    imageSrc: "/listings/michael-jordan-fleer-sticker-psa7.svg",
    franchise: "Sports",
    set: "1986 Fleer Basketball",
    cardNumber: "8",
    price: 950,
    tradeValue: 1050,
    location: "Chicago, IL",
    city: "chicago",
    distance: "6 miles away",
    condition: "Graded",
    grade: "PSA 7",
    rarity: "Iconic rookie-era insert",
    shipping: "Meetup preferred",
    meetupSpot: "Card Vault cafe lounge",
    posted: "1 hour ago",
    postedRank: 2,
    description:
      "Posted for collectors who want a real conversation, comps in hand, and a public deal table for a straightforward discussion.",
    categories: ["sports", "graded"],
    dealType: "buy-trade",
    accent: "#ef4444",
    secondary: "#312e81",
    surface: "#fee2e2",
    tags: ["Comp sheet ready", "Trade up welcome", "Serious offers"],
    wants: ["Kobe inserts", "cash plus modern slabs", "vintage Bulls lots"],
    seller: {
      name: "Andre T.",
      badge: "Verified slab seller",
      responseTime: "Replies in 14 min",
      sales: 63,
      rating: "5.0",
      memberSince: "2017",
      collectorFocus: "Vintage basketball and crossover slabs",
    },
  },
  {
    slug: "wembanyama-prizm-silver-rookie-stack",
    title: "Wemby rookie stack with silver holo",
    subtitle: "Silver prizm plus two base rookies in a ready-to-trade bundle.",
    imageSrc: "/listings/wembanyama-prizm-silver-rookie-stack.svg",
    franchise: "Sports",
    set: "2023 Prizm Basketball",
    cardNumber: "136",
    price: 310,
    tradeValue: 345,
    location: "Austin, TX",
    city: "austin",
    distance: "9 miles away",
    condition: "Near mint",
    rarity: "Rookie lot",
    shipping: "Meetup only",
    meetupSpot: "North Loop Card Club",
    posted: "2 hours ago",
    postedRank: 3,
    description:
      "Seller wants one meetup, one inspection, and a fast done deal for collectors tracking Wemby heat locally.",
    categories: ["sports", "lots"],
    dealType: "buy-only",
    accent: "#22c55e",
    secondary: "#0f172a",
    surface: "#dcfce7",
    tags: ["Meetup only", "Bundle price", "Fresh pull"],
    wants: ["cash only"],
    seller: {
      name: "Ty R.",
      badge: "Fast responder",
      responseTime: "Replies in 6 min",
      sales: 28,
      rating: "4.8",
      memberSince: "2021",
      collectorFocus: "NBA rookies and short prints",
    },
  },
  {
    slug: "caitlin-full-art-psa10",
    title: "Caitlin full art PSA 10",
    subtitle: "Pop report saved in chat and slab sleeve included.",
    imageSrc: "/listings/caitlin-full-art-psa10.svg",
    franchise: "Pokemon",
    set: "Matchless Fighters",
    cardNumber: "080",
    price: 425,
    tradeValue: 470,
    location: "Jersey City, NJ",
    city: "jersey-city",
    distance: "2 miles away",
    condition: "Graded",
    grade: "PSA 10",
    rarity: "Full art trainer",
    shipping: "Meetup or tracked shipping",
    meetupSpot: "Hudson Hobby Exchange",
    posted: "3 hours ago",
    postedRank: 4,
    description:
      "Perfect for collectors who want a clean slab, transparent comps, and the option to trade up in person.",
    categories: ["pokemon", "graded"],
    dealType: "buy-trade",
    accent: "#a855f7",
    secondary: "#ec4899",
    surface: "#f5d0fe",
    tags: ["PSA slab", "Trainer collector", "Trade up"],
    wants: ["Lillie cards", "Japanese trainer slabs", "cash plus promos"],
    seller: {
      name: "Sofia L.",
      badge: "Trusted grader",
      responseTime: "Replies in 12 min",
      sales: 54,
      rating: "4.9",
      memberSince: "2018",
      collectorFocus: "Trainer full arts and Japanese slabs",
    },
  },
  {
    slug: "blue-eyes-sdk-starter-deck-clean",
    title: "Blue-Eyes SDK starter deck copy",
    subtitle: "Clean binder-kept copy with close-ups already attached.",
    imageSrc: "/listings/blue-eyes-sdk-starter-deck-clean.svg",
    franchise: "Yu-Gi-Oh!",
    set: "Starter Deck Kaiba",
    cardNumber: "SDK-001",
    price: 240,
    tradeValue: 275,
    location: "Los Angeles, CA",
    city: "los-angeles",
    distance: "11 miles away",
    condition: "Light play",
    rarity: "Classic holo",
    shipping: "Meetup preferred",
    meetupSpot: "Little Tokyo trade tables",
    posted: "5 hours ago",
    postedRank: 5,
    description:
      "Seller is open to classic-era swaps and wants to keep the transaction friendly, quick, and public.",
    categories: ["tcg"],
    dealType: "buy-trade",
    accent: "#3b82f6",
    secondary: "#06b6d4",
    surface: "#dbeafe",
    tags: ["Classic Yugioh", "Trade friendly", "Closer photos ready"],
    wants: ["Goat format staples", "sealed structure decks", "cash plus binder cards"],
    seller: {
      name: "Kevin M.",
      badge: "Community regular",
      responseTime: "Replies in 15 min",
      sales: 19,
      rating: "4.7",
      memberSince: "2020",
      collectorFocus: "Classic Yu-Gi-Oh! holos and sealed decks",
    },
  },
  {
    slug: "luffy-op05-alt-art-bgs95",
    title: "Luffy OP05 alt art BGS 9.5",
    subtitle: "Strong subgrades with a slab sleeve and recent comps saved.",
    imageSrc: "/listings/luffy-op05-alt-art-bgs95.svg",
    franchise: "One Piece",
    set: "Awakening of the New Era",
    cardNumber: "OP05-119",
    price: 680,
    tradeValue: 760,
    location: "New York, NY",
    city: "new-york",
    distance: "3 miles away",
    condition: "Graded",
    grade: "BGS 9.5",
    rarity: "Manga style chase",
    shipping: "Meetup or tracked shipping",
    meetupSpot: "Bleecker Street Card Loft",
    posted: "7 hours ago",
    postedRank: 6,
    description:
      "High-visibility One Piece slab posted for collectors who prefer direct comps and a same-week meetup.",
    categories: ["tcg", "graded"],
    dealType: "buy-trade",
    accent: "#fb7185",
    secondary: "#7c3aed",
    surface: "#ffe4e6",
    tags: ["BGS 9.5", "Alt art", "Serious offers"],
    wants: ["Enel manga", "cash plus sealed OP boxes", "Pokemon alt arts"],
    seller: {
      name: "Luis A.",
      badge: "Show floor seller",
      responseTime: "Replies in 8 min",
      sales: 37,
      rating: "4.9",
      memberSince: "2022",
      collectorFocus: "One Piece grails and sealed booster boxes",
    },
  },
  {
    slug: "pokemon-151-binder-upgrade-lot",
    title: "Pokemon 151 binder upgrade lot",
    subtitle: "Twelve hits with reverse holos and two illustration rares.",
    imageSrc: "/listings/pokemon-151-binder-upgrade-lot.svg",
    franchise: "Pokemon",
    set: "Scarlet and Violet 151",
    cardNumber: "Lot of 12",
    price: 145,
    tradeValue: 165,
    location: "Austin, TX",
    city: "austin",
    distance: "5 miles away",
    condition: "Near mint",
    rarity: "Binder lot",
    shipping: "Meetup only",
    meetupSpot: "North Loop Card Club",
    posted: "Yesterday",
    postedRank: 7,
    description:
      "Great for collectors who want one efficient binder refresh instead of tracking every single card separately.",
    categories: ["pokemon", "lots"],
    dealType: "buy-only",
    accent: "#14b8a6",
    secondary: "#f59e0b",
    surface: "#ccfbf1",
    tags: ["Under $250", "Lot sale", "Great starter pickup"],
    wants: ["cash only"],
    seller: {
      name: "Alex P.",
      badge: "Weekend seller",
      responseTime: "Replies in 18 min",
      sales: 12,
      rating: "4.8",
      memberSince: "2023",
      collectorFocus: "Modern sets and full binder pages",
    },
  },
  {
    slug: "shohei-ohtani-bowman-rookie-sgc95",
    title: "Shohei Bowman Chrome rookie SGC 9.5",
    subtitle: "Clean tuxedo slab with recent card show comps.",
    imageSrc: "/listings/shohei-ohtani-bowman-rookie-sgc95.svg",
    franchise: "Sports",
    set: "2018 Bowman Chrome",
    cardNumber: "1",
    price: 520,
    tradeValue: 590,
    location: "Los Angeles, CA",
    city: "los-angeles",
    distance: "7 miles away",
    condition: "Graded",
    grade: "SGC 9.5",
    rarity: "Rookie",
    shipping: "Meetup or tracked shipping",
    meetupSpot: "Pasadena hobby hall",
    posted: "Yesterday",
    postedRank: 8,
    description:
      "Seller is looking for a low-friction meetup with collectors who want a flagship rookie and transparent pricing.",
    categories: ["sports", "graded"],
    dealType: "buy-trade",
    accent: "#f43f5e",
    secondary: "#38bdf8",
    surface: "#ffe4e6",
    tags: ["Ohtani", "Trade up", "Comp verified"],
    wants: ["vintage baseball slabs", "cash plus Kobe", "low-pop rookies"],
    seller: {
      name: "Derek N.",
      badge: "Verified comps",
      responseTime: "Replies in 10 min",
      sales: 47,
      rating: "4.9",
      memberSince: "2018",
      collectorFocus: "Baseball rookies and crossover slabs",
    },
  },
];

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function getListingBySlug(slug: string) {
  return listings.find((listing) => listing.slug === slug);
}

export function getRelatedListings(slug: string) {
  const currentListing = getListingBySlug(slug);

  if (!currentListing) {
    return [];
  }

  return listings
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

export function isCategoryFilter(
  value: string
): value is "all" | ListingCategory {
  return categoryFilters.some((category) => category.slug === value);
}

export function isCityFilter(value: string): value is CityFilter {
  return cityFilters.some((city) => city.slug === value);
}

export function isSortFilter(value: string): value is SortFilter {
  return sortFilters.some((sort) => sort.slug === value);
}

export function getCityFilterBySlug(slug: CityFilter) {
  return cityFilters.find((city) => city.slug === slug);
}

export function getDistanceBetweenCoordinates(
  sourceLatitude: number,
  sourceLongitude: number,
  targetLatitude: number,
  targetLongitude: number
) {
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const earthRadiusMiles = 3958.8;
  const latitudeDelta = toRadians(targetLatitude - sourceLatitude);
  const longitudeDelta = toRadians(targetLongitude - sourceLongitude);
  const normalizedSourceLatitude = toRadians(sourceLatitude);
  const normalizedTargetLatitude = toRadians(targetLatitude);

  const a =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(normalizedSourceLatitude) *
      Math.cos(normalizedTargetLatitude) *
      Math.sin(longitudeDelta / 2) ** 2;

  return 2 * earthRadiusMiles * Math.asin(Math.sqrt(a));
}

export function getSameCityFilter(latitude: number, longitude: number) {
  const supportedCities = cityFilters.filter(
    (
      city
    ): city is CityFilterOption & {
      slug: Exclude<CityFilter, "all">;
      latitude: number;
      longitude: number;
    } =>
      city.slug !== "all" &&
      typeof city.latitude === "number" &&
      typeof city.longitude === "number"
  );

  const nearestCity = supportedCities.reduce<CityFilterOption | null>(
    (currentNearest, city) => {
      const distanceToCity = getDistanceBetweenCoordinates(
        latitude,
        longitude,
        city.latitude,
        city.longitude
      );

      if (!currentNearest) {
        return city;
      }

      const distanceToCurrentNearest = getDistanceBetweenCoordinates(
        latitude,
        longitude,
        currentNearest.latitude ?? latitude,
        currentNearest.longitude ?? longitude
      );

      return distanceToCity < distanceToCurrentNearest ? city : currentNearest;
    },
    null
  );

  if (!nearestCity?.latitude || !nearestCity.longitude) {
    return null;
  }

  const nearestDistance = getDistanceBetweenCoordinates(
    latitude,
    longitude,
    nearestCity.latitude,
    nearestCity.longitude
  );

  return nearestDistance <= SAME_CITY_MATCH_MAX_DISTANCE_MILES
    ? nearestCity
    : null;
}
