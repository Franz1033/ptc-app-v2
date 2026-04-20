export const listingCategoryOptions = [
  {
    value: "sports-cards",
    label: "Sports Cards",
    description: "Structured sports card listing fields are available now.",
  },
  {
    value: "collectible-card-game",
    label: "Collectible Card Game",
    description: "Use the core fields while category-specific details are still being finalized.",
  },
] as const;

export const sportsCardListingTypeOptions = [
  {
    value: "trading-card-singles",
    label: "Trading Card Singles",
    description: "List raw or graded singles with card-specific details.",
  },
  {
    value: "trading-card-set",
    label: "Trading Card Set",
    description: "Post a full set, starter set, or team set.",
  },
  {
    value: "sealed-trading-card-boxes",
    label: "Sealed Trading Card Boxes",
    description: "Share sealed hobby, retail, blaster, or booster boxes.",
  },
  {
    value: "sealed-trading-card-cases",
    label: "Sealed Trading Card Cases",
    description: "List sealed cases with case counts and configuration info.",
  },
  {
    value: "sealed-trading-card-packs",
    label: "Sealed Trading Card Packs",
    description: "Post loose or graded packs with pack-level specifics.",
  },
] as const;

export const singleConditionTypeOptions = [
  { value: "ungraded", label: "Ungraded" },
  { value: "graded", label: "Graded" },
] as const;

export const setConditionTypeOptions = [
  { value: "new", label: "New" },
  { value: "used", label: "Used" },
] as const;

export const sealedConditionTypeOptions = [
  { value: "new-factory-sealed", label: "New/Factory Sealed" },
  { value: "open-box-used", label: "Open Box/Used" },
] as const;

export const listingDealMethodOptions = [
  {
    value: "meet-up",
    label: "Meet-up",
    description: "Arrange a public in-person handoff.",
  },
  {
    value: "mailing-delivery",
    label: "Mailing & delivery",
    description: "Ship or deliver the item after payment.",
  },
] as const;

export const listingCityOptions = [
  { value: "new-york", label: "New York, NY" },
  { value: "jersey-city", label: "Jersey City, NJ" },
  { value: "chicago", label: "Chicago, IL" },
  { value: "austin", label: "Austin, TX" },
  { value: "los-angeles", label: "Los Angeles, CA" },
] as const;

export const sportOptions = [
  { value: "", label: "Select a sport" },
  { value: "Baseball", label: "Baseball" },
  { value: "Basketball", label: "Basketball" },
  { value: "Football", label: "Football" },
  { value: "Hockey", label: "Hockey" },
  { value: "Soccer", label: "Soccer" },
  { value: "Multi-Sport", label: "Multi-Sport" },
  { value: "Racing", label: "Racing" },
  { value: "Wrestling", label: "Wrestling" },
] as const;

export const yesNoFieldOptions = [
  { value: "", label: "Select an option" },
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
] as const;

export const professionalGraderOptions = [
  { value: "", label: "Select a grader" },
  { value: "PSA", label: "PSA" },
  { value: "BGS", label: "BGS" },
  { value: "SGC", label: "SGC" },
  { value: "CGC", label: "CGC" },
  { value: "CSG", label: "CSG" },
  { value: "ISA", label: "ISA" },
  { value: "Other", label: "Other" },
] as const;

export const cardConditionOptions = [
  { value: "", label: "Select card condition" },
  { value: "Near mint", label: "Near mint" },
  { value: "Light play", label: "Light play" },
  { value: "Moderate play", label: "Moderate play" },
  { value: "Heavy play", label: "Heavy play" },
  { value: "Poor", label: "Poor" },
] as const;

export type ListingCategoryOption =
  (typeof listingCategoryOptions)[number]["value"];
export type SportsCardListingTypeOption =
  (typeof sportsCardListingTypeOptions)[number]["value"];
export type CreateListingListingTypeOption =
  | SportsCardListingTypeOption
  | "";
