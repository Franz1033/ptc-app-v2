import type { Metadata } from "next";

import { CreateListingForm } from "@/app/create-listing/create-listing-form";
import { SiteHeader } from "@/app/components/marketplace/site-header";
import { requireSession } from "@/lib/auth-session";

export const metadata: Metadata = {
  title: "Create Listing",
};

export default async function CreateListingPage() {
  await requireSession("/create-listing");

  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-[linear-gradient(180deg,#ffffff_0%,#f4f9f1_100%)]">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-9">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
              Create a listing
            </h1>
          </div>
        </section>

        <section>
          <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
            <CreateListingForm />
          </div>
        </section>
      </main>
    </>
  );
}
