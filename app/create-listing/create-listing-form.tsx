"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

import Image from "next/image";

import { createListingAction } from "@/app/create-listing/actions";
import { getSameCityFilter } from "@/app/lib/marketplace-data";
import { MAX_LISTING_MEDIA_FILES } from "@/lib/listing-media-constants";
import {
  cardConditionOptions,
  type CreateListingCityOption,
  type CreateListingFormValues,
  getConditionOptionsForCategory,
  getDefaultConditionTypeForCategory,
  getDefaultListingTypeForCategory,
  getListingTypeOptionsForCategory,
  getSpecificFieldConfigForCategory,
  initialCreateListingState,
  initialCreateListingValues,
  isCollectibleCardGameListingType,
  isListingCategory,
  isListingCity,
  isListingConditionType,
  isListingDealMethod,
  isSingleCardListingType,
  isProfessionalGrader,
  isSportsCardListingType,
  listingCategoryOptions,
  listingCityOptions,
  listingDealMethodOptions,
  listingSpecificFieldDefinitions,
  type CreateListingFieldDefinition,
  type CreateListingListingTypeOption,
  type ListingCategoryOption,
  type ListingConditionTypeOption,
  type ListingDealMethodOption,
  type ListingCityOption,
  type ListingSpecificFieldName,
  type ListingTypeOption,
} from "@/app/create-listing/form-options";

type ConfiguredFieldProps = {
  definition: CreateListingFieldDefinition;
  value: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  selectValue?: string;
  onSelectChange?: (nextValue: string) => void;
  onValueChange?: () => void;
};

type MediaPreview = {
  file: File;
  name: string;
  url: string;
};

type LocationAssistState =
  | {
      tone: "neutral" | "error";
      message: string;
    }
  | null;

type DropdownOption = {
  value: string;
  label: string;
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
const dropdownTriggerClassName =
  "w-full rounded-[16px] border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-950 shadow-[0_1px_2px_rgba(15,23,42,0.04)] outline-none transition duration-200 hover:border-slate-300 focus:border-slate-300 focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-100";

function getConfiguredSelectFieldValues(
  values: CreateListingFormValues,
): Record<string, string> {
  return {
    cardCondition: values.cardCondition,
    ...Object.fromEntries(
      Object.values(listingSpecificFieldDefinitions)
        .filter(
          (definition) => "kind" in definition && definition.kind === "select",
        )
        .map((definition) => [
          definition.name,
          String(
            values[definition.name as keyof CreateListingFormValues] ?? "",
          ),
        ]),
    ),
  };
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="mt-2 text-sm text-rose-600">{message}</p>;
}

function RequiredIndicator({ show = false }: { show?: boolean }) {
  if (!show) {
    return null;
  }

  return (
    <>
      <span aria-hidden="true" className="ml-1 text-rose-500">
        *
      </span>
      <span className="sr-only"> required</span>
    </>
  );
}

function revokeMediaPreviews(previews: MediaPreview[]) {
  previews.forEach((preview) => URL.revokeObjectURL(preview.url));
}

function getListingCityOptionLabel(value: CreateListingCityOption) {
  if (!value) {
    return "";
  }

  return (
    listingCityOptions.find((option) => option.value === value)?.label ?? ""
  );
}

function getMatchingListingCityOption(query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return undefined;
  }

  return listingCityOptions.find((option) => {
    const normalizedLabel = option.label.toLowerCase();
    const normalizedCityName = normalizedLabel.split(",")[0]?.trim() ?? "";
    const normalizedSlug = option.value.replaceAll("-", " ").toLowerCase();

    return (
      normalizedLabel === normalizedQuery ||
      normalizedCityName === normalizedQuery ||
      normalizedSlug === normalizedQuery
    );
  });
}

