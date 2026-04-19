export const DEFAULT_REDIRECT_PATH = "/profile";

export function getSafeRedirectPath(
  nextPath: string | string[] | null | undefined,
  fallback = DEFAULT_REDIRECT_PATH,
) {
  const resolvedPath = Array.isArray(nextPath) ? nextPath[0] : nextPath;

  if (!resolvedPath || !resolvedPath.startsWith("/") || resolvedPath.startsWith("//")) {
    return fallback;
  }

  return resolvedPath;
}

export function buildSignInHref(
  nextPath: string | string[] | null | undefined,
) {
  const safeNextPath = getSafeRedirectPath(nextPath);
  const searchParams = new URLSearchParams({
    next: safeNextPath,
  });

  return `/sign-in?${searchParams.toString()}`;
}
