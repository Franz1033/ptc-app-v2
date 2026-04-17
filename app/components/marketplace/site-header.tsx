"use client";

import Link from "next/link";

import { BrandLogo } from "@/app/components/brand-logo";
import { SignOutButton } from "@/app/components/auth/sign-out-button";
import { authClient } from "@/lib/auth-client";

const navLinks = [
  { href: "/marketplace", label: "Marketplace" },
  { href: "/profile", label: "Profile" },
  { href: "/inbox", label: "Inbox" },
] as const;

export function SiteHeader() {
  const { data: session, isPending } = authClient.useSession();
  const accountLabel = session?.user.name ?? session?.user.email;

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label="Pepe Trading Cards home"
          className="inline-flex items-center"
        >
          <BrandLogo className="h-8 w-auto" priority />
        </Link>

        <div className="flex flex-wrap items-center justify-end gap-4">
          <nav
            aria-label="Primary navigation"
            className="flex flex-wrap items-center gap-3 text-sm text-slate-600 sm:gap-6"
          >
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="transition hover:text-slate-950"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/create-listing"
              className="rounded-full bg-emerald-700 px-4 py-2 font-medium text-white transition hover:bg-emerald-800"
            >
              Create Listing
            </Link>
          </nav>

          <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
            {session ? (
              <>
                <div className="hidden text-right sm:block">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Signed in
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {accountLabel}
                  </p>
                </div>
                <SignOutButton />
              </>
            ) : isPending ? (
              <div className="h-10 w-24 animate-pulse rounded-full bg-slate-100" />
            ) : (
              <Link
                href="/sign-in"
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
