"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

import Image from "next/image";

import { createListingAction } from "@/app/create-listing/actions";
import {
  cardConditionOptions,
  type CreateListingFormValues,
  getConditionOptionsForCategory,
  getDefaultConditionTypeForCategory,
  getSpecificFieldConfigForCategory,
  initialCreateListingState,
  initialCreateListingValues,
  isListingCategory,
  isListingConditionType,
  isListingDealMethod,
  isProfessionalGrader,
  isSportsCardListingType,
  listingCategoryOptions,
  listingDealMethodOptions,
  listingSpecificFieldDefinitions,
  sportsCardListingTypeOptions,
  type CreateListingFieldDefinition,
  type CreateListingListingTypeOption,
  type ListingCategoryOption,
  type ListingConditionTypeOption,
  type ListingDealMethodOption,
  type ListingSpecificFieldName,
  type SportsCardListingTypeOption,
} from "@/app/create-listing/form-options";

type ConfiguredFieldProps = {
  definition: CreateListingFieldDefinition;
  value: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
};

type MediaPreview = {
  file: File;
  name: string;
  url: string;
};

const createListingDraftStorageKey = "ptc:create-listing-draft";
const createListingDraftStringFieldNames = Object.keys(
  initialCreateListingValues,
).filter(
  (fieldName) =>
    ![
      "mediaFiles",
      "categoryFamily",
      "listingType",
      "conditionType",
      "professionalGrader",
      "dealMethods",
      "city",
    ].includes(fieldName),
) as Array<
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

const fieldClassName =
  "w-full rounded-[16px] border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-950 shadow-[0_1px_2px_rgba(15,23,42,0.04)] outline-none transition duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100";

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="mt-2 text-sm text-rose-600">{message}</p>;
}

function revokeMediaPreviews(previews: MediaPreview[]) {
  previews.forEach((preview) => URL.revokeObjectURL(preview.url));
}

function FormSection({
  title,
  children,
  bordered = true,
  aside,
}: {
  title: string;
  children: React.ReactNode;
  bordered?: boolean;
  aside?: React.ReactNode;
}) {
  return (
    <section className={bordered ? "mt-6 border-t border-slate-200 pt-6" : ""}>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold tracking-tight text-slate-950">
          {title}
        </h2>
        {aside}
      </div>
      {children}
    </section>
  );
}

function ConfiguredField({
  definition,
  value,
  error,
  required,
  disabled,
  rows = 4,
}: ConfiguredFieldProps) {
  const { label, name, placeholder, kind = "input", options } = definition;

  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium tracking-tight text-slate-900">
        {label}
      </label>

      {kind === "textarea" ? (
        <textarea
          id={name}
          name={name}
          rows={rows}
          defaultValue={value}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`${fieldClassName} mt-2 resize-y`}
        />
      ) : kind === "select" ? (
        <select
          id={name}
          name={name}
          defaultValue={value}
          disabled={disabled}
          required={required}
          className={`${fieldClassName} mt-2`}
        >
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          name={name}
          defaultValue={value}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`${fieldClassName} mt-2`}
        />
      )}

      <FieldError message={error} />
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-12 items-center justify-center rounded-full bg-emerald-700 px-6 text-sm font-medium text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-emerald-400"
    >
      {pending ? "Publishing..." : "Publish listing"}
    </button>
  );
}

function SaveDraftButton({
  label,
  onSaveDraft,
}: {
  label: string;
  onSaveDraft: () => void;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="button"
      onClick={onSaveDraft}
      disabled={pending}
      className="inline-flex h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-6 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
    >
      {label}
    </button>
  );
}

