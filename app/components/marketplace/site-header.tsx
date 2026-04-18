"use client";

import { useEffect, useRef } from "react";

import Link from "next/link";

import { BrandLogo } from "@/app/components/brand-logo";
import { SignOutButton } from "@/app/components/auth/sign-out-button";
import { authClient } from "@/lib/auth-client";

type NavLink = {
  href: string;
  label: string;
  badge?: string;
};

const navLinks: readonly NavLink[] = [
  { href: "/marketplace", label: "Marketplace" },
  { href: "/community", label: "Community", badge: "Soon" },
  { href: "/profile", label: "Profile" },
  { href: "/inbox", label: "Inbox" },
];

const guestNavLinks = navLinks.slice(0, 2);

export function SiteHeader() {
  const headerRef = useRef<HTMLElement | null>(null);
  const { data: session, isPending } = authClient.useSession();
  const accountLabel = session?.user.name ?? session?.user.email;
  const primaryLinks = session ? navLinks : guestNavLinks;

  useEffect(() => {
    const headerElement = headerRef.current;

    if (!headerElement) {
      return;
    }

    const root = document.documentElement;
    const updateHeaderHeight = () => {
      root.style.setProperty(
        "--site-header-height",
        `${headerElement.offsetHeight}px`,
      );
    };

    updateHeaderHeight();

    const resizeObserver = new ResizeObserver(updateHeaderHeight);
    resizeObserver.observe(headerElement);
    window.addEventListener("resize", updateHeaderHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateHeaderHeight);
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 border-b border-slate-200 bg-white"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label="Pepe Trading Cards home"
          className="inline-flex items-center"
        >
          <BrandLogo className="h-7 w-auto" priority />
        </Link>

        <div className="flex flex-wrap items-center justify-end gap-5 sm:gap-6">
          <nav
            aria-label="Primary navigation"
            className="flex flex-wrap items-center gap-4 text-sm text-slate-600 sm:gap-4"
          >
            {primaryLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="inline-flex items-center gap-2 transition hover:text-slate-950"
              >
                <span>{link.label}</span>
                {link.badge ? (
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-emerald-700">
                    {link.badge}
                  </span>
                ) : null}
              </Link>
            ))}
            {session ? (
              <Link
                href="/create-listing"
                className="inline-flex h-9 items-center justify-center rounded-full bg-emerald-700 px-4 text-sm font-medium leading-none text-white transition hover:bg-emerald-800"
              >
                Create Listing
              </Link>
            ) : null}
          </nav>

          <div className="flex items-center gap-3">
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
              <>
                <div className="h-9 w-24 animate-pulse rounded-full bg-slate-100" />
                <div className="h-9 w-24 animate-pulse rounded-full bg-slate-100" />
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="inline-flex h-9 items-center justify-center rounded-full border border-slate-200 px-4 text-sm font-medium leading-none text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
                >
                  Log In
                </Link>
                <Link
                  href="/sign-up"
                  className="inline-flex h-9 items-center justify-center rounded-full bg-emerald-700 px-4 text-sm font-medium leading-none text-emerald-50 transition hover:bg-emerald-800"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