export type ListingConditionTypeOption =
  | (typeof singleConditionTypeOptions)[number]["value"]
  | (typeof setConditionTypeOptions)[number]["value"]
  | (typeof sealedConditionTypeOptions)[number]["value"];
export type ListingDealMethodOption =
  (typeof listingDealMethodOptions)[number]["value"];
export type ListingCityOption = (typeof listingCityOptions)[number]["value"];
export type ProfessionalGraderOption =
  (typeof professionalGraderOptions)[number]["value"];

type SelectFieldOption = {
  value: string;
  label: string;
};

export type CreateListingFieldDefinition<Name extends string = string> = {
  name: Name;
  label: string;
  placeholder?: string;
  helpText?: string;
  kind?: "input" | "textarea" | "select";
  options?: readonly SelectFieldOption[];
};

export type CreateListingFormValues = {
  categoryFamily: ListingCategoryOption;
  listingType: CreateListingListingTypeOption;
  mediaFiles: string;
  title: string;
  sport: string;
  upc: string;
  playerAthlete: string;
  season: string;
  manufacturer: string;
  parallelVariety: string;
  features: string;
  setName: string;
  team: string;
  league: string;
  autographed: string;
  signedBy: string;
  autographAuthentication: string;
  autographAuthenticationNumber: string;
  autographFormat: string;
  cardName: string;
  cardNumber: string;
  type: string;
  yearManufactured: string;
  cardSize: string;
  countryOfOrigin: string;
  material: string;
  vintage: string;
  eventTournament: string;
  language: string;
  originalLicensedReprint: string;
  cardThickness: string;
  customized: string;
  insertSet: string;
  printRun: string;
  numberOfCards: string;
  configuration: string;
  numberOfBoxes: string;
  numberOfCases: string;
  numberOfPacks: string;
  mpn: string;
  conditionType: ListingConditionTypeOption;
  cardCondition: string;
  professionalGrader: ProfessionalGraderOption;
  grade: string;
  certificationNumber: string;
  description: string;
  price: string;
  dealMethods: ListingDealMethodOption[];
  city: ListingCityOption;
  meetupLocation: string;
  deliveryDetails: string;
};

export type CreateListingFieldErrors = Partial<
  Record<keyof CreateListingFormValues, string>
>;

export type CreateListingFormState = {
  message?: string;
  fieldErrors?: CreateListingFieldErrors;
  values: CreateListingFormValues;
};

