import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getAuth } from "@/lib/auth";
import {
  buildSignInHref,
  DEFAULT_REDIRECT_PATH,
  getSafeRedirectPath,
} from "@/lib/safe-redirect";

function hasDatabaseConfig() {
  return Boolean(process.env.DATABASE_URL || process.env.DIRECT_URL);
}

export async function getSession() {
  if (!hasDatabaseConfig()) {
    return null;
  }

  return getAuth().api.getSession({
    headers: await headers(),
  });
}

export async function requireSession(nextPath = DEFAULT_REDIRECT_PATH) {
  const session = await getSession();

  if (!session) {
    redirect(buildSignInHref(nextPath));
  }

  return session;
}

export async function redirectIfSignedIn(
  nextPath: string | string[] | null | undefined,
) {
  const session = await getSession();

  if (session) {
    redirect(getSafeRedirectPath(nextPath));
  }
}
