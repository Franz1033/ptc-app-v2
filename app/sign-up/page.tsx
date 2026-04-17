import type { Metadata } from "next";

import { redirect } from "next/navigation";

import { AuthShell } from "@/app/components/auth/auth-shell";
import { getSession } from "@/lib/auth-session";
import { getSafeRedirectPath } from "@/lib/safe-redirect";

type SignUpPageProps = {
  searchParams: Promise<{
    next?: string | string[];
  }>;
};

export const metadata: Metadata = {
  title: "Create Account",
};

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const query = await searchParams;
  const nextPath = getSafeRedirectPath(query.next);
  const session = await getSession();

  if (session) {
    redirect(nextPath);
  }

  return (
    <>
      <AuthShell mode="sign-up" nextPath={nextPath} />
    </>
  );
}
