import Link from "next/link";

import { SiteHeader } from "@/app/components/marketplace/site-header";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 py-12 text-center sm:px-6">
        <div className="w-full rounded-[24px] border border-slate-200 bg-white p-8 shadow-[0_8px_24px_rgba(15,23,42,0.05)] sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Listing unavailable
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            That card is no longer active.
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-500">
            The listing may have been sold, marked pending, or removed after a
            direct deal.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/marketplace"
              className="rounded-full bg-emerald-700 px-5 py-3 font-medium text-white transition hover:bg-emerald-800"
            >
              Return to marketplace
            </Link>
            <Link
              href="/marketplace#inventory"
              className="rounded-full border border-slate-200 px-5 py-3 font-medium text-slate-700 transition hover:bg-[#fbfefb] hover:text-slate-950"
            >
              Browse active listings
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