export const listingSpecificFieldDefinitions = {
  sport: {
    name: "sport",
    label: "Sport",
    kind: "select",
    options: sportOptions,
  },
  upc: {
    name: "upc",
    label: "UPC",
    placeholder: "759606208616",
  },
  playerAthlete: {
    name: "playerAthlete",
    label: "Player/Athlete",
    placeholder: "Victor Wembanyama",
  },
  season: {
    name: "season",
    label: "Season",
    placeholder: "2023-24",
  },
  manufacturer: {
    name: "manufacturer",
    label: "Manufacturer",
    placeholder: "Panini",
  },
  parallelVariety: {
    name: "parallelVariety",
    label: "Parallel/Variety",
    placeholder: "Silver Prizm",
  },
  features: {
    name: "features",
    label: "Features",
    placeholder: "Rookie, short print, refractor",
  },
  setName: {
    name: "setName",
    label: "Set",
    placeholder: "2023 Prizm Basketball",
  },
  team: {
    name: "team",
    label: "Team",
    placeholder: "San Antonio Spurs",
  },
  league: {
    name: "league",
    label: "League",
    placeholder: "NBA",
  },
  autographed: {
    name: "autographed",
    label: "Autographed",
    kind: "select",
    options: yesNoFieldOptions,
  },
  signedBy: {
    name: "signedBy",
    label: "Signed By",
    placeholder: "Victor Wembanyama",
  },
  autographAuthentication: {
    name: "autographAuthentication",
    label: "Autographed Authentication",
    placeholder: "Panini Authentic",
  },
  autographAuthenticationNumber: {
    name: "autographAuthenticationNumber",
    label: "Autograph Authentication Number",
    placeholder: "PA-204938",
  },
  autographFormat: {
    name: "autographFormat",
    label: "Autograph Format",
    placeholder: "On-card",
  },
  cardName: {
    name: "cardName",
    label: "Card Name",
    placeholder: "Prizm Silver",
  },
  cardNumber: {
    name: "cardNumber",
    label: "Card Number",
    placeholder: "136",
  },
  type: {
    name: "type",
    label: "Type",
    placeholder: "Sports Trading Card",
  },
  yearManufactured: {
    name: "yearManufactured",
    label: "Year Manufactured",
    placeholder: "2024",
  },
  cardSize: {
    name: "cardSize",
    label: "Card Size",
    placeholder: "Standard",
  },
  countryOfOrigin: {
    name: "countryOfOrigin",
    label: "Country of Origin",
    placeholder: "United States",
  },
  material: {
    name: "material",
    label: "Material",
    placeholder: "Card stock",
  },
  vintage: {
    name: "vintage",
    label: "Vintage",
    kind: "select",
    options: yesNoFieldOptions,
  },
  eventTournament: {
    name: "eventTournament",
    label: "Event/Tournament",
    placeholder: "NBA Finals",
  },
  language: {
    name: "language",
    label: "Language",
    placeholder: "English",
  },
  originalLicensedReprint: {
    name: "originalLicensedReprint",
    label: "Original/Licensed Reprint",
    placeholder: "Original",
  },
  cardThickness: {
    name: "cardThickness",
    label: "Card Thickness",
    placeholder: "35 Pt.",
  },
  customized: {
    name: "customized",
    label: "Customized",
    kind: "select",
    options: yesNoFieldOptions,
  },
  insertSet: {
    name: "insertSet",
    label: "Insert Set",
    placeholder: "Color Blast",
  },
  printRun: {
    name: "printRun",
    label: "Print Run",
    placeholder: "49",
  },
  numberOfCards: {
    name: "numberOfCards",
    label: "Number of Cards",
    placeholder: "36",
  },
  configuration: {
    name: "configuration",
    label: "Configuration",
    placeholder: "12 packs per box",
  },
  numberOfBoxes: {
    name: "numberOfBoxes",
    label: "Number of Boxes",
    placeholder: "1",
  },
  numberOfCases: {
    name: "numberOfCases",
    label: "Number of Cases",
    placeholder: "1",
  },
  numberOfPacks: {
    name: "numberOfPacks",
    label: "Number of Packs",
    placeholder: "24",
  },
  mpn: {
    name: "mpn",
    label: "MPN",
    placeholder: "PAN-2024-HOBBY",
  },
  professionalGrader: {
    name: "professionalGrader",
    label: "Professional Grader",
    kind: "select",
    options: professionalGraderOptions,
  },
  grade: {
    name: "grade",
    label: "Grade",
    placeholder: "10",
  },
  certificationNumber: {
    name: "certificationNumber",
    label: "Certification Number",
    placeholder: "12345678",
  },
} as const satisfies Record<string, CreateListingFieldDefinition>;

export type ListingSpecificFieldName =
  keyof typeof listingSpecificFieldDefinitions;

type ListingTypeFieldConfig = {
  required: readonly ListingSpecificFieldName[];
  optional: readonly ListingSpecificFieldName[];
};