function getCreateListingDraftValues(formData: FormData): CreateListingFormValues {
  const stringValues = Object.fromEntries(
    createListingDraftStringFieldNames.map((fieldName) => [
      fieldName,
      String(formData.get(fieldName) ?? "").trim(),
    ]),
  ) as Pick<CreateListingFormValues, (typeof createListingDraftStringFieldNames)[number]>;

  const rawCategoryFamily = String(formData.get("categoryFamily") ?? "").trim();
  const categoryFamily = isListingCategory(rawCategoryFamily)
    ? rawCategoryFamily
    : initialCreateListingValues.categoryFamily;
  const rawListingType = String(formData.get("listingType") ?? "").trim();
  const listingType =
    categoryFamily === "sports-cards" && isSportsCardListingType(rawListingType)
      ? rawListingType
      : "";
  const rawConditionType = String(formData.get("conditionType") ?? "").trim();
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
  const rawDealMethods = Array.from(
    new Set(
      formData
        .getAll("dealMethods")
        .map((value) => String(value).trim())
        .filter(Boolean),
    ),
  );
  const rawProfessionalGrader = String(
    formData.get("professionalGrader") ?? "",
  ).trim();

  return {
    ...stringValues,
    mediaFiles: "",
    categoryFamily,
    listingType,
    conditionType,
    professionalGrader:
      rawProfessionalGrader === "" || isProfessionalGrader(rawProfessionalGrader)
        ? rawProfessionalGrader
        : initialCreateListingValues.professionalGrader,
    dealMethods: rawDealMethods.filter(isListingDealMethod),
    city: initialCreateListingValues.city,
  };
}

function parseStoredCreateListingDraft(rawValue: string | null) {
  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue) as { values?: unknown } | unknown;
    const candidate =
      parsed && typeof parsed === "object" && "values" in parsed
        ? parsed.values
        : parsed;

    if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
      return null;
    }

    const formData = new FormData();

    Object.entries(candidate).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => {
          formData.append(key, String(item));
        });
        return;
      }

      if (typeof value === "string") {
        formData.set(key, value);
      }
    });

    return getCreateListingDraftValues(formData);
  } catch {
    return null;
  }
}

function isCreateListingValuesPristine(values: CreateListingFormValues) {
  return (Object.keys(initialCreateListingValues) as Array<keyof CreateListingFormValues>).every(
    (fieldName) => {
      const initialValue = initialCreateListingValues[fieldName];
      const currentValue = values[fieldName];

      if (Array.isArray(initialValue) && Array.isArray(currentValue)) {
        return initialValue.join("|") === currentValue.join("|");
      }

      return initialValue === currentValue;
    },
  );
}

function applyDraftValuesToForm(
  form: HTMLFormElement,
  values: CreateListingFormValues,
) {
  const assignFieldValue = (fieldName: string, value: string) => {
    const field = form.elements.namedItem(fieldName);

    if (!field || field instanceof RadioNodeList) {
      return;
    }

    if (
      field instanceof HTMLInputElement ||
      field instanceof HTMLTextAreaElement ||
      field instanceof HTMLSelectElement
    ) {
      field.value = value;
    }
  };

  assignFieldValue("title", values.title);
  assignFieldValue("categoryFamily", values.categoryFamily);
  assignFieldValue("listingType", values.listingType);
  assignFieldValue("conditionType", values.conditionType);
  assignFieldValue("professionalGrader", values.professionalGrader);

  createListingDraftStringFieldNames.forEach((fieldName) => {
    assignFieldValue(fieldName, values[fieldName]);
  });

  const dealMethodInputs = form.querySelectorAll<HTMLInputElement>(
    'input[name="dealMethods"]',
  );

  dealMethodInputs.forEach((input) => {
    input.checked = values.dealMethods.includes(
      input.value as ListingDealMethodOption,
    );
  });
}

