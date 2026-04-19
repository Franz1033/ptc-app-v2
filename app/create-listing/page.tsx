import type { Metadata } from "next";

import { CreateListingForm } from "@/app/create-listing/create-listing-form";
import { SectionHeading } from "@/app/components/marketplace/section-heading";
import { SiteHeader } from "@/app/components/marketplace/site-header";
import { requireSession } from "@/lib/auth-session";

export const metadata: Metadata = {
  title: "Create Listing",
};

export default async function CreateListingPage() {
  const session = await requireSession("/create-listing");
  const sellerLabel =
    session.user.name || session.user.email.split("@")[0] || "PTC seller";

  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-[#fbfefb]">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
            <SectionHeading
              eyebrow="Create listing"
              title="Publish a real marketplace listing"
              description={`Post under ${sellerLabel} and turn this page into a live listing with a dedicated detail page.`}
            />
          </div>
        </section>

        <section className="bg-[#fbfefb]">
          <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
            <CreateListingForm
              sellerLabel={sellerLabel}
              sellerEmail={session.user.email}
            />
          </div>
        </section>
      </main>
    </>
  );
}
