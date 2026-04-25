import type { Metadata } from "next";

import { SignOutButton } from "@/app/components/auth/sign-out-button";
import { SectionHeading } from "@/app/components/marketplace/section-heading";
import { SiteHeader } from "@/app/components/marketplace/site-header";
import { requireSession } from "@/lib/auth-session";

const profileStats = [
  { label: "Seller rating", value: "4.9 / 5" },
  { label: "Completed deals", value: "41" },
  { label: "Response time", value: "Under 10 min" },
] as const;

const profileDetails = [
  {
    title: "Collector focus",
    copy: "Modern Pokemon promos, clean slabs, and local cash-plus-trade meetups.",
  },
  {
    title: "Preferred meetup zones",
    copy: "Queens hobby shops, daylight coffee spots, and public trade tables with cameras nearby.",
  },
  {
    title: "Current trade targets",
    copy: "Illustration rares, Japanese promos, and premium binder upgrades with clear comps.",
  },
] as const;

export const metadata: Metadata = {
  title: "Profile",
};

export default async function ProfilePage() {
  const session = await requireSession("/profile");

  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-white">
        <section className="border-b border-slate-200">
          <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading
              eyebrow="Profile"
              title={session.user.name ?? "Your profile"}
              description={session.user.email}
              action={<SignOutButton />}
            />

            <div className="mt-10 grid gap-8 border-t border-slate-200 pt-8 sm:grid-cols-3">
              {profileStats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    {stat.label}
                  </p>
                  <p className="mt-3 text-3xl font-semibold text-slate-950">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#fbfefb]">
          <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-3 lg:px-8">
            {profileDetails.map((detail) => (
              <div
                key={detail.title}
                className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.05)]"
              >
                <p className="text-sm font-semibold text-slate-950">
                  {detail.title}
                </p>
                <p className="mt-4 text-sm leading-7 text-slate-500">
                  {detail.copy}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