export function CreateListingForm() {
  const [state, formAction] = useActionState(
    createListingAction,
    initialCreateListingState,
  );
  const [restoredDraftValues] = useState<CreateListingFormValues | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    return parseStoredCreateListingDraft(
      window.localStorage.getItem(createListingDraftStorageKey),
    );
  });
  const formRef = useRef<HTMLFormElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const mediaPreviewsRef = useRef<MediaPreview[]>([]);
  const hasAppliedDraftRestoreRef = useRef(false);
  const draftStatusTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [categoryFamily, setCategoryFamily] = useState<ListingCategoryOption>(
    restoredDraftValues?.categoryFamily ?? state.values.categoryFamily,
  );
  const [listingType, setListingType] = useState<CreateListingListingTypeOption>(
    restoredDraftValues?.listingType ?? state.values.listingType,
  );
  const [conditionType, setConditionType] = useState<ListingConditionTypeOption>(
    restoredDraftValues?.conditionType ?? state.values.conditionType,
  );
  const [dealMethods, setDealMethods] = useState<ListingDealMethodOption[]>(
    restoredDraftValues?.dealMethods ?? state.values.dealMethods,
  );
  const [mediaPreviews, setMediaPreviews] = useState<MediaPreview[]>([]);
  const [isMediaDragging, setIsMediaDragging] = useState(false);
  const [saveDraftLabel, setSaveDraftLabel] = useState("Save draft");

  const isSportsCategory = categoryFamily === "sports-cards";
  const conditionOptions = getConditionOptionsForCategory(
    categoryFamily,
    listingType,
  );
  const specificFieldConfig = getSpecificFieldConfigForCategory(
    categoryFamily,
    listingType,
  );
  const isSingleListing =
    isSportsCategory && listingType === "trading-card-singles";
  const showCardCondition = isSingleListing && conditionType === "ungraded";
  const showGradingFields = isSingleListing && conditionType === "graded";
  const isMeetupSelected = dealMethods.includes("meet-up");
  const isDeliverySelected = dealMethods.includes("mailing-delivery");
  const primaryMediaPreview = mediaPreviews[0];
  const remainingMediaPreviews = mediaPreviews.slice(1, 7);
  const hiddenMediaPreviewCount = Math.max(mediaPreviews.length - 7, 0);

  useEffect(() => {
    mediaPreviewsRef.current = mediaPreviews;
  }, [mediaPreviews]);

  useEffect(() => {
    return () => {
      revokeMediaPreviews(mediaPreviewsRef.current);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (draftStatusTimeoutRef.current) {
        clearTimeout(draftStatusTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (
      hasAppliedDraftRestoreRef.current ||
      !restoredDraftValues ||
      !formRef.current ||
      !isCreateListingValuesPristine(state.values)
    ) {
      return;
    }

    hasAppliedDraftRestoreRef.current = true;

    const frame = window.requestAnimationFrame(() => {
      if (!formRef.current) {
        return;
      }

      applyDraftValuesToForm(formRef.current, restoredDraftValues);
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [restoredDraftValues, state.values]);

  function setTimedSaveDraftLabel(nextLabel: string) {
    setSaveDraftLabel(nextLabel);

    if (draftStatusTimeoutRef.current) {
      clearTimeout(draftStatusTimeoutRef.current);
    }

    draftStatusTimeoutRef.current = setTimeout(() => {
      setSaveDraftLabel("Save draft");
    }, 2400);
  }

  function syncSelectedMedia(files: FileList | File[]) {
    const nextPreviews: MediaPreview[] = Array.from(files).map((file) => ({
      file,
      name: file.name,
      url: URL.createObjectURL(file),
    }));

    setMediaPreviews((currentPreviews) => {
      revokeMediaPreviews(currentPreviews);
      return nextPreviews;
    });
  }

  function syncFileInputWithPreviews(previews: MediaPreview[]) {
    if (!fileInputRef.current) {
      return;
    }

    const transfer = new DataTransfer();

    previews.forEach((preview) => {
      transfer.items.add(preview.file);
    });

    fileInputRef.current.files = transfer.files;
  }

  function handleMediaInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setIsMediaDragging(false);
    syncSelectedMedia(event.target.files ?? []);
  }

  function handleMediaDrop(event: React.DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsMediaDragging(false);

    if (!fileInputRef.current || event.dataTransfer.files.length === 0) {
      return;
    }

    const transfer = new DataTransfer();

    Array.from(event.dataTransfer.files).forEach((file) => {
      transfer.items.add(file);
    });

    fileInputRef.current.files = transfer.files;
    syncSelectedMedia(transfer.files);
  }

  function handleMediaDragLeave(event: React.DragEvent<HTMLLabelElement>) {
    const nextTarget = event.relatedTarget;

    if (nextTarget instanceof Node && event.currentTarget.contains(nextTarget)) {
      return;
    }

    setIsMediaDragging(false);
  }

  function handleRemoveMedia(index: number) {
    const previewToRemove = mediaPreviews[index];

    if (!previewToRemove) {
      return;
    }

    const nextPreviews = mediaPreviews.filter(
      (_, previewIndex) => previewIndex !== index,
    );

    syncFileInputWithPreviews(nextPreviews);
    URL.revokeObjectURL(previewToRemove.url);
    setMediaPreviews(nextPreviews);
  }

  function handleCategoryChange(nextCategoryFamily: ListingCategoryOption) {
    setCategoryFamily(nextCategoryFamily);

    const nextListingType: CreateListingListingTypeOption =
      nextCategoryFamily === "sports-cards"
        ? listingType || initialCreateListingValues.listingType
        : "";

    setListingType(nextListingType);

    const nextConditionOptions = getConditionOptionsForCategory(
      nextCategoryFamily,
      nextListingType,
    );

    if (!nextConditionOptions.some((option) => option.value === conditionType)) {
      setConditionType(
        getDefaultConditionTypeForCategory(nextCategoryFamily, nextListingType),
      );
    }
  }

  function handleListingTypeChange(nextListingType: SportsCardListingTypeOption) {
    setListingType(nextListingType);

    const nextConditionOptions = getConditionOptionsForCategory(
      categoryFamily,
      nextListingType,
    );

    if (!nextConditionOptions.some((option) => option.value === conditionType)) {
      setConditionType(
        getDefaultConditionTypeForCategory(categoryFamily, nextListingType),
      );
    }
  }

  function handleDealMethodToggle(method: ListingDealMethodOption) {
    setDealMethods((currentMethods) =>
      currentMethods.includes(method)
        ? currentMethods.filter((currentMethod) => currentMethod !== method)
        : [...currentMethods, method],
    );
  }

  function handleSaveDraft() {
    if (!formRef.current || typeof window === "undefined") {
      setTimedSaveDraftLabel("Could not save");
      return;
    }

    try {
      const draftValues = getCreateListingDraftValues(new FormData(formRef.current));

      window.localStorage.setItem(
        createListingDraftStorageKey,
        JSON.stringify({
          values: draftValues,
          savedAt: new Date().toISOString(),
        }),
      );

      setTimedSaveDraftLabel("Draft saved");
    } catch {
      setTimedSaveDraftLabel("Could not save");
    }
  }

  const cardConditionDefinition: CreateListingFieldDefinition = {
    name: "cardCondition",
    label: "Card Condition",
    kind: "select",
    options: cardConditionOptions,
  };
  const descriptionDefinition: CreateListingFieldDefinition = {
    name: "description",
    label: "Description",
    kind: "textarea",
    placeholder:
      "What is included, notable flaws, and anything a buyer should know.",
  };

  return (
    <form
      ref={formRef}
      action={formAction}
      className="mx-auto max-w-6xl"
    >
      {state.message ? (
        <div className="mb-5 rounded-[18px] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
          {state.message}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)] xl:grid-cols-[400px_minmax(0,1fr)]">
        <aside className="self-start">
          <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white">
            <div className="px-6 py-6 sm:px-8 sm:py-8">
              <label
                htmlFor="mediaFiles"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
                onDragOver={(event) => {
                  event.preventDefault();
                  setIsMediaDragging(true);
                }}
                onDragLeave={handleMediaDragLeave}
                onDrop={handleMediaDrop}
                className={`block cursor-pointer rounded-[18px] border-2 border-dashed outline-none transition ${
                  isMediaDragging
                    ? "border-emerald-400 bg-emerald-50 shadow-[0_0_0_4px_rgba(220,252,231,0.9)]"
                    : "border-emerald-300 bg-[linear-gradient(180deg,#fcfffd_0%,#f4fbf7_100%)] hover:border-emerald-400 hover:bg-emerald-50/80"
                }`}
              >
                <input
                  ref={fileInputRef}
                  id="mediaFiles"
                  name="mediaFiles"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleMediaInputChange}
                  required
                  className="sr-only"
                />

                <div className="pointer-events-none px-5 py-7 text-center sm:px-6 sm:py-8">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[12px] border border-slate-200 bg-white text-emerald-700">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="h-6 w-6"
                      fill="none"
                    >
                      <path
                        d="M6.75 7.25H15.25C16.3546 7.25 17.25 8.14543 17.25 9.25V15.25C17.25 16.3546 16.3546 17.25 15.25 17.25H6.75C5.64543 17.25 4.75 16.3546 4.75 15.25V9.25C4.75 8.14543 5.64543 7.25 6.75 7.25Z"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M7.75 14.25L10.25 11.75L12 13.5L14.25 11.25L15.25 12.25"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle cx="13.5" cy="10" r="1.1" fill="currentColor" />
                      <path
                        d="M18.25 6.25V10.25"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                      />
                      <path
                        d="M16.25 8.25H20.25"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>

                  <p className="mt-4 text-base font-semibold tracking-tight text-slate-950">
                    Upload photos
                  </p>

                  <span className="mt-4 inline-flex h-10 items-center justify-center rounded-full bg-emerald-700 px-4 text-sm font-medium text-emerald-50 shadow-[0_10px_24px_rgba(4,120,87,0.18)]">
                    Choose files
                  </span>
                </div>
              </label>

              {primaryMediaPreview ? (
                <div className="mt-6">
                  <div className="flex items-center justify-between gap-3 text-sm text-slate-500">
                    <p>First file is the cover</p>
                    <span className="text-sm font-medium text-slate-500">
                      {mediaPreviews.length} selected
                    </span>
                  </div>

                  <div className="mt-4 rounded-[18px] border border-slate-200 bg-white p-3">
                    <div className="flex items-center justify-between gap-3 px-1 pb-3">
                      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Cover
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveMedia(0)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                        aria-label={`Remove ${primaryMediaPreview.name}`}
                      >
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 24 24"
                          className="h-4 w-4"
                          fill="none"
                        >
                          <path
                            d="M9.75 10.25V16.25"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                          />
                          <path
                            d="M14.25 10.25V16.25"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                          />
                          <path
                            d="M5.75 7.75H18.25"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                          />
                          <path
                            d="M8.75 7.75L9.5 5.75H14.5L15.25 7.75"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M7.75 7.75V17.25C7.75 18.0784 8.42157 18.75 9.25 18.75H14.75C15.5784 18.75 16.25 18.0784 16.25 17.25V7.75"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="relative overflow-hidden rounded-[16px] bg-slate-100">
                      <div className="relative aspect-[4/5]">
                        <Image
                          src={primaryMediaPreview.url}
                          alt={primaryMediaPreview.name}
                          fill
                          unoptimized
                          sizes="(min-width: 1280px) 400px, (min-width: 1024px) 360px, 100vw"
                          className="object-cover"
                        />
                      </div>
                    </div>

                    <p
                      className="mt-3 truncate text-sm font-medium text-slate-700"
                      title={primaryMediaPreview.name}
                    >
                      {primaryMediaPreview.name}
                    </p>
                  </div>

                  {remainingMediaPreviews.length > 0 ? (
                    <div className="mt-3 grid grid-cols-3 gap-3">
                      {remainingMediaPreviews.map((preview, index) => (
                        <div
                          key={preview.url}
                          className="rounded-[16px] border border-slate-200 bg-white p-2"
                        >
                          <div className="relative overflow-hidden rounded-[12px] bg-slate-100">
                            <div className="relative aspect-square">
                              <Image
                                src={preview.url}
                                alt={preview.name}
                                fill
                                unoptimized
                                sizes="(min-width: 1280px) 120px, (min-width: 1024px) 110px, 33vw"
                                className="object-cover"
                              />

                              <button
                                type="button"
                                onClick={() => handleRemoveMedia(index + 1)}
                                className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-white shadow-[0_10px_18px_rgba(15,23,42,0.22)] transition hover:bg-slate-800"
                                aria-label={`Remove ${preview.name}`}
                              >
                                <svg
                                  aria-hidden="true"
                                  viewBox="0 0 24 24"
                                  className="h-4 w-4"
                                  fill="none"
                                >
                                  <path
                                    d="M9.75 10.25V16.25"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                    strokeLinecap="round"
                                  />
                                  <path
                                    d="M14.25 10.25V16.25"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                    strokeLinecap="round"
                                  />
                                  <path
                                    d="M5.75 7.75H18.25"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                    strokeLinecap="round"
                                  />
                                  <path
                                    d="M8.75 7.75L9.5 5.75H14.5L15.25 7.75"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M7.75 7.75V17.25C7.75 18.0784 8.42157 18.75 9.25 18.75H14.75C15.5784 18.75 16.25 18.0784 16.25 17.25V7.75"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                      {hiddenMediaPreviewCount > 0 ? (
                        <div className="flex aspect-square items-center justify-center rounded-[16px] border border-dashed border-slate-200 bg-slate-50 p-3 text-center text-sm font-medium text-slate-500">
                          +{hiddenMediaPreviewCount} more
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              ) : null}

              <FieldError message={state.fieldErrors?.mediaFiles} />
            </div>
          </div>
        </aside>

        <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white">
          <div className="px-6 py-6 sm:px-8 sm:py-8">
            <section>
              <div className="grid gap-5">
                <div>
                  <label
                    htmlFor="title"
                    className="text-sm font-medium text-slate-900"
                  >
                    Title
                  </label>
                  <input
                    id="title"
                    name="title"
                    defaultValue={state.values.title}
                    placeholder={
                      isSportsCategory
                        ? "2023 Prizm Victor Wembanyama silver rookie"
                        : "One Piece OP-05 booster box"
                    }
                    className={`${fieldClassName} mt-2`}
                    required
                  />
                  <FieldError message={state.fieldErrors?.title} />
                </div>

                <div>
                  <label
                    htmlFor="categoryFamily"
                    className="text-sm font-medium text-slate-900"
                  >
                    Category
                  </label>
                  <select
                    id="categoryFamily"
                    name="categoryFamily"
                    value={categoryFamily}
                    onChange={(event) =>
                      handleCategoryChange(
                        event.target.value as ListingCategoryOption,
                      )
                    }
                    className={`${fieldClassName} mt-2`}
                  >
                    {listingCategoryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {isSportsCategory ? (
                  <div>
                    <label
                      htmlFor="listingType"
                      className="text-sm font-medium text-slate-900"
                    >
                      Listing type
                    </label>
                    <select
                      id="listingType"
                      name="listingType"
                      value={listingType}
                      onChange={(event) =>
                        handleListingTypeChange(
                          event.target.value as SportsCardListingTypeOption,
                        )
                      }
                      className={`${fieldClassName} mt-2`}
                    >
                      {sportsCardListingTypeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : null}
              </div>
            </section>

          {isSportsCategory ? (
              <FormSection
                title="Details"
              >
                {specificFieldConfig.required.length > 0 ? (
                  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {specificFieldConfig.required.map((fieldName) => (
                      <div
                        key={fieldName}
                        className={
                          fieldName === "sport"
                            ? "sm:col-span-2 xl:col-span-3"
                            : undefined
                        }
                      >
                        <ConfiguredField
                          definition={listingSpecificFieldDefinitions[fieldName]}
                          value={state.values[fieldName]}
                          error={state.fieldErrors?.[fieldName]}
                          required
                        />
                      </div>
                    ))}
                  </div>
                ) : null}

                {specificFieldConfig.optional.length > 0 ? (
                  <details
                    className={`overflow-hidden rounded-[18px] border border-slate-200 bg-slate-50 open:bg-white ${
                      specificFieldConfig.required.length > 0 ? "mt-6" : ""
                    }`}
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 marker:hidden">
                      <span className="text-sm font-semibold text-slate-950">
                        Additional details
                      </span>
                      <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Expand
                      </span>
                    </summary>

                    <div className="border-t border-slate-200 px-5 py-5">
                      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                        {specificFieldConfig.optional.map((fieldName) => (
                          <ConfiguredField
                            key={fieldName}
                            definition={listingSpecificFieldDefinitions[fieldName]}
                            value={state.values[fieldName as ListingSpecificFieldName]}
                            error={state.fieldErrors?.[fieldName]}
                          />
                        ))}
                      </div>
                    </div>
                  </details>
                ) : null}
              </FormSection>
          ) : null}

          <FormSection title="Condition">
            <div className="grid gap-5">
              <div>
                <label
                  htmlFor="conditionType"
                  className="text-sm font-medium text-slate-900"
                >
                  Condition type
                </label>
                <select
                  id="conditionType"
                  name="conditionType"
                  value={conditionType}
                  onChange={(event) =>
                    setConditionType(event.target.value as ListingConditionTypeOption)
                  }
                  className={`${fieldClassName} mt-2`}
                >
                  {conditionOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <FieldError message={state.fieldErrors?.conditionType} />
              </div>

              {showCardCondition ? (
                <div>
                  <ConfiguredField
                    definition={cardConditionDefinition}
                    value={state.values.cardCondition}
                    error={state.fieldErrors?.cardCondition}
                    required={showCardCondition}
                    disabled={!showCardCondition}
                  />
                </div>
              ) : null}

              {showGradingFields ? (
                <>
                  <div>
                    <ConfiguredField
                      definition={listingSpecificFieldDefinitions.professionalGrader}
                      value={state.values.professionalGrader}
                      error={state.fieldErrors?.professionalGrader}
                      required={showGradingFields}
                      disabled={!showGradingFields}
                    />
                  </div>

                  <div>
                    <ConfiguredField
                      definition={listingSpecificFieldDefinitions.grade}
                      value={state.values.grade}
                      error={state.fieldErrors?.grade}
                      required={showGradingFields}
                      disabled={!showGradingFields}
                    />
                  </div>

                  <div>
                    <ConfiguredField
                      definition={listingSpecificFieldDefinitions.certificationNumber}
                      value={state.values.certificationNumber}
                      error={state.fieldErrors?.certificationNumber}
                      required={showGradingFields}
                      disabled={!showGradingFields}
                    />
                  </div>
                </>
              ) : null}
            </div>
          </FormSection>

          <FormSection title="Price & delivery">
            <div className="grid gap-6">
              <div>
                <label
                  htmlFor="price"
                  className="text-sm font-medium text-slate-900"
                >
                  Price
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  min="1"
                  step="1"
                  defaultValue={state.values.price}
                  placeholder="325"
                  className={`${fieldClassName} mt-2`}
                  required
                />
                <FieldError message={state.fieldErrors?.price} />
              </div>

              <div>
                <span className="text-sm font-medium text-slate-900">
                  Deal methods
                </span>
                <div className="mt-2 grid gap-3 sm:grid-cols-2">
                  {listingDealMethodOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`flex w-full items-center gap-3 rounded-[16px] border px-4 py-4 text-sm transition ${
                        dealMethods.includes(option.value)
                          ? "border-emerald-300 bg-white shadow-[0_0_0_4px_rgba(220,252,231,0.85)]"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        name="dealMethods"
                        value={option.value}
                        checked={dealMethods.includes(option.value)}
                        onChange={() => handleDealMethodToggle(option.value)}
                        className="h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-200"
                      />
                      <span className="font-medium text-slate-900">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
                <FieldError message={state.fieldErrors?.dealMethods} />
              </div>

              {isMeetupSelected || isDeliverySelected ? (
                <div className="grid gap-5">
                  {isMeetupSelected ? (
                    <div>
                      <label
                        htmlFor="meetupLocation"
                        className="text-sm font-medium text-slate-900"
                      >
                        Meet-up location
                      </label>
                      <input
                        id="meetupLocation"
                        name="meetupLocation"
                        defaultValue={state.values.meetupLocation}
                        placeholder="Shops at Skyview card tables"
                        required={isMeetupSelected}
                        className={`${fieldClassName} mt-2`}
                      />
                      <FieldError message={state.fieldErrors?.meetupLocation} />
                    </div>
                  ) : null}

                  {isDeliverySelected ? (
                    <div>
                      <label
                        htmlFor="deliveryDetails"
                        className="text-sm font-medium text-slate-900"
                      >
                        Delivery notes
                      </label>
                      <textarea
                        id="deliveryDetails"
                        name="deliveryDetails"
                        rows={3}
                        defaultValue={state.values.deliveryDetails}
                        placeholder="Tracked shipping, signature confirmation, local delivery window"
                        className={`${fieldClassName} mt-2 resize-y`}
                      />
                      <FieldError message={state.fieldErrors?.deliveryDetails} />
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          </FormSection>

          <section className="mt-6 border-t border-slate-200 pt-6">
            <ConfiguredField
              definition={descriptionDefinition}
              value={state.values.description}
              error={state.fieldErrors?.description}
              required
              rows={6}
            />
          </section>

          <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-6">
            <SaveDraftButton
              label={saveDraftLabel}
              onSaveDraft={handleSaveDraft}
            />
            <SubmitButton />
          </div>
        </div>
      </div>
      </div>
    </form>
  );
}
