"use client";

import { useEffect, useRef } from "react";

import Link from "next/link";

import { BrandLogo } from "@/app/components/brand-logo";
import { authClient } from "@/lib/auth-client";

type NavLink = {
  href: string;
  label: string;
  badge?: string;
};

const navLinks: readonly NavLink[] = [
  { href: "/marketplace", label: "Marketplace" },
  { href: "/community", label: "Community", badge: "Soon" },
];

function HeaderActionButton({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-medium leading-none text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
    >
      {children}
      <span className="truncate">{label}</span>
    </Link>
  );
}

export function SiteHeader() {
  const headerRef = useRef<HTMLElement | null>(null);
  const { data: session, isPending } = authClient.useSession();
  const accountLabel =
    session?.user.name ?? session?.user.email?.split("@")[0] ?? "Profile";

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
          className="inline-flex items-center gap-3"
        >
          <BrandLogo className="h-7 w-auto" priority />
          <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-800">
            Beta
          </span>
        </Link>

        <div className="flex flex-wrap items-center justify-end gap-5 sm:gap-6">
          <nav
            aria-label="Primary navigation"
            className="flex flex-wrap items-center gap-4 text-sm text-slate-600 sm:gap-4"
          >
            {navLinks.map((link) => (
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
          </nav>

          <div className="flex items-center gap-3">
            {session ? (
              <>
                <HeaderActionButton href="/inbox" label="Inbox">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 16 16"
                    className="h-4 w-4"
                    fill="none"
                  >
                    <path
                      d="M2.5 4.25C2.5 3.56 3.06 3 3.75 3H12.25C12.94 3 13.5 3.56 13.5 4.25V11.75C13.5 12.44 12.94 13 12.25 13H3.75C3.06 13 2.5 12.44 2.5 11.75V4.25Z"
                      stroke="currentColor"
                      strokeWidth="1.4"
                    />
                    <path
                      d="M3 5L7.2 8.15C7.67 8.5 8.33 8.5 8.8 8.15L13 5"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </HeaderActionButton>

                <HeaderActionButton href="/profile" label={accountLabel}>
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 16 16"
                    className="h-4 w-4"
                    fill="none"
                  >
                    <circle
                      cx="8"
                      cy="5.5"
                      r="2.5"
                      stroke="currentColor"
                      strokeWidth="1.4"
                    />
                    <path
                      d="M3.25 12.75C3.76 10.83 5.59 9.5 8 9.5C10.41 9.5 12.24 10.83 12.75 12.75"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                  </svg>
                </HeaderActionButton>
              </>
            ) : isPending ? (
              <>
                <div className="h-10 w-24 animate-pulse rounded-full bg-slate-100" />
                <div className="h-10 w-32 animate-pulse rounded-full bg-slate-100" />
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
