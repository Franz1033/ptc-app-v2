import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";

import { getAuth } from "@/lib/auth";
import { buildSignInHref } from "@/lib/safe-redirect";

function getRequestedPath(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  return `${pathname}${search}`;
}

export async function proxy(request: NextRequest) {
  const sessionToken = getSessionCookie(request.headers);

  if (!sessionToken) {
    return NextResponse.redirect(
      new URL(buildSignInHref(getRequestedPath(request)), request.url),
    );
  }

  try {
    const session = await getAuth().api.getSession({
      headers: request.headers,
    });

    if (session) {
      return NextResponse.next();
    }
  } catch {
    // Fall through to the auth redirect when session validation fails.
  }

  return NextResponse.redirect(
    new URL(buildSignInHref(getRequestedPath(request)), request.url),
  );
}

export const config = {
  matcher: ["/create-listing", "/profile", "/inbox"],
};
