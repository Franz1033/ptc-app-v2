import "server-only";

import { randomUUID } from "node:crypto";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

export const MAX_LISTING_MEDIA_FILES = 8;
export const MAX_LISTING_MEDIA_FILE_SIZE_BYTES = 20 * 1024 * 1024;
export const MAX_LISTING_MEDIA_TOTAL_SIZE_BYTES = 45 * 1024 * 1024;

const listingMediaUploadDirectory = path.join(
  process.cwd(),
  "public",
  "uploads",
  "listings",
);

const allowedMediaMimePrefixes = ["image/"] as const;

function sanitizeFileName(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[^\w.-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

function getFileExtension(file: File) {
  const parsedExtension = path.extname(file.name).toLowerCase();

  if (parsedExtension) {
    return parsedExtension;
  }

  if (file.type === "image/jpeg") {
    return ".jpg";
  }

  if (file.type === "image/png") {
    return ".png";
  }

  if (file.type === "image/webp") {
    return ".webp";
  }

  if (file.type === "image/gif") {
    return ".gif";
  }

  return "";
}

export function isSupportedListingMediaFile(file: File) {
  return allowedMediaMimePrefixes.some((prefix) => file.type.startsWith(prefix));
}

export async function storeListingMediaFiles(files: File[]) {
  await mkdir(listingMediaUploadDirectory, { recursive: true });

  const storedMediaUrls: string[] = [];

  for (const file of files) {
    const baseName = sanitizeFileName(path.basename(file.name, path.extname(file.name)));
    const safeBaseName = baseName || "listing-media";
    const fileExtension = getFileExtension(file);
    const storedFileName = `${Date.now()}-${randomUUID()}-${safeBaseName}${fileExtension}`;
    const storedFilePath = path.join(listingMediaUploadDirectory, storedFileName);
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    await writeFile(storedFilePath, fileBuffer);
    storedMediaUrls.push(`/uploads/listings/${storedFileName}`);
  }

  return storedMediaUrls;
}

export async function deleteListingMediaFiles(mediaUrls: string[]) {
  await Promise.all(
    mediaUrls.map(async (mediaUrl) => {
      const normalizedMediaUrl = mediaUrl.replace(/^\/+/, "");
      const mediaFilePath = path.join(process.cwd(), "public", normalizedMediaUrl);

      await rm(mediaFilePath, { force: true });
    }),
  );
}