export const listingTypeFieldConfig = {
  "trading-card-singles": {
    required: ["sport"],
    optional: [
      "upc",
      "playerAthlete",
      "season",
      "manufacturer",
      "parallelVariety",
      "features",
      "setName",
      "team",
      "league",
      "autographed",
      "signedBy",
      "autographAuthentication",
      "autographAuthenticationNumber",
      "autographFormat",
      "cardName",
      "cardNumber",
      "type",
      "yearManufactured",
      "cardSize",
      "countryOfOrigin",
      "material",
      "vintage",
      "eventTournament",
      "language",
      "originalLicensedReprint",
      "cardThickness",
      "customized",
      "insertSet",
      "printRun",
    ],
  },
  "trading-card-set": {
    required: [],
    optional: [
      "upc",
      "season",
      "yearManufactured",
      "manufacturer",
      "sport",
      "setName",
      "league",
      "numberOfCards",
      "playerAthlete",
      "type",
      "team",
      "features",
      "cardSize",
      "countryOfOrigin",
      "material",
      "eventTournament",
      "autographed",
      "autographAuthenticationNumber",
      "signedBy",
      "autographFormat",
      "vintage",
      "language",
      "originalLicensedReprint",
      "cardName",
      "cardNumber",
    ],
  },
  "sealed-trading-card-boxes": {
    required: ["manufacturer", "setName"],
    optional: [
      "upc",
      "season",
      "yearManufactured",
      "sport",
      "league",
      "team",
      "configuration",
      "numberOfBoxes",
      "numberOfCards",
      "type",
      "cardSize",
      "playerAthlete",
      "eventTournament",
      "features",
      "material",
      "countryOfOrigin",
      "autographed",
      "autographAuthentication",
      "autographAuthenticationNumber",
      "signedBy",
      "autographFormat",
      "language",
      "vintage",
      "mpn",
    ],
  },
  "sealed-trading-card-cases": {
    required: ["manufacturer", "setName"],
    optional: [
      "upc",
      "season",
      "yearManufactured",
      "sport",
      "league",
      "team",
      "configuration",
      "numberOfCards",
      "numberOfCases",
      "type",
      "cardSize",
      "material",
      "language",
      "playerAthlete",
      "features",
      "countryOfOrigin",
      "eventTournament",
      "vintage",
      "autographed",
      "autographAuthentication",
      "autographAuthenticationNumber",
      "signedBy",
      "autographFormat",
      "mpn",
    ],
  },
  "sealed-trading-card-packs": {
    required: ["manufacturer", "setName"],
    optional: [
      "upc",
      "season",
      "yearManufactured",
      "sport",
      "grade",
      "professionalGrader",
      "certificationNumber",
      "league",
      "team",
      "configuration",
      "numberOfCards",
      "numberOfPacks",
      "type",
      "cardSize",
      "playerAthlete",
      "features",
      "countryOfOrigin",
      "material",
      "language",
      "eventTournament",
      "autographed",
      "autographAuthentication",
      "autographAuthenticationNumber",
      "signedBy",
      "autographFormat",
      "vintage",
      "mpn",
    ],
  },
} as const satisfies Record<SportsCardListingTypeOption, ListingTypeFieldConfig>;

export const initialCreateListingValues: CreateListingFormValues = {
  categoryFamily: "sports-cards",
  listingType: "trading-card-singles",
  mediaFiles: "",
  title: "",
  sport: "",
  upc: "",
  playerAthlete: "",
  season: "",
  manufacturer: "",
  parallelVariety: "",
  features: "",
  setName: "",
  team: "",
  league: "",
  autographed: "",
  signedBy: "",
  autographAuthentication: "",
  autographAuthenticationNumber: "",
  autographFormat: "",
  cardName: "",
  cardNumber: "",
  type: "",
  yearManufactured: "",
  cardSize: "",
  countryOfOrigin: "",
  material: "",
  vintage: "",
  eventTournament: "",
  language: "",
  originalLicensedReprint: "",
  cardThickness: "",
  customized: "",
  insertSet: "",
  printRun: "",
  numberOfCards: "",
  configuration: "",
  numberOfBoxes: "",
  numberOfCases: "",
  numberOfPacks: "",
  mpn: "",
  conditionType: "ungraded",
  cardCondition: "",
  professionalGrader: "",
  grade: "",
  certificationNumber: "",
  description: "",
  price: "",
  dealMethods: ["meet-up"],
  city: "new-york",
  meetupLocation: "",
  deliveryDetails: "",
};

