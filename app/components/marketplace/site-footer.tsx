"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { BrandLogo } from "@/app/components/brand-logo";

const footerLinks = [
  { href: "/marketplace", label: "Marketplace" },
  { href: "/profile", label: "Profile" },
  { href: "/inbox", label: "Inbox" },
  { href: "/create-listing", label: "Create Listing" },
] as const;

export function SiteFooter() {
  const pathname = usePathname();

  if (pathname === "/sign-in" || pathname === "/sign-up") {
    return null;
  }

  return (
    <footer className="border-t border-slate-200 bg-[#fbfefb]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xl">
            <Link
              href="/"
              aria-label="Pepe Trading Cards home"
              className="inline-flex items-center"
            >
              <BrandLogo className="h-8 w-auto" />
            </Link>
            <p className="mt-4 text-sm leading-7 text-slate-500">
              Fixed-price card listings with direct messages and public meetups.
            </p>
          </div>

          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600"
          >
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="transition hover:text-slate-950"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-2 border-t border-slate-200 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright 2026 Pepe Trading Cards. All rights reserved.</p>
          <p>Buy, sell, and trade cards.</p>
        </div>
      </div>
    </footer>
  );
}
