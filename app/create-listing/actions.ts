"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  type CreateListingCityOption,
  type CreateListingFieldErrors,
  type CreateListingFormState,
  type CreateListingFormValues,
  getDefaultListingTypeForCategory,
  getCityLabel,
  getConditionLabel,
  getConditionOptionsForCategory,
  getDealMethodLabel,
  getDefaultConditionTypeForCategory,
  getListingCategoryLabel,
  getListingTypeLabel,
  getSpecificFieldConfigForCategory,
  initialCreateListingValues,
  isCollectibleCardGameListingType,
  isListingCategory,
  isListingCity,
  isListingConditionType,
  isListingDealMethod,
  isProfessionalGrader,
  isSingleCardListingType,
  isSportsCardListingType,
  listingSpecificFieldDefinitions,
  type ListingSpecificFieldName,
} from "@/app/create-listing/form-options";
import { requireSession } from "@/lib/auth-session";
import {
  deleteListingMediaFiles,
  isSupportedListingMediaFile,
  MAX_LISTING_MEDIA_FILES,
  MAX_LISTING_MEDIA_FILE_SIZE_BYTES,
  MAX_LISTING_MEDIA_TOTAL_SIZE_BYTES,
  storeListingMediaFiles,
} from "@/lib/listing-media";
import { createStoredMarketplaceListing } from "@/lib/marketplace-listings";

type ListingDetailEntry = {
  label: string;
  value: string;
};

const textFieldNames = [
  "title",
  "sport",
  "game",
  "upc",
  "playerAthlete",
  "season",
  "manufacturer",
  "parallelVariety",
  "features",
  "setName",
  "team",
  "league",
  "cardType",
  "specialty",
  "cardState",
  "character",
  "ageLevel",
  "rarity",
  "finish",
  "attributeColor",
  "creatureMonsterType",
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
  "conventionEvent",
  "language",
  "originalLicensedReprint",
  "cardThickness",
  "customized",
  "insertSet",
  "printRun",
  "illustrator",
  "hp",
  "attackPower",
  "defenseToughness",
  "cost",
  "franchise",
  "featuredPersonArtist",
  "numberOfCards",
  "configuration",
  "numberOfBoxes",
  "numberOfCases",
  "numberOfPacks",
  "mpn",
  "cardCondition",
  "grade",
  "certificationNumber",
  "description",
  "price",
  "meetupLocation",
  "deliveryDetails",
] as const satisfies ReadonlyArray<
  Exclude<
    keyof CreateListingFormValues,
    | "mediaFiles"
    | "categoryFamily"
    | "listingType"
    | "conditionType"
    | "professionalGrader"
    | "dealMethods"
    | "city"
  >
>;

function getTrimmedTextValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function getTrimmedArrayValues(formData: FormData, key: string) {
  return Array.from(
    new Set(
      formData
        .getAll(key)
        .map((value) => String(value).trim())
        .filter(Boolean),
    ),
  );
}

function getUploadedFiles(formData: FormData, key: string) {
  return formData.getAll(key).flatMap((value) => {
    if (!(value instanceof File) || value.size === 0) {
      return [];
    }

    return [value];
  });
}

function getFormValues(formData: FormData): CreateListingFormValues {
  const textValues = Object.fromEntries(
    textFieldNames.map((fieldName) => [fieldName, getTrimmedTextValue(formData, fieldName)]),
  ) as Pick<CreateListingFormValues, (typeof textFieldNames)[number]>;

  const rawCategoryFamily = getTrimmedTextValue(formData, "categoryFamily");
  const categoryFamily = isListingCategory(rawCategoryFamily)
    ? rawCategoryFamily
    : initialCreateListingValues.categoryFamily;
  const rawListingType = getTrimmedTextValue(formData, "listingType");
  const listingType =
    (categoryFamily === "sports-cards" &&
      isSportsCardListingType(rawListingType)) ||
    (categoryFamily === "collectible-card-game" &&
      isCollectibleCardGameListingType(rawListingType))
      ? rawListingType
      : getDefaultListingTypeForCategory(categoryFamily);

  const rawConditionType = getTrimmedTextValue(formData, "conditionType");
  const supportedConditionOptions = getConditionOptionsForCategory(
    categoryFamily,
    listingType,
  );
  const defaultConditionType = getDefaultConditionTypeForCategory(
    categoryFamily,
    listingType,
  );
  const conditionType =
    isListingConditionType(rawConditionType) &&
    supportedConditionOptions.some((option) => option.value === rawConditionType)
      ? rawConditionType
      : defaultConditionType;

  const rawDealMethods = getTrimmedArrayValues(formData, "dealMethods");
  const rawCity = getTrimmedTextValue(formData, "city");
  const rawProfessionalGrader = getTrimmedTextValue(formData, "professionalGrader");

  return {
    ...textValues,
    mediaFiles: initialCreateListingValues.mediaFiles,
    categoryFamily,
    listingType,
    conditionType,
    professionalGrader: isProfessionalGrader(rawProfessionalGrader)
      ? rawProfessionalGrader
      : initialCreateListingValues.professionalGrader,
    dealMethods: rawDealMethods.filter(isListingDealMethod),
    city: isListingCity(rawCity) ? rawCity : initialCreateListingValues.city,
  };
}

