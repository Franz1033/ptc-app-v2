export const listingBrandOptions = [
  { value: "Pokemon", label: "Pokemon" },
  { value: "Sports", label: "Sports" },
  { value: "TCG", label: "TCG" },
] as const;

export const listingConditionOptions = [
  { value: "Sealed", label: "Sealed" },
  { value: "Near mint", label: "Near mint" },
  { value: "Light play", label: "Light play" },
  { value: "Moderate play", label: "Moderate play" },
  { value: "Graded", label: "Graded" },
] as const;

export const listingDealTypeOptions = [
  {
    value: "buy-only",
    label: "Buy only",
    description: "Straight sale with no trade target required.",
  },
  {
    value: "buy-trade",
    label: "Buy or trade",
    description: "Accept cash deals and trade conversations.",
  },
  {
    value: "trade-only",
    label: "Trade only",
    description: "Lead with trade value and wanted cards.",
  },
] as const;

export const listingCityOptions = [
  { value: "new-york", label: "New York, NY" },
  { value: "jersey-city", label: "Jersey City, NJ" },
  { value: "chicago", label: "Chicago, IL" },
  { value: "austin", label: "Austin, TX" },
  { value: "los-angeles", label: "Los Angeles, CA" },
] as const;

export type ListingBrandOption = (typeof listingBrandOptions)[number]["value"];
export type ListingConditionOption =
  (typeof listingConditionOptions)[number]["value"];
export type ListingDealTypeOption =
  (typeof listingDealTypeOptions)[number]["value"];
export type ListingCityOption = (typeof listingCityOptions)[number]["value"];

export type CreateListingFormValues = {
  title: string;
  subtitle: string;
  franchise: ListingBrandOption;
  setName: string;
  cardNumber: string;
  condition: ListingConditionOption;
  grade: string;
  rarity: string;
  location: string;
  city: ListingCityOption;
  price: string;
  tradeValue: string;
  dealType: ListingDealTypeOption;
  shipping: string;
  meetupSpot: string;
  description: string;
  tags: string;
  wants: string;
};

export type CreateListingFieldErrors = Partial<
  Record<keyof CreateListingFormValues, string>
>;

export type CreateListingFormState = {
  message?: string;
  fieldErrors?: CreateListingFieldErrors;
  values: CreateListingFormValues;
};

export const initialCreateListingValues: CreateListingFormValues = {
  title: "",
  subtitle: "",
  franchise: "Pokemon",
  setName: "",
  cardNumber: "",
  condition: "Near mint",
  grade: "",
  rarity: "",
  location: "",
  city: "new-york",
  price: "",
  tradeValue: "",
  dealType: "buy-trade",
  shipping: "Meetup or tracked shipping",
  meetupSpot: "",
  description: "",
  tags: "",
  wants: "",
};

export const initialCreateListingState: CreateListingFormState = {
  values: initialCreateListingValues,
};

export function isListingBrand(value: string): value is ListingBrandOption {
  return listingBrandOptions.some((option) => option.value === value);
}

export function isListingCondition(
  value: string,
): value is ListingConditionOption {
  return listingConditionOptions.some((option) => option.value === value);
}

export function isListingDealType(
  value: string,
): value is ListingDealTypeOption {
  return listingDealTypeOptions.some((option) => option.value === value);
}

export function isListingCity(value: string): value is ListingCityOption {
  return listingCityOptions.some((option) => option.value === value);
}
