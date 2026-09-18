const MAX_EDGE = 1600;
const FALLBACK_EDGE = 1280;
const TARGET_BYTES = 800 * 1024;

function encode(bitmap: ImageBitmap, edge: number, quality: number) {
  const scale = Math.min(1, edge / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is not available.");
  context.fillStyle = "#fff"; // transparent PNGs become white, not black
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Could not encode."))),
      "image/jpeg",
      quality,
    ),
  );
}

/**
 * Shrinks a photo to a JPEG of about 1600px so it uploads quickly and stays
 * within request-size limits. Throws if the file is not a readable image.
 */
export async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) throw new Error("Not an image.");
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  try {
    let blob = await encode(bitmap, MAX_EDGE, 0.82);
    if (blob.size > TARGET_BYTES) blob = await encode(bitmap, FALLBACK_EDGE, 0.65);
    const name = file.name.replace(/\.[^.]+$/, "") || "photo";
    return new File([blob], `${name}.jpg`, { type: "image/jpeg" });
  } finally {
    bitmap.close();
  }
}