function getCreateListingFieldLabel(fieldName: keyof CreateListingFormValues) {
  if (fieldName in listingSpecificFieldDefinitions) {
    return listingSpecificFieldDefinitions[fieldName as ListingSpecificFieldName]
      .label;
  }

  const labels: Partial<Record<keyof CreateListingFormValues, string>> = {
    mediaFiles: "Photos",
    categoryFamily: "Category",
    listingType: "Listing type",
    title: "Title",
    conditionType: "Condition type",
    cardCondition: "Card condition",
    professionalGrader: "Professional grader",
    grade: "Grade",
    certificationNumber: "Certification number",
    description: "Description",
    price: "Price",
    dealMethods: "Deal methods",
    city: "Location",
    meetupLocation: "Meet-up location",
    deliveryDetails: "Delivery notes",
  };

  return labels[fieldName] ?? fieldName;
}

function FormDropdown({
  id,
  name,
  value,
  options,
  onChange,
  disabled,
}: {
  id: string;
  name: string;
  value: string;
  options: ReadonlyArray<DropdownOption>;
  onChange: (nextValue: string) => void;
  disabled?: boolean;
}) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption =
    options.find((option) => option.value === value) ?? options[0];
  const hasSelection = Boolean(selectedOption?.value);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (
        rootRef.current &&
        event.target instanceof Node &&
        !rootRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  return (
    <div ref={rootRef} className="relative">
      <input type="hidden" name={name} value={value} />

      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((currentOpen) => !currentOpen)}
        className={`${dropdownTriggerClassName} mt-2 flex items-center justify-between gap-3 text-left ${
          isOpen ? "border-slate-300 ring-4 ring-slate-100" : ""
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span
          className={`truncate ${
            hasSelection ? "text-slate-950" : "text-slate-400"
          }`}
        >
          {selectedOption?.label ?? "Select an option"}
        </span>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className={`h-4 w-4 shrink-0 text-slate-400 transition duration-200 ${
            isOpen ? "rotate-180 text-slate-500" : ""
          }`}
          fill="none"
        >
          <path
            d="M5.5 7.75L10 12.25L14.5 7.75"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen ? (
        <div className="absolute left-0 right-0 z-30 mt-2 overflow-hidden rounded-[20px] border border-slate-200/90 bg-white/95 p-2 shadow-[0_24px_48px_rgba(15,23,42,0.16)] backdrop-blur-sm">
          <div className="max-h-72 overflow-y-auto" role="listbox" aria-labelledby={id}>
            {options.map((option) => {
              const isSelected = option.value === value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-3 rounded-[14px] px-3.5 py-3 text-left text-sm transition ${
                    isSelected
                      ? "bg-slate-50 text-slate-950 shadow-[inset_0_0_0_1px_rgba(148,163,184,0.18)]"
                      : "text-slate-700 hover:bg-slate-50 hover:text-slate-950"
                  }`}
                  role="option"
                  aria-selected={isSelected}
                >
                  <span>{option.label}</span>
                  {isSelected ? (
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 20 20"
                      className="h-4 w-4 shrink-0 text-slate-700"
                      fill="none"
                    >
                      <path
                        d="M5.75 10.25L8.5 13L14.25 7.25"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function FormCityAutocomplete({
  id,
  name,
  value,
  query,
  onChange,
  onQueryChange,
  disabled,
}: {
  id: string;
  name: string;
  value: CreateListingCityOption;
  query: string;
  onChange: (nextValue: CreateListingCityOption) => void;
  onQueryChange: (nextQuery: string) => void;
  disabled?: boolean;
}) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const normalizedQuery = query.trim().toLowerCase();
  const filteredOptions = listingCityOptions
    .filter((option) => {
      if (!normalizedQuery) {
        return true;
      }

      const normalizedLabel = option.label.toLowerCase();
      const normalizedSlug = option.value.replaceAll("-", " ").toLowerCase();

      return (
        normalizedLabel.includes(normalizedQuery) ||
        normalizedSlug.includes(normalizedQuery)
      );
    })
    .sort((left, right) => {
      if (!normalizedQuery) {
        return 0;
      }

      const leftLabel = left.label.toLowerCase();
      const rightLabel = right.label.toLowerCase();
      const leftStartsWith = leftLabel.startsWith(normalizedQuery);
      const rightStartsWith = rightLabel.startsWith(normalizedQuery);

      if (leftStartsWith !== rightStartsWith) {
        return leftStartsWith ? -1 : 1;
      }

      return left.label.localeCompare(right.label);
    })
    .slice(0, normalizedQuery ? 10 : 12);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (
        rootRef.current &&
        event.target instanceof Node &&
        !rootRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  return (
    <div ref={rootRef} className="relative mt-2">
      <input type="hidden" name={name} value={value} />

      <input
        id={id}
        type="text"
        value={query}
        disabled={disabled}
        autoComplete="off"
        placeholder="Search a U.S. city"
        className={fieldClassName}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={isOpen}
        aria-controls={`${id}-listbox`}
        onFocus={() => setIsOpen(true)}
        onChange={(event) => {
          onQueryChange(event.target.value);
          setIsOpen(true);
        }}
      />

      {isOpen ? (
        <div className="absolute left-0 right-0 z-30 mt-2 overflow-hidden rounded-[20px] border border-slate-200/90 bg-white/95 p-2 shadow-[0_24px_48px_rgba(15,23,42,0.16)] backdrop-blur-sm">
          <div
            id={`${id}-listbox`}
            role="listbox"
            className="max-h-72 overflow-y-auto"
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const isSelected = option.value === value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onChange(option.value);
                      onQueryChange(option.label);
                      setIsOpen(false);
                    }}
                    className={`flex w-full items-center justify-between gap-3 rounded-[14px] px-3.5 py-3 text-left text-sm transition ${
                      isSelected
                        ? "bg-slate-50 text-slate-950 shadow-[inset_0_0_0_1px_rgba(148,163,184,0.18)]"
                        : "text-slate-700 hover:bg-slate-50 hover:text-slate-950"
                    }`}
                  >
                    <span>{option.label}</span>
                    {isSelected ? (
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 20 20"
                        className="h-4 w-4 shrink-0 text-slate-700"
                        fill="none"
                      >
                        <path
                          d="M5.75 10.25L8.5 13L14.25 7.25"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : null}
                  </button>
                );
              })
            ) : (
              <p className="px-3.5 py-3 text-sm text-slate-500">
                No U.S. city matches that search.
              </p>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
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
  selectValue,
  onSelectChange,
  onValueChange,
}: ConfiguredFieldProps) {
  const { label, name, placeholder, kind = "input", options } = definition;

  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium tracking-tight text-slate-900">
        {label}
        <RequiredIndicator show={required} />
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
          onChange={onValueChange}
          className={`${fieldClassName} mt-2 resize-y`}
        />
      ) : kind === "select" ? (
        <FormDropdown
          id={name}
          name={name}
          value={selectValue ?? value}
          onChange={(nextValue) => {
            onSelectChange?.(nextValue);
            onValueChange?.();
          }}
          options={options ?? []}
          disabled={disabled}
        />
      ) : (
        <input
          id={name}
          name={name}
          defaultValue={value}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          onChange={onValueChange}
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
  const supportedListingTypeOptions = getListingTypeOptionsForCategory(categoryFamily);
  const listingType =
    (categoryFamily === "sports-cards" && isSportsCardListingType(rawListingType)) ||
    (categoryFamily === "collectible-card-game" &&
      isCollectibleCardGameListingType(rawListingType))
      ? rawListingType
      : supportedListingTypeOptions[0]?.value ?? "";
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
  const rawCity = String(formData.get("city") ?? "").trim();

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
    city: isListingCity(rawCity) ? rawCity : initialCreateListingValues.city,
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
  assignFieldValue("city", values.city);

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
  const [city, setCity] = useState<CreateListingCityOption>(
    restoredDraftValues?.city ?? state.values.city,
  );
  const [cityQuery, setCityQuery] = useState(() =>
    getListingCityOptionLabel(restoredDraftValues?.city ?? state.values.city),
  );
  const [dealMethods, setDealMethods] = useState<ListingDealMethodOption[]>(
    restoredDraftValues?.dealMethods ?? state.values.dealMethods,
  );
  const [configuredSelectValues, setConfiguredSelectValues] = useState<
    Record<string, string>
  >(() => getConfiguredSelectFieldValues(restoredDraftValues ?? state.values));
  const [mediaPreviews, setMediaPreviews] = useState<MediaPreview[]>([]);
  const [isMediaDragging, setIsMediaDragging] = useState(false);
  const [draggedCoverIndex, setDraggedCoverIndex] = useState<number | null>(null);
  const [isCoverDropTargetActive, setIsCoverDropTargetActive] = useState(false);
  const [isDetectingCity, setIsDetectingCity] = useState(false);
  const [locationAssistState, setLocationAssistState] =
    useState<LocationAssistState>(null);
  const [saveDraftLabel, setSaveDraftLabel] = useState("Save draft");
  const [clearedFieldErrors, setClearedFieldErrors] = useState<{
    key: string;
    fieldNames: Set<keyof CreateListingFormValues>;
  }>(() => ({
    key: "",
    fieldNames: new Set(),
  }));

  const isSportsCategory = categoryFamily === "sports-cards";
  const listingTypeOptions = getListingTypeOptionsForCategory(categoryFamily);
  const conditionOptions = getConditionOptionsForCategory(
    categoryFamily,
    listingType,
  );
  const specificFieldConfig = getSpecificFieldConfigForCategory(
    categoryFamily,
    listingType,
  );
  const isSingleListing = !!listingType && isSingleCardListingType(listingType);
  const showCardCondition = isSingleListing && conditionType === "ungraded";
  const showGradingFields = isSingleListing && conditionType === "graded";
  const isMeetupSelected = dealMethods.includes("meet-up");
  const isDeliverySelected = dealMethods.includes("mailing-delivery");
  const primaryMediaPreview = mediaPreviews[0];
  const remainingMediaPreviews = mediaPreviews.slice(1, MAX_LISTING_MEDIA_FILES);
  const hiddenMediaPreviewCount = Math.max(
    mediaPreviews.length - MAX_LISTING_MEDIA_FILES,
    0,
  );
  const titlePlaceholder = isSportsCategory
    ? "2023 Prizm Victor Wembanyama silver rookie"
    : listingType === "ccg-individual-cards"
      ? "Charizard ex 199/165 illustration rare"
      : "One Piece OP-05 booster box";
  const fieldErrorsKey = JSON.stringify(state.fieldErrors ?? {});

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
    const nextPreviews: MediaPreview[] = Array.from(files)
      .slice(0, MAX_LISTING_MEDIA_FILES)
      .map((file) => ({
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

  function syncFileInputWithFiles(files: File[]) {
    if (!fileInputRef.current) {
      return;
    }

    const transfer = new DataTransfer();

    files.forEach((file) => {
      transfer.items.add(file);
    });

    fileInputRef.current.files = transfer.files;
  }

  function handleMediaInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setIsMediaDragging(false);
    clearFieldError("mediaFiles");
    const files = Array.from(event.target.files ?? []).slice(
      0,
      MAX_LISTING_MEDIA_FILES,
    );

    syncFileInputWithFiles(files);
    syncSelectedMedia(files);
  }

  function handleMediaDrop(event: React.DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsMediaDragging(false);

    if (!fileInputRef.current || event.dataTransfer.files.length === 0) {
      return;
    }

    const transfer = new DataTransfer();

    Array.from(event.dataTransfer.files)
      .slice(0, MAX_LISTING_MEDIA_FILES)
      .forEach((file) => {
        transfer.items.add(file);
      });

    fileInputRef.current.files = transfer.files;
    clearFieldError("mediaFiles");
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

  function handleSetCoverMedia(index: number) {
    const selectedPreview = mediaPreviews[index];

    if (!selectedPreview || index === 0) {
      return;
    }

    const nextPreviews = [
      selectedPreview,
      ...mediaPreviews.filter((_, previewIndex) => previewIndex !== index),
    ];

    syncFileInputWithPreviews(nextPreviews);
    setMediaPreviews(nextPreviews);
  }

  function handleCoverDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsCoverDropTargetActive(false);

    if (draggedCoverIndex === null) {
      return;
    }

    handleSetCoverMedia(draggedCoverIndex);
    setDraggedCoverIndex(null);
  }

  function handleCategoryChange(nextCategoryFamily: ListingCategoryOption) {
    setCategoryFamily(nextCategoryFamily);

    const nextListingTypeOptions = getListingTypeOptionsForCategory(
      nextCategoryFamily,
    );
    const nextListingType =
      nextListingTypeOptions.find((option) => option.value === listingType)?.value ??
      getDefaultListingTypeForCategory(nextCategoryFamily);

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

  function handleListingTypeChange(nextListingType: ListingTypeOption) {
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

  function handleConfiguredSelectChange(fieldName: string, nextValue: string) {
    setConfiguredSelectValues((currentValues) => ({
      ...currentValues,
      [fieldName]: nextValue,
    }));
  }

  function clearFieldError(fieldName: keyof CreateListingFormValues) {
    setClearedFieldErrors((currentFieldErrors) => {
      const currentFieldNames =
        currentFieldErrors.key === fieldErrorsKey
          ? currentFieldErrors.fieldNames
          : new Set<keyof CreateListingFormValues>();

      if (currentFieldNames.has(fieldName)) {
        return currentFieldErrors;
      }

      const nextFieldNames = new Set(currentFieldNames);
      nextFieldNames.add(fieldName);

      return {
        key: fieldErrorsKey,
        fieldNames: nextFieldNames,
      };
    });
  }

  function getFieldError(fieldName: keyof CreateListingFormValues) {
    return clearedFieldErrors.key === fieldErrorsKey &&
      clearedFieldErrors.fieldNames.has(fieldName)
      ? undefined
      : state.fieldErrors?.[fieldName];
  }

  function handleCityChange(nextCity: CreateListingCityOption) {
    setCity(nextCity);
    setCityQuery(getListingCityOptionLabel(nextCity));
    setLocationAssistState(null);
    clearFieldError("city");
  }

  function handleCityQueryChange(nextQuery: string) {
    setCityQuery(nextQuery);
    setLocationAssistState(null);

    const matchedCity = getMatchingListingCityOption(nextQuery);

    setCity(matchedCity?.value ?? "");
    clearFieldError("city");
  }

  function handleUseCurrentCity() {
    if (!("geolocation" in navigator)) {
      setLocationAssistState({
        tone: "error",
        message: "Current city detection is unavailable in this browser.",
      });
      return;
    }

    setIsDetectingCity(true);
    setLocationAssistState(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsDetectingCity(false);

        const matchedCity = getSameCityFilter(
          position.coords.latitude,
          position.coords.longitude,
        );

        if (!matchedCity || matchedCity.slug === "all") {
          setLocationAssistState({
            tone: "error",
            message:
              "We couldn't match your current location to a supported U.S. city yet.",
          });
          return;
        }

        setCity(matchedCity.slug as ListingCityOption);
        setCityQuery(matchedCity.label);
        clearFieldError("city");
        setLocationAssistState({
          tone: "neutral",
          message: `Using ${matchedCity.label}.`,
        });
      },
      (error) => {
        setIsDetectingCity(false);

        setLocationAssistState({
          tone: "error",
          message:
            error.code === error.PERMISSION_DENIED
              ? "Location access was blocked. You can still choose a city manually."
              : "We couldn't detect your current city. Please choose one manually.",
        });
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      },
    );
  }

  function handleDealMethodToggle(method: ListingDealMethodOption) {
    setDealMethods((currentMethods) =>
      currentMethods.includes(method)
        ? currentMethods.filter((currentMethod) => currentMethod !== method)
        : [...currentMethods, method],
    );
    clearFieldError("dealMethods");
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
  const errorSummaryEntries = Object.entries(state.fieldErrors ?? {}).filter(
    (entry): entry is [keyof CreateListingFormValues, string] =>
      Boolean(entry[1]) &&
      !(
        clearedFieldErrors.key === fieldErrorsKey &&
        clearedFieldErrors.fieldNames.has(
          entry[0] as keyof CreateListingFormValues,
        )
      ),
  );

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={() =>
        setClearedFieldErrors({
          key: "",
          fieldNames: new Set(),
        })
      }
      className="mx-auto max-w-6xl"
    >
      {state.message ? (
        <div className="mb-5 rounded-[18px] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
          <p className="font-medium">{state.message}</p>
          {errorSummaryEntries.length > 0 ? (
            <ul className="mt-3 space-y-1">
              {errorSummaryEntries.map(([fieldName, message]) => (
                <li key={fieldName}>
                  <span className="font-medium">
                    {getCreateListingFieldLabel(fieldName)}:
                  </span>{" "}
                  {message}
                </li>
              ))}
            </ul>
          ) : null}
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
                    <RequiredIndicator show />
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    Up to {MAX_LISTING_MEDIA_FILES} images
                  </p>

                  <span className="mt-4 inline-flex h-10 items-center justify-center rounded-full bg-emerald-700 px-4 text-sm font-medium text-emerald-50 shadow-[0_10px_24px_rgba(4,120,87,0.18)]">
                    Choose files
                  </span>
                </div>
              </label>

              {primaryMediaPreview ? (
                <div className="mt-6">
                  <div className="flex items-center justify-end gap-3 text-sm text-slate-500">
                    <span className="text-sm font-medium text-slate-500">
                      {mediaPreviews.length} selected
                    </span>
                  </div>

                  <div
                    className={`mt-4 rounded-[18px] border bg-white p-3 transition ${
                      isCoverDropTargetActive
                        ? "border-emerald-300 shadow-[0_0_0_4px_rgba(220,252,231,0.85)]"
                        : "border-slate-200"
                    }`}
                    onDragOver={(event) => {
                      if (draggedCoverIndex !== null) {
                        event.preventDefault();
                        setIsCoverDropTargetActive(true);
                      }
                    }}
                    onDragLeave={(event) => {
                      const nextTarget = event.relatedTarget;

                      if (
                        nextTarget instanceof Node &&
                        event.currentTarget.contains(nextTarget)
                      ) {
                        return;
                      }

                      setIsCoverDropTargetActive(false);
                    }}
                    onDrop={handleCoverDrop}
                  >
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
                        {isCoverDropTargetActive ? (
                          <div className="absolute inset-0 flex items-center justify-center bg-emerald-950/42 p-4 text-center text-sm font-semibold text-white">
                            Drop to make cover
                          </div>
                        ) : null}
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
                          draggable
                          onDragStart={(event) => {
                            const mediaIndex = index + 1;

                            setDraggedCoverIndex(mediaIndex);
                            event.dataTransfer.effectAllowed = "move";
                            event.dataTransfer.setData(
                              "text/plain",
                              String(mediaIndex),
                            );
                          }}
                          onDragEnd={() => {
                            setDraggedCoverIndex(null);
                            setIsCoverDropTargetActive(false);
                          }}
                          className="relative cursor-grab rounded-[16px] border border-slate-200 bg-white p-2 transition active:cursor-grabbing"
                        >
                          <button
                            type="button"
                            onClick={() => handleRemoveMedia(index + 1)}
                            title="Remove image"
                            className="absolute -right-1.5 -top-1.5 z-10 inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-[0_8px_14px_rgba(15,23,42,0.12)] transition hover:border-slate-300 hover:bg-slate-50"
                            aria-label={`Remove ${preview.name}`}
                          >
                            <svg
                              aria-hidden="true"
                              viewBox="0 0 24 24"
                              className="h-3.5 w-3.5"
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

              <FieldError message={getFieldError("mediaFiles")} />
            </div>
          </div>
        </aside>

        <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white">
          <div className="px-6 py-6 sm:px-8 sm:py-8">
            <section>
              <div className="grid gap-5">
                <div>
                  <label
                    htmlFor="categoryFamily"
                    className="text-sm font-medium text-slate-900"
                  >
                    Category
                    <RequiredIndicator show />
                  </label>
                  <FormDropdown
                    id="categoryFamily"
                    name="categoryFamily"
                    value={categoryFamily}
                    onChange={(nextValue) => {
                      handleCategoryChange(nextValue as ListingCategoryOption);
                      clearFieldError("categoryFamily");
                      clearFieldError("listingType");
                      clearFieldError("conditionType");
                    }}
                    options={listingCategoryOptions}
                  />
                </div>

                <div>
                  <label
                    htmlFor="listingType"
                    className="text-sm font-medium text-slate-900"
                  >
                    Listing type
                    <RequiredIndicator show />
                  </label>
                  <FormDropdown
                    id="listingType"
                    name="listingType"
                    value={listingType}
                    onChange={(nextValue) => {
                      handleListingTypeChange(nextValue as ListingTypeOption);
                      clearFieldError("listingType");
                      clearFieldError("conditionType");
                    }}
                    options={listingTypeOptions}
                  />
                </div>

                <div>
                  <label
                    htmlFor="title"
                    className="text-sm font-medium text-slate-900"
                  >
                    Title
                    <RequiredIndicator show />
                  </label>
                  <input
                    id="title"
                    name="title"
                    defaultValue={state.values.title}
                    placeholder={titlePlaceholder}
                    className={`${fieldClassName} mt-2`}
                    onChange={() => clearFieldError("title")}
                    required
                  />
                  <FieldError message={getFieldError("title")} />
                </div>
              </div>
            </section>

            <FormSection title="Details">
                {specificFieldConfig.required.length > 0 ? (
                  <div className="grid gap-5">
                    {specificFieldConfig.required.map((fieldName) => (
                      <div key={fieldName}>
                        <ConfiguredField
                          definition={listingSpecificFieldDefinitions[fieldName]}
                          value={state.values[fieldName]}
                          selectValue={
                            configuredSelectValues[fieldName] ?? state.values[fieldName]
                          }
                          onSelectChange={(nextValue) =>
                            handleConfiguredSelectChange(fieldName, nextValue)
                          }
                          onValueChange={() => clearFieldError(fieldName)}
                          error={getFieldError(fieldName)}
                          required
                        />
                      </div>
                    ))}
                  </div>
                ) : null}

                {specificFieldConfig.optional.length > 0 ? (
                  <details
                    className={`group overflow-hidden rounded-[18px] border border-slate-200 bg-[linear-gradient(180deg,#fbfcfd_0%,#f8fafc_100%)] open:bg-white ${
                      specificFieldConfig.required.length > 0 ? "mt-6" : ""
                    }`}
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 marker:hidden">
                      <span className="text-sm font-semibold text-slate-950">
                        Additional details
                      </span>

                      <div className="flex shrink-0 items-center">
                        <span className="text-sm font-medium text-slate-500">
                          <span className="group-open:hidden">Show</span>
                          <span className="hidden group-open:inline">Hide</span>
                        </span>
                      </div>
                    </summary>

                    <div className="border-t border-slate-200 px-5 py-5">
                      <div className="grid gap-5 sm:grid-cols-2">
                        {specificFieldConfig.optional.map((fieldName) => (
                          <ConfiguredField
                            key={fieldName}
                            definition={listingSpecificFieldDefinitions[fieldName]}
                            value={state.values[fieldName as ListingSpecificFieldName]}
                            selectValue={
                              configuredSelectValues[fieldName] ??
                              state.values[fieldName as ListingSpecificFieldName]
                            }
                            onSelectChange={(nextValue) =>
                              handleConfiguredSelectChange(fieldName, nextValue)
                            }
                            onValueChange={() => clearFieldError(fieldName)}
                            error={getFieldError(fieldName)}
                          />
                        ))}
                      </div>
                    </div>
                  </details>
                ) : null}
            </FormSection>

          <FormSection title="Condition">
            <div className="grid gap-5">
              <div>
                <label
                  htmlFor="conditionType"
                  className="text-sm font-medium text-slate-900"
                >
                  Condition type
                  <RequiredIndicator show />
                </label>
                <FormDropdown
                  id="conditionType"
                  name="conditionType"
                  value={conditionType}
                  onChange={(nextValue) => {
                    setConditionType(nextValue as ListingConditionTypeOption);
                    clearFieldError("conditionType");
                    clearFieldError("cardCondition");
                    clearFieldError("professionalGrader");
                    clearFieldError("grade");
                    clearFieldError("certificationNumber");
                  }}
                  options={conditionOptions}
                />
                <FieldError message={getFieldError("conditionType")} />
              </div>

              {showCardCondition ? (
                <div>
                  <ConfiguredField
                    definition={cardConditionDefinition}
                    value={state.values.cardCondition}
                    selectValue={
                      configuredSelectValues.cardCondition ?? state.values.cardCondition
                    }
                    onSelectChange={(nextValue) =>
                      handleConfiguredSelectChange("cardCondition", nextValue)
                    }
                    onValueChange={() => clearFieldError("cardCondition")}
                    error={getFieldError("cardCondition")}
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
                      selectValue={
                        configuredSelectValues.professionalGrader ??
                        state.values.professionalGrader
                      }
                      onSelectChange={(nextValue) =>
                        handleConfiguredSelectChange(
                          "professionalGrader",
                          nextValue,
                        )
                      }
                      onValueChange={() => clearFieldError("professionalGrader")}
                      error={getFieldError("professionalGrader")}
                      required={showGradingFields}
                      disabled={!showGradingFields}
                    />
                  </div>

                  <div>
                    <ConfiguredField
                      definition={listingSpecificFieldDefinitions.grade}
                      value={state.values.grade}
                      onValueChange={() => clearFieldError("grade")}
                      error={getFieldError("grade")}
                      required={showGradingFields}
                      disabled={!showGradingFields}
                    />
                  </div>

                  <div>
                    <ConfiguredField
                      definition={listingSpecificFieldDefinitions.certificationNumber}
                      value={state.values.certificationNumber}
                      onValueChange={() =>
                        clearFieldError("certificationNumber")
                      }
                      error={getFieldError("certificationNumber")}
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
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <label
                    htmlFor="city"
                    className="text-sm font-medium text-slate-900"
                  >
                    Location
                    <RequiredIndicator show />
                  </label>
                  <button
                    type="button"
                    onClick={handleUseCurrentCity}
                    disabled={isDetectingCity}
                    className="inline-flex h-9 items-center justify-center rounded-full border border-slate-200 bg-white px-3.5 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isDetectingCity ? "Detecting..." : "Use current city"}
                  </button>
                </div>
                <FormCityAutocomplete
                  id="city"
                  name="city"
                  value={city}
                  query={cityQuery}
                  onChange={handleCityChange}
                  onQueryChange={handleCityQueryChange}
                />
                {locationAssistState ? (
                  <p
                    className={`mt-2 text-sm ${
                      locationAssistState.tone === "error"
                        ? "text-rose-600"
                        : "text-slate-500"
                    }`}
                  >
                    {locationAssistState.message}
                  </p>
                ) : (
                  <p className="mt-2 text-sm text-slate-500">
                    Start typing a U.S. city and choose it from the suggestions.
                  </p>
                )}
                <FieldError message={getFieldError("city")} />
              </div>

              <div>
                <label
                  htmlFor="price"
                  className="text-sm font-medium text-slate-900"
                  >
                    Price
                    <RequiredIndicator show />
                  </label>
                <div className="relative mt-2">
                  <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-sm font-semibold text-slate-400">
                    $
                  </span>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="1"
                    step="1"
                    defaultValue={state.values.price}
                    placeholder="325"
                    className={`${fieldClassName} pl-8`}
                    onChange={() => clearFieldError("price")}
                    required
                  />
                </div>
                <FieldError message={getFieldError("price")} />
              </div>

              <div>
                <span className="text-sm font-medium text-slate-900">
                  Deal methods
                  <RequiredIndicator show />
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
                <FieldError message={getFieldError("dealMethods")} />
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
                        <RequiredIndicator show={isMeetupSelected} />
                      </label>
                      <input
                        id="meetupLocation"
                        name="meetupLocation"
                        defaultValue={state.values.meetupLocation}
                        placeholder="Shops at Skyview card tables"
                        required={isMeetupSelected}
                        onChange={() => clearFieldError("meetupLocation")}
                        className={`${fieldClassName} mt-2`}
                      />
                      <FieldError message={getFieldError("meetupLocation")} />
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
                        onChange={() => clearFieldError("deliveryDetails")}
                        className={`${fieldClassName} mt-2 resize-y`}
                      />
                      <FieldError message={getFieldError("deliveryDetails")} />
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
              onValueChange={() => clearFieldError("description")}
              error={getFieldError("description")}
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