function parseInteger(value: string) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function buildValidationMessage(label: string) {
  return `Add ${label.toLowerCase()}.`;
}

function buildSpecificEntries(
  values: CreateListingFormValues,
  fieldNames: readonly ListingSpecificFieldName[],
) {
  return fieldNames.flatMap<ListingDetailEntry>((fieldName) => {
    const definition = listingSpecificFieldDefinitions[fieldName];
    const rawValue = values[fieldName];
    const options = "options" in definition ? definition.options : undefined;

    if (!rawValue) {
      return [];
    }

    const displayValue =
      options?.find((option) => option.value === rawValue)?.label ?? rawValue;

    return [
      {
        label: definition.label,
        value: displayValue,
      },
    ];
  });
}

function buildConditionEntries(values: CreateListingFormValues) {
  if (!values.listingType || !isSingleCardListingType(values.listingType)) {
    return [
      {
        label: "Condition",
        value: getConditionLabel(values.conditionType),
      },
    ];
  }

  const entries: ListingDetailEntry[] = [
    {
      label: "Condition Type",
      value: getConditionLabel(values.conditionType),
    },
  ];

  if (values.conditionType === "ungraded" && values.cardCondition) {
    entries.push({
      label: "Card Condition",
      value: values.cardCondition,
    });
  }

  if (values.conditionType === "graded") {
    if (values.professionalGrader) {
      entries.push({
        label: "Professional Grader",
        value: values.professionalGrader,
      });
    }

    if (values.grade) {
      entries.push({
        label: "Grade",
        value: values.grade,
      });
    }

    if (values.certificationNumber) {
      entries.push({
        label: "Certification Number",
        value: values.certificationNumber,
      });
    }
  }

  return entries;
}

function buildConditionSummary(values: CreateListingFormValues) {
  if (!values.listingType || !isSingleCardListingType(values.listingType)) {
    return {
      condition: getConditionLabel(values.conditionType),
      grade: undefined,
    };
  }

  if (values.conditionType === "graded") {
    return {
      condition: "Graded",
      grade:
        values.professionalGrader && values.grade
          ? `${values.professionalGrader} ${values.grade}`
          : values.grade || undefined,
    };
  }

  if (values.conditionType === "ungraded") {
    return {
      condition: values.cardCondition || "Ungraded",
      grade: undefined,
    };
  }

  return {
    condition: getConditionLabel(values.conditionType),
    grade: undefined,
  };
}

function getSportsListingType(values: CreateListingFormValues) {
  return values.categoryFamily === "sports-cards" &&
    isSportsCardListingType(values.listingType)
    ? values.listingType
    : null;
}

function buildSubtitle(values: CreateListingFormValues) {
  const listingTypeLabel =
    values.listingType &&
    ((values.categoryFamily === "sports-cards" &&
      isSportsCardListingType(values.listingType)) ||
      (values.categoryFamily === "collectible-card-game" &&
        isCollectibleCardGameListingType(values.listingType)))
      ? getListingTypeLabel(values.listingType)
      : "";

  if (values.categoryFamily === "sports-cards") {
    const parts = [
      listingTypeLabel,
      values.sport,
      values.setName,
      values.manufacturer,
    ].filter(Boolean);

    return parts.join(" / ").slice(0, 140) || "Sports card listing";
  }

  if (values.categoryFamily === "collectible-card-game") {
    const parts = [
      listingTypeLabel,
      values.game,
      values.cardName || values.setName,
      values.manufacturer,
    ].filter(Boolean);

    return parts.join(" / ").slice(0, 140) || "Collectible card game listing";
  }

  return (
    [
      getListingCategoryLabel(values.categoryFamily),
      getConditionLabel(values.conditionType),
    ]
      .filter(Boolean)
      .join(" / ")
      .slice(0, 140) || "Collectible card listing"
  );
}

