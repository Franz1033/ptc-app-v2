"use client";

import { FormEvent, useMemo, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { BrandLogo } from "@/app/components/brand-logo";
import { authClient } from "@/lib/auth-client";
import { getSafeRedirectPath } from "@/lib/safe-redirect";

type AuthFormProps = {
  mode: "sign-in" | "sign-up";
  nextPath?: string;
};

export function AuthForm({ mode, nextPath }: AuthFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [isGooglePending, setIsGooglePending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isSignUp = mode === "sign-up";

  const redirectPath = useMemo(
    () => getSafeRedirectPath(nextPath),
    [nextPath],
  );
  const formTitle = isSignUp ? "Create an account" : "Sign in to continue";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsPending(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const name = String(formData.get("name") ?? "").trim();

    if (!email || !password || (isSignUp && !name)) {
      setError("Fill in every required field.");
      setIsPending(false);
      return;
    }

    const result = isSignUp
      ? await authClient.signUp.email({
          email,
          password,
          name,
        })
      : await authClient.signIn.email({
          email,
          password,
        });

    setIsPending(false);

    if (result.error) {
      setError(result.error.message ?? "Unable to continue.");
      return;
    }

    router.push(redirectPath);
    router.refresh();
  }

  async function handleGoogleSignIn() {
    setError(null);
    setIsGooglePending(true);

    const callbackURL = new URL(redirectPath, window.location.origin).toString();
    const result = await authClient.signIn.social({
      provider: "google",
      callbackURL,
    });

    if (result.error) {
      setError(result.error.message ?? "Google sign-in is unavailable.");
      setIsGooglePending(false);
    }
  }

  return (
    <div className="mx-auto grid w-full max-w-[392px] gap-4">
      <div className="text-center">
        <div className="flex justify-center">
          <BrandLogo className="h-9 w-auto" priority />
        </div>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-[1.625rem]">
          {formTitle}
        </h2>
      </div>

      <div className="flex justify-center">
        <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 p-0.5 text-xs">
          <Link
            href={`/sign-in?next=${encodeURIComponent(redirectPath)}`}
            className={`rounded-full px-3 py-1.5 transition ${
              isSignUp
                ? "text-slate-500 hover:text-slate-950"
                : "bg-white font-medium text-slate-950 shadow-sm"
            }`}
          >
            Sign In
          </Link>
          <Link
            href={`/sign-up?next=${encodeURIComponent(redirectPath)}`}
            className={`rounded-full px-3 py-1.5 transition ${
              isSignUp
                ? "bg-white font-medium text-slate-950 shadow-sm"
                : "text-slate-500 hover:text-slate-950"
            }`}
          >
            Create Account
          </Link>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-3.5"
      >
        {isSignUp ? (
          <label className="block">
            <span className="text-sm font-medium text-slate-600">Name</span>
            <input
              name="name"
              type="text"
              autoComplete="name"
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[15px] text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
              placeholder="Your name"
            />
          </label>
        ) : null}

        <label className="block">
          <span className="text-sm font-medium text-slate-600">Email</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[15px] text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
            placeholder="name@example.com"
          />
        </label>

        <label className="block">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="font-medium text-slate-600">Password</span>
            {isSignUp ? (
              <span className="text-[11px] text-slate-400">
                Use 8 or more characters
              </span>
            ) : null}
          </div>
          <input
            name="password"
            type="password"
            autoComplete={isSignUp ? "new-password" : "current-password"}
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[15px] text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
            placeholder={isSignUp ? "Create a password" : "Enter your password"}
          />
        </label>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div>
          <button
            type="submit"
            disabled={isPending || isGooglePending}
            className="w-full rounded-xl bg-slate-900 px-5 py-2.5 text-[15px] font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isPending
              ? isSignUp
                ? "Creating account..."
                : "Signing in..."
              : isSignUp
                ? "Create Account"
                : "Sign In"}
          </button>
        </div>

        <div className="flex items-center gap-3 text-slate-300">
          <span className="h-px flex-1 bg-slate-200" />
          <span className="text-xs text-slate-400">or</span>
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isPending || isGooglePending}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-5 w-5"
          >
            <path
              fill="#4285F4"
              d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.28 1.5-1.13 2.77-2.4 3.63v3h3.88c2.26-2.08 3.54-5.15 3.54-8.87Z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.07 7.93-2.91l-3.88-3c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.77-2.11-6.72-4.96H1.28v3.09A12 12 0 0 0 12 24Z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.29A7.22 7.22 0 0 1 4.91 12c0-.8.14-1.57.37-2.29V6.62H1.28A12 12 0 0 0 0 12c0 1.94.46 3.78 1.28 5.38l4-3.09Z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.45-3.45C17.95 1.14 15.24 0 12 0A12 12 0 0 0 1.28 6.62l4 3.09C6.23 6.86 8.87 4.75 12 4.75Z"
            />
          </svg>
          <span>
            {isGooglePending ? "Redirecting to Google..." : "Sign in with Google"}
          </span>
        </button>
      </form>
    </div>
  );
}
