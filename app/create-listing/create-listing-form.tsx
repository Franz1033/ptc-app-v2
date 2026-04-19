"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { createListingAction } from "@/app/create-listing/actions";
import {
  initialCreateListingState,
  listingBrandOptions,
  listingCityOptions,
  listingConditionOptions,
  listingDealTypeOptions,
} from "@/app/create-listing/form-options";

type CreateListingFormProps = {
  sellerLabel: string;
  sellerEmail: string;
};

const fieldClassName =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100";

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="mt-2 text-sm text-rose-600">{message}</p>;
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

export function CreateListingForm({
  sellerLabel,
  sellerEmail,
}: CreateListingFormProps) {
  const [state, formAction] = useActionState(
    createListingAction,
    initialCreateListingState,
  );

  return (
    <form action={formAction} className="grid gap-8 lg:grid-cols-[1.1fr_0.55fr]">
      <div className="space-y-6">
        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.05)] sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                Card snapshot
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                Core listing details
              </h2>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-[#fbfefb] px-4 py-3 text-sm text-slate-500">
              Placeholder artwork is assigned automatically by brand for now.
            </div>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="title" className="text-sm font-medium text-slate-900">
                Title
              </label>
              <input
                id="title"
                name="title"
                defaultValue={state.values.title}
                placeholder="Van Gogh Pikachu sealed pair"
                className={`${fieldClassName} mt-2`}
              />
              <FieldError message={state.fieldErrors?.title} />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="subtitle"
                className="text-sm font-medium text-slate-900"
              >
                Subtitle
              </label>
              <input
                id="subtitle"
                name="subtitle"
                defaultValue={state.values.subtitle}
                placeholder="Two sealed promos ready for a quick meetup."
                className={`${fieldClassName} mt-2`}
              />
            </div>

            <div>
              <label
                htmlFor="franchise"
                className="text-sm font-medium text-slate-900"
              >
                Brand
              </label>
              <select
                id="franchise"
                name="franchise"
                defaultValue={state.values.franchise}
                className={`${fieldClassName} mt-2`}
              >
                {listingBrandOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="setName" className="text-sm font-medium text-slate-900">
                Set or product
              </label>
              <input
                id="setName"
                name="setName"
                defaultValue={state.values.setName}
                placeholder="Van Gogh Museum Promo"
                className={`${fieldClassName} mt-2`}
              />
              <FieldError message={state.fieldErrors?.setName} />
            </div>

            <div>
              <label
                htmlFor="cardNumber"
                className="text-sm font-medium text-slate-900"
              >
                Card number
              </label>
              <input
                id="cardNumber"
                name="cardNumber"
                defaultValue={state.values.cardNumber}
                placeholder="085"
                className={`${fieldClassName} mt-2`}
              />
              <FieldError message={state.fieldErrors?.cardNumber} />
            </div>

            <div>
              <label
                htmlFor="rarity"
                className="text-sm font-medium text-slate-900"
              >
                Rarity or item type
              </label>
              <input
                id="rarity"
                name="rarity"
                defaultValue={state.values.rarity}
                placeholder="Promo"
                className={`${fieldClassName} mt-2`}
              />
              <FieldError message={state.fieldErrors?.rarity} />
            </div>

            <div>
              <label
                htmlFor="condition"
                className="text-sm font-medium text-slate-900"
              >
                Condition
              </label>
              <select
                id="condition"
                name="condition"
                defaultValue={state.values.condition}
                className={`${fieldClassName} mt-2`}
              >
                {listingConditionOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="grade" className="text-sm font-medium text-slate-900">
                Grade
              </label>
              <input
                id="grade"
                name="grade"
                defaultValue={state.values.grade}
                placeholder="Optional, e.g. PSA 10"
                className={`${fieldClassName} mt-2`}
              />
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.05)] sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Deal setup
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
            Price, location, and handoff
          </h2>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="price" className="text-sm font-medium text-slate-900">
                Price
              </label>
              <input
                id="price"
                name="price"
                type="number"
                min="1"
                step="1"
                defaultValue={state.values.price}
                placeholder="165"
                className={`${fieldClassName} mt-2`}
              />
              <FieldError message={state.fieldErrors?.price} />
            </div>

            <div>
              <label
                htmlFor="tradeValue"
                className="text-sm font-medium text-slate-900"
              >
                Trade value
              </label>
              <input
                id="tradeValue"
                name="tradeValue"
                type="number"
                min="1"
                step="1"
                defaultValue={state.values.tradeValue}
                placeholder="190"
                className={`${fieldClassName} mt-2`}
              />
            </div>

            <div className="sm:col-span-2">
              <span className="text-sm font-medium text-slate-900">
                Deal type
              </span>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {listingDealTypeOptions.map((option) => (
                  <label
                    key={option.value}
                    className="flex cursor-pointer flex-col rounded-[22px] border border-slate-200 bg-[#fbfefb] p-4 transition hover:border-emerald-200 hover:bg-white"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="dealType"
                        value={option.value}
                        defaultChecked={state.values.dealType === option.value}
                        className="h-4 w-4 border-slate-300 text-emerald-700 focus:ring-emerald-200"
                      />
                      <span className="text-sm font-semibold text-slate-950">
                        {option.label}
                      </span>
                    </div>
                    <span className="mt-3 text-sm leading-6 text-slate-500">
                      {option.description}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="location"
                className="text-sm font-medium text-slate-900"
              >
                Location label
              </label>
              <input
                id="location"
                name="location"
                defaultValue={state.values.location}
                placeholder="Queens, NY"
                className={`${fieldClassName} mt-2`}
              />
              <FieldError message={state.fieldErrors?.location} />
            </div>

            <div>
              <label htmlFor="city" className="text-sm font-medium text-slate-900">
                City filter
              </label>
              <select
                id="city"
                name="city"
                defaultValue={state.values.city}
                className={`${fieldClassName} mt-2`}
              >
                {listingCityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="shipping"
                className="text-sm font-medium text-slate-900"
              >
                Delivery
              </label>
              <input
                id="shipping"
                name="shipping"
                defaultValue={state.values.shipping}
                placeholder="Meetup or tracked shipping"
                className={`${fieldClassName} mt-2`}
              />
              <FieldError message={state.fieldErrors?.shipping} />
            </div>

            <div>
              <label
                htmlFor="meetupSpot"
                className="text-sm font-medium text-slate-900"
              >
                Meetup spot
              </label>
              <input
                id="meetupSpot"
                name="meetupSpot"
                defaultValue={state.values.meetupSpot}
                placeholder="Shops at Skyview card tables"
                className={`${fieldClassName} mt-2`}
              />
              <FieldError message={state.fieldErrors?.meetupSpot} />
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.05)] sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Listing notes
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
            The details buyers ask about
          </h2>

          <div className="mt-8 space-y-6">
            <div>
              <label
                htmlFor="description"
                className="text-sm font-medium text-slate-900"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={5}
                defaultValue={state.values.description}
                placeholder="Share condition notes, what is included, and what a buyer should know before messaging."
                className={`${fieldClassName} mt-2 resize-y`}
              />
              <FieldError message={state.fieldErrors?.description} />
            </div>

            <div>
              <label htmlFor="tags" className="text-sm font-medium text-slate-900">
                Quick tags
              </label>
              <textarea
                id="tags"
                name="tags"
                rows={3}
                defaultValue={state.values.tags}
                placeholder="Fixed price, Trade friendly, Meet tonight"
                className={`${fieldClassName} mt-2 resize-y`}
              />
              <p className="mt-2 text-sm text-slate-500">
                Separate tags with commas or new lines.
              </p>
            </div>

            <div>
              <label htmlFor="wants" className="text-sm font-medium text-slate-900">
                Trade targets
              </label>
              <textarea
                id="wants"
                name="wants"
                rows={3}
                defaultValue={state.values.wants}
                placeholder="151 illustration rares, Japanese promos, cash plus slabs"
                className={`${fieldClassName} mt-2 resize-y`}
              />
              <p className="mt-2 text-sm text-slate-500">
                Leave this blank if you only want cash offers.
              </p>
            </div>
          </div>
        </section>
      </div>

      <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Publishing
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
            Ready to go live
          </h2>
          <div className="mt-6 space-y-4 text-sm leading-7 text-slate-500">
            <p>
              Your listing will publish under <span className="font-medium text-slate-950">{sellerLabel}</span>.
            </p>
            <p>Signed in as {sellerEmail}.</p>
            <p>
              Price and trade value can both be shown, and we will route the new
              listing straight into the marketplace feed after publish.
            </p>
          </div>
        </section>

        <section className="rounded-[28px] border border-emerald-200 bg-emerald-50 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Before you publish
          </p>
          <div className="mt-5 space-y-3 text-sm leading-7 text-emerald-900">
            <p>Use the exact set name buyers search for.</p>
            <p>Add a meetup spot that feels safe and specific.</p>
            <p>Write tags and trade targets like quick conversation starters.</p>
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
          {state.message ? (
            <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {state.message}
            </p>
          ) : (
            <p className="text-sm leading-7 text-slate-500">
              Once published, your listing gets its own detail page and appears in
              the live marketplace feed.
            </p>
          )}

          <div className="mt-5">
            <SubmitButton />
          </div>
        </section>
      </aside>
    </form>
  );
}
