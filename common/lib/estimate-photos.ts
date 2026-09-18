export const MAX_PHOTOS = 5;
/**
 * Total size the browser will attach. Hosts such as Vercel reject request
 * bodies over about 4.5 MB, so stay comfortably under that.
 */
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
/** Photos are resized in the browser first, so these are generous ceilings. */
export const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
export const MAX_TOTAL_PHOTO_BYTES = 10 * 1024 * 1024;

export type PhotoAttachment = {
  filename: string;
  content: Buffer;
  contentType: string;
};

/** Identifies JPEG, PNG and WebP by their first bytes, ignoring what the upload claims to be. */
export function sniffImage(bytes: Uint8Array) {
  const at = (i: number) => bytes[i];
  if (at(0) === 0xff && at(1) === 0xd8 && at(2) === 0xff) {
    return { contentType: "image/jpeg", ext: "jpg" };
  }
  if (
    at(0) === 0x89 && at(1) === 0x50 && at(2) === 0x4e && at(3) === 0x47 &&
    at(4) === 0x0d && at(5) === 0x0a && at(6) === 0x1a && at(7) === 0x0a
  ) {
    return { contentType: "image/png", ext: "png" };
  }
  const tag = (start: number) =>
    String.fromCharCode(at(start), at(start + 1), at(start + 2), at(start + 3));
  if (bytes.length > 12 && tag(0) === "RIFF" && tag(8) === "WEBP") {
    return { contentType: "image/webp", ext: "webp" };
  }
  return null;
}

/** Validates uploaded photo files and turns them into email attachments. */
export async function readPhotos(
  files: File[],
): Promise<{ photos: PhotoAttachment[] } | { error: string }> {
  if (files.length > MAX_PHOTOS) {
    return { error: `You can attach up to ${MAX_PHOTOS} photos.` };
  }
  const total = files.reduce((sum, file) => sum + file.size, 0);
  if (total > MAX_TOTAL_PHOTO_BYTES) {
    return { error: "The photos are too large in total. Please attach fewer or smaller photos." };
  }
  const photos: PhotoAttachment[] = [];
  for (const [index, file] of files.entries()) {
    if (file.size > MAX_PHOTO_BYTES) {
      return { error: "One of the photos is too large. Please choose a smaller photo." };
    }
    const content = Buffer.from(await file.arrayBuffer());
    const kind = sniffImage(content);
    if (!kind) {
      return { error: "Only JPEG, PNG or WebP photos can be attached." };
    }
    photos.push({
      filename: `photo-${index + 1}.${kind.ext}`,
      content,
      contentType: kind.contentType,
    });
  }
  return { photos };
}
