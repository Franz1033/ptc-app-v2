"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireSession } from "@/lib/auth-session";
import { deleteStoredMarketplaceListingForOwner } from "@/lib/marketplace-listings";

export async function deleteListingAction(slug: string) {
  const session = await requireSession(`/listing/${slug}`);
  const deleted = await deleteStoredMarketplaceListingForOwner(
    slug,
    session.user.id,
  );

  if (!deleted) {
    redirect(`/listing/${slug}`);
  }

  revalidatePath("/marketplace");
  revalidatePath(`/listing/${slug}`);

  redirect("/marketplace");
}