function buildRaritySummary(values: CreateListingFormValues) {
  const listingTypeLabel =
    values.listingType &&
    ((values.categoryFamily === "sports-cards" &&
      isSportsCardListingType(values.listingType)) ||
      (values.categoryFamily === "collectible-card-game" &&
        isCollectibleCardGameListingType(values.listingType)))
      ? getListingTypeLabel(values.listingType)
      : "Listing";

  if (values.categoryFamily === "sports-cards") {
    return (
      values.parallelVariety ||
      values.cardName ||
      values.type ||
      listingTypeLabel
    );
  }

  if (values.categoryFamily === "collectible-card-game") {
    return values.rarity || values.cardName || values.cardType || listingTypeLabel;
  }

  return getListingCategoryLabel(values.categoryFamily);
}

function buildShippingSummary(values: CreateListingFormValues) {
  if (
    values.dealMethods.includes("meet-up") &&
    values.dealMethods.includes("mailing-delivery")
  ) {
    return values.deliveryDetails
      ? `Meet-up or mailing and delivery. ${values.deliveryDetails}`
      : "Meet-up or mailing and delivery";
  }

  if (values.dealMethods.includes("mailing-delivery")) {
    return values.deliveryDetails || "Mailing and delivery";
  }

  return "Meet-up only";
}

function buildDefaultTags(
  values: CreateListingFormValues,
  conditionLabel: string,
) {
  const sportsListingType = getSportsListingType(values);
  const listingTypeLabel =
    values.listingType &&
    ((values.categoryFamily === "sports-cards" &&
      isSportsCardListingType(values.listingType)) ||
      (values.categoryFamily === "collectible-card-game" &&
        isCollectibleCardGameListingType(values.listingType)))
      ? getListingTypeLabel(values.listingType)
      : "";
  const primaryTopic =
    values.categoryFamily === "sports-cards" ? values.sport : values.game;

  return Array.from(
    new Set(
      [
        getListingCategoryLabel(values.categoryFamily),
        ...(sportsListingType ? [getListingTypeLabel(sportsListingType)] : []),
        ...(!sportsListingType && listingTypeLabel ? [listingTypeLabel] : []),
        conditionLabel,
        primaryTopic,
        values.manufacturer,
        ...values.dealMethods.map(getDealMethodLabel),
      ].filter(Boolean),
    ),
  ).slice(0, 6);
}

function validateValues(values: CreateListingFormValues, mediaFiles: File[]) {
  const fieldErrors: CreateListingFieldErrors = {};
  const parsedPrice = parseInteger(values.price);
  const specificFieldConfig = getSpecificFieldConfigForCategory(
    values.categoryFamily,
    values.listingType,
  );
  const totalMediaBytes = mediaFiles.reduce(
    (runningTotal, file) => runningTotal + file.size,
    0,
  );

  if (mediaFiles.length === 0) {
    fieldErrors.mediaFiles = "Upload at least one photo.";
  } else if (mediaFiles.length > MAX_LISTING_MEDIA_FILES) {
    fieldErrors.mediaFiles = `Upload up to ${MAX_LISTING_MEDIA_FILES} photos.`;
  } else if (mediaFiles.some((file) => !isSupportedListingMediaFile(file))) {
    fieldErrors.mediaFiles = "Only image files are supported.";
  } else if (
    mediaFiles.some((file) => file.size > MAX_LISTING_MEDIA_FILE_SIZE_BYTES)
  ) {
    fieldErrors.mediaFiles =
      "Each photo must be 20 MB or smaller.";
  } else if (totalMediaBytes > MAX_LISTING_MEDIA_TOTAL_SIZE_BYTES) {
    fieldErrors.mediaFiles =
      "The total photo upload must stay under 45 MB.";
  }

  if (values.title.length < 4) {
    fieldErrors.title = "Add a title buyers can scan quickly.";
  }

  for (const fieldName of specificFieldConfig.required) {
    if (!values[fieldName]) {
      fieldErrors[fieldName] = buildValidationMessage(
        listingSpecificFieldDefinitions[fieldName].label,
      );
    }
  }

  if (
    values.listingType &&
    isSingleCardListingType(values.listingType) &&
    values.conditionType === "ungraded" &&
    !values.cardCondition
  ) {
    fieldErrors.cardCondition = "Add the card condition.";
  }

  if (
    values.listingType &&
    isSingleCardListingType(values.listingType) &&
    values.conditionType === "graded"
  ) {
    if (!values.professionalGrader) {
      fieldErrors.professionalGrader = "Select the professional grader.";
    }

    if (!values.grade) {
      fieldErrors.grade = "Add the assigned grade.";
    }

    if (!values.certificationNumber) {
      fieldErrors.certificationNumber = "Add the certification number.";
    }
  }

  if (values.description.length < 20) {
    fieldErrors.description =
      "Add a few details buyers should know before messaging.";
  }

  if (!parsedPrice) {
    fieldErrors.price = "Add a valid price.";
  }

  if (!isListingCity(values.city)) {
    fieldErrors.city = "Choose a U.S. city from the suggestions.";
  }

  if (values.dealMethods.length === 0) {
    fieldErrors.dealMethods = "Choose at least one deal method.";
  }

  if (values.dealMethods.includes("meet-up") && values.meetupLocation.length < 4) {
    fieldErrors.meetupLocation = "Add a safe meet-up location.";
  }

  return {
    fieldErrors,
    parsedPrice,
  };
}

