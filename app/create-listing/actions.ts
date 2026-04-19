"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  type CreateListingFieldErrors,
  type CreateListingFormState,
  type CreateListingFormValues,
  initialCreateListingValues,
  isListingBrand,
  isListingCity,
  isListingCondition,
  isListingDealType,
} from "@/app/create-listing/form-options";
import { requireSession } from "@/lib/auth-session";
import { createStoredMarketplaceListing } from "@/lib/marketplace-listings";

function getTrimmedTextValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function getFormValues(formData: FormData): CreateListingFormValues {
  const rawBrand = getTrimmedTextValue(formData, "franchise");
  const rawCondition = getTrimmedTextValue(formData, "condition");
  const rawCity = getTrimmedTextValue(formData, "city");
  const rawDealType = getTrimmedTextValue(formData, "dealType");

  return {
    title: getTrimmedTextValue(formData, "title"),
    subtitle: getTrimmedTextValue(formData, "subtitle"),
    franchise: isListingBrand(rawBrand)
      ? rawBrand
      : initialCreateListingValues.franchise,
    setName: getTrimmedTextValue(formData, "setName"),
    cardNumber: getTrimmedTextValue(formData, "cardNumber"),
    condition: isListingCondition(rawCondition)
      ? rawCondition
      : initialCreateListingValues.condition,
    grade: getTrimmedTextValue(formData, "grade"),
    rarity: getTrimmedTextValue(formData, "rarity"),
    location: getTrimmedTextValue(formData, "location"),
    city: isListingCity(rawCity) ? rawCity : initialCreateListingValues.city,
    price: getTrimmedTextValue(formData, "price"),
    tradeValue: getTrimmedTextValue(formData, "tradeValue"),
    dealType: isListingDealType(rawDealType)
      ? rawDealType
      : initialCreateListingValues.dealType,
    shipping: getTrimmedTextValue(formData, "shipping"),
    meetupSpot: getTrimmedTextValue(formData, "meetupSpot"),
    description: getTrimmedTextValue(formData, "description"),
    tags: getTrimmedTextValue(formData, "tags"),
    wants: getTrimmedTextValue(formData, "wants"),
  };
}

function parseInteger(value: string) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function parseList(value: string) {
  return Array.from(
    new Set(
      value
        .split(/[\n,]/)
        .map((entry) => entry.trim())
        .filter(Boolean),
    ),
  ).slice(0, 6);
}

function getDefaultTags(values: CreateListingFormValues) {
  return [values.condition, values.dealType === "trade-only" ? "Trade ready" : "Fixed price"];
}

function getDefaultWants(values: CreateListingFormValues) {
  if (values.dealType === "buy-only") {
    return ["Cash offers"];
  }

  return [`${values.franchise} trades`, "Cash plus trade"];
}

function validateValues(values: CreateListingFormValues) {
  const fieldErrors: CreateListingFieldErrors = {};

  if (values.title.length < 4) {
    fieldErrors.title = "Add a title buyers can scan quickly.";
  }

  if (values.setName.length < 2) {
    fieldErrors.setName = "Add the set or product name.";
  }

  if (!values.cardNumber) {
    fieldErrors.cardNumber = "Add the card number or listing reference.";
  }

  if (values.rarity.length < 2) {
    fieldErrors.rarity = "Add the rarity or item type.";
  }

  if (values.location.length < 3) {
    fieldErrors.location = "Add the neighborhood or city buyers will see.";
  }

  if (values.shipping.length < 4) {
    fieldErrors.shipping = "Add how you want to deliver the card.";
  }

  if (values.meetupSpot.length < 4) {
    fieldErrors.meetupSpot = "Add a safe meetup spot or preferred handoff.";
  }

  if (values.description.length < 20) {
    fieldErrors.description = "Add a few details buyers should know before messaging.";
  }

  const parsedPrice = parseInteger(values.price);
  const parsedTradeValue = parseInteger(values.tradeValue);

  if (!parsedPrice && !parsedTradeValue) {
    fieldErrors.price = "Add a price, a trade value, or both.";
  }

  return {
    fieldErrors,
    parsedPrice,
    parsedTradeValue,
  };
}

export async function createListingAction(
  _previousState: CreateListingFormState,
  formData: FormData,
): Promise<CreateListingFormState> {
  const values = getFormValues(formData);
  const { fieldErrors, parsedPrice, parsedTradeValue } = validateValues(values);

  if (Object.keys(fieldErrors).length > 0) {
    return {
      message: "Check the highlighted fields and try again.",
      fieldErrors,
      values,
    };
  }

  const session = await requireSession("/create-listing");
  const finalPrice = parsedPrice ?? parsedTradeValue;
  const finalTradeValue = parsedTradeValue ?? parsedPrice;

  if (!finalPrice || !finalTradeValue) {
    return {
      message: "Add at least one valid price field before publishing.",
      fieldErrors: {
        price: "Add a valid price or trade value.",
      },
      values,
    };
  }

  try {
    const storedListing = await createStoredMarketplaceListing({
      userId: session.user.id,
      title: values.title,
      subtitle:
        values.subtitle ||
        `${values.condition} ${values.franchise} listing ready for offers.`,
      franchise: values.franchise,
      setName: values.setName,
      cardNumber: values.cardNumber,
      price: finalPrice,
      tradeValue: finalTradeValue,
      location: values.location,
      city: values.city,
      condition: values.condition,
      grade: values.grade || undefined,
      rarity: values.rarity,
      shipping: values.shipping,
      meetupSpot: values.meetupSpot,
      description: values.description,
      tags: parseList(values.tags).length
        ? parseList(values.tags)
        : getDefaultTags(values),
      wants: parseList(values.wants).length
        ? parseList(values.wants)
        : getDefaultWants(values),
      dealType: values.dealType,
    });

    revalidatePath("/marketplace");
    revalidatePath(`/listing/${storedListing.slug}`);
    redirect(`/listing/${storedListing.slug}`);
  } catch (error) {
    console.error("Failed to create marketplace listing", error);

    return {
      message: "We couldn't publish the listing yet. Please try again.",
      values,
    };
  }
}
