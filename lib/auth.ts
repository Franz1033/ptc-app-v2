import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";

import { getPrismaClient } from "@/lib/prisma";

const authSecret =
  process.env.BETTER_AUTH_SECRET ??
  "ptc-local-dev-secret-please-change-before-production-2026";
const authBaseURL = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const authUrl = new URL(authBaseURL);

function createAuth() {
  return betterAuth({
    baseURL: {
      allowedHosts: [
        "localhost:*",
        "127.0.0.1:*",
        "0.0.0.0:*",
        "[::1]:*",
        authUrl.host,
      ],
      fallback: authBaseURL,
      protocol: authUrl.protocol === "https:" ? "https" : "http",
    },
    secret: authSecret,
    database: prismaAdapter(getPrismaClient(), {
      provider: "postgresql",
      transaction: true,
      usePlural: false,
    }),
    emailAndPassword: {
      enabled: true,
    },
    ...(googleClientId && googleClientSecret
      ? {
          socialProviders: {
            google: {
              clientId: googleClientId,
              clientSecret: googleClientSecret,
              prompt: "select_account" as const,
            },
          },
        }
      : {}),
    plugins: [nextCookies()],
  });
}

type PtcAuth = ReturnType<typeof createAuth>;

declare global {
  var ptcAuth: PtcAuth | undefined;
}

export function getAuth(): PtcAuth {
  const auth = globalThis.ptcAuth ?? createAuth();

  globalThis.ptcAuth = auth;

  return auth;
}