export const initialCreateListingState: CreateListingFormState = {
  values: initialCreateListingValues,
};

export function isListingCategory(value: string): value is ListingCategoryOption {
  return listingCategoryOptions.some((option) => option.value === value);
}

export function isSportsCardListingType(
  value: string,
): value is SportsCardListingTypeOption {
  return sportsCardListingTypeOptions.some((option) => option.value === value);
}

export function isListingConditionType(
  value: string,
): value is ListingConditionTypeOption {
  return (
    singleConditionTypeOptions.some((option) => option.value === value) ||
    setConditionTypeOptions.some((option) => option.value === value) ||
    sealedConditionTypeOptions.some((option) => option.value === value)
  );
}

export function isListingDealMethod(
  value: string,
): value is ListingDealMethodOption {
  return listingDealMethodOptions.some((option) => option.value === value);
}

export function isListingCity(value: string): value is ListingCityOption {
  return listingCityOptions.some((option) => option.value === value);
}

export function isProfessionalGrader(
  value: string,
): value is ProfessionalGraderOption {
  return professionalGraderOptions.some((option) => option.value === value);
}

export function getListingTypeLabel(value: SportsCardListingTypeOption) {
  return (
    sportsCardListingTypeOptions.find((option) => option.value === value)?.label ??
    "Listing"
  );
}

export function getListingCategoryLabel(value: ListingCategoryOption) {
  return (
    listingCategoryOptions.find((option) => option.value === value)?.label ??
    "Listing"
  );
}

export function getConditionOptionsForListingType(
  listingType: SportsCardListingTypeOption,
) {
  if (listingType === "trading-card-set") {
    return setConditionTypeOptions;
  }

  if (
    listingType === "sealed-trading-card-boxes" ||
    listingType === "sealed-trading-card-cases" ||
    listingType === "sealed-trading-card-packs"
  ) {
    return sealedConditionTypeOptions;
  }

  return singleConditionTypeOptions;
}

export function getDefaultConditionTypeForListingType(
  listingType: SportsCardListingTypeOption,
) {
  return getConditionOptionsForListingType(listingType)[0].value;
}

export function getConditionOptionsForCategory(
  categoryFamily: ListingCategoryOption,
  listingType: CreateListingListingTypeOption,
) {
  if (
    categoryFamily === "sports-cards" &&
    isSportsCardListingType(listingType)
  ) {
    return getConditionOptionsForListingType(listingType);
  }

  return setConditionTypeOptions;
}

export function getDefaultConditionTypeForCategory(
  categoryFamily: ListingCategoryOption,
  listingType: CreateListingListingTypeOption,
) {
  return getConditionOptionsForCategory(categoryFamily, listingType)[0].value;
}

export function getConditionLabel(value: ListingConditionTypeOption) {
  return (
    [
      ...singleConditionTypeOptions,
      ...setConditionTypeOptions,
      ...sealedConditionTypeOptions,
    ].find((option) => option.value === value)?.label ?? "Condition"
  );
}

export function getDealMethodLabel(value: ListingDealMethodOption) {
  return (
    listingDealMethodOptions.find((option) => option.value === value)?.label ??
    value
  );
}

export function getCityLabel(value: ListingCityOption) {
  return (
    listingCityOptions.find((option) => option.value === value)?.label ??
    "New York, NY"
  );
}

export function getSpecificFieldConfigForListingType(
  listingType: SportsCardListingTypeOption,
) {
  return listingTypeFieldConfig[listingType];
}

export function getSpecificFieldConfigForCategory(
  categoryFamily: ListingCategoryOption,
  listingType: CreateListingListingTypeOption,
) {
  if (
    categoryFamily === "sports-cards" &&
    isSportsCardListingType(listingType)
  ) {
    return getSpecificFieldConfigForListingType(listingType);
  }

  return {
    required: [],
    optional: [],
  } as const;
}
