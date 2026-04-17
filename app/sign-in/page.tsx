import type { Metadata } from "next";

import { redirect } from "next/navigation";

import { AuthShell } from "@/app/components/auth/auth-shell";
import { getSession } from "@/lib/auth-session";
import { getSafeRedirectPath } from "@/lib/safe-redirect";

type SignInPageProps = {
  searchParams: Promise<{
    next?: string | string[];
  }>;
};

export const metadata: Metadata = {
  title: "Sign In",
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const query = await searchParams;
  const nextPath = getSafeRedirectPath(query.next);
  const session = await getSession();

  if (session) {
    redirect(nextPath);
  }

  return (
    <>
      <AuthShell mode="sign-in" nextPath={nextPath} />
    </>
  );
}
