import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "@/generated/prisma/client";

declare global {
  var ptcPrisma: PrismaClient | undefined;
}

function hasMarketplaceListingDelegate(prisma: PrismaClient) {
  return typeof (prisma as PrismaClient & { marketplaceListing?: unknown })
    .marketplaceListing !== "undefined";
}

function getRuntimeDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL ?? process.env.DIRECT_URL;

  if (!databaseUrl) {
    throw new Error(
      "Missing DATABASE_URL or DIRECT_URL. Add your Supabase Postgres URLs before using Better Auth.",
    );
  }

  return databaseUrl;
}

function createPrismaClient() {
  const adapter = new PrismaPg(getRuntimeDatabaseUrl());

  return new PrismaClient({
    adapter,
  });
}

export function getPrismaClient() {
  if (
    globalThis.ptcPrisma &&
    hasMarketplaceListingDelegate(globalThis.ptcPrisma)
  ) {
    return globalThis.ptcPrisma;
  }

  const prisma = createPrismaClient();
  globalThis.ptcPrisma = prisma;

  return prisma;
}