export async function createListingAction(
  _previousState: CreateListingFormState,
  formData: FormData,
): Promise<CreateListingFormState> {
  const values = getFormValues(formData);
  const mediaFiles = getUploadedFiles(formData, "mediaFiles");
  const { fieldErrors, parsedPrice } = validateValues(values, mediaFiles);

  if (Object.keys(fieldErrors).length > 0) {
    if (process.env.NODE_ENV !== "production") {
      console.info("Create listing validation failed", fieldErrors);
    }

    return {
      message: "Check the highlighted fields and try again.",
      fieldErrors,
      values,
    };
  }

  if (!isListingCity(values.city)) {
    return {
      message: "Check the highlighted fields and try again.",
      fieldErrors: {
        city: "Choose a U.S. city from the suggestions.",
      },
      values,
    };
  }

  const session = await requireSession("/create-listing");
  const listingCity: CreateListingCityOption = values.city;
  const { condition, grade } = buildConditionSummary(values);
  const specificFieldConfig = getSpecificFieldConfigForCategory(
    values.categoryFamily,
    values.listingType,
  );
  const categoryLabel = getListingCategoryLabel(values.categoryFamily);
  const listingTypeLabel =
    values.listingType &&
    ((values.categoryFamily === "sports-cards" &&
      isSportsCardListingType(values.listingType)) ||
      (values.categoryFamily === "collectible-card-game" &&
        isCollectibleCardGameListingType(values.listingType)))
      ? getListingTypeLabel(values.listingType)
      : undefined;
  const sportsListingType = getSportsListingType(values);
  const specifics =
    specificFieldConfig.required.length > 0 || specificFieldConfig.optional.length > 0
      ? buildSpecificEntries(values, [
          ...specificFieldConfig.required,
          ...specificFieldConfig.optional,
        ])
      : [];
  const conditionDetails = buildConditionEntries(values);
  const defaultTags = buildDefaultTags(values, condition);
  const shippingSummary = buildShippingSummary(values);
  const cityLabel = getCityLabel(listingCity);
  let storedMediaUrls: string[] = [];

  let redirectPath = "";

  try {
    storedMediaUrls = await storeListingMediaFiles(mediaFiles);

    const storedListing = await createStoredMarketplaceListing({
      userId: session.user.id,
      title: values.title,
      subtitle: buildSubtitle(values),
      franchise:
        values.categoryFamily === "sports-cards"
          ? "Sports"
          : values.franchise || values.game || "TCG",
      setName:
        values.categoryFamily === "sports-cards"
          ? values.setName ||
            values.manufacturer ||
            (sportsListingType ? getListingTypeLabel(sportsListingType) : categoryLabel)
          : values.setName || values.game || categoryLabel,
      cardNumber:
        values.categoryFamily === "sports-cards"
          ? values.cardNumber || values.upc || ""
          : values.cardNumber || values.upc || "",
      price: parsedPrice ?? 0,
      tradeValue: parsedPrice ?? 0,
      location: cityLabel,
      city: listingCity,
      condition,
      grade,
      rarity: buildRaritySummary(values),
      shipping: shippingSummary,
      meetupSpot: values.meetupLocation || "Arrange after messaging",
      description: values.description,
      tags: defaultTags,
      wants: [],
      dealType: "buy-only",
      listingCategory: categoryLabel,
      listingType: listingTypeLabel,
      mediaUrls: storedMediaUrls,
      specifics,
      conditionDetails,
      dealMethods: values.dealMethods.map(getDealMethodLabel),
    });

    revalidatePath("/marketplace");
    revalidatePath(`/listing/${storedListing.slug}`);
    redirectPath = `/listing/${storedListing.slug}`;
  } catch (error) {
    if (storedMediaUrls.length > 0) {
      await deleteListingMediaFiles(storedMediaUrls);
    }

    console.error("Failed to create marketplace listing", error);

    const message =
      error instanceof Error &&
      error.message.includes("Structured listing columns")
        ? "Listing media uploads need the latest database schema before they can be published."
        : "We couldn't publish the listing yet. Please try again.";

    return {
      message,
      values,
    };
  }

  redirect(redirectPath);
}
