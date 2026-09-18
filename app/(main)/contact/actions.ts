"use server";

import { headers } from "next/headers";
import {
  estimateSchema,
  type EstimateField,
  type EstimateRequest,
} from "@/common/lib/estimate";
import { sendEstimateEmail } from "@/common/lib/estimate-email";
import { readPhotos } from "@/common/lib/estimate-photos";
import { rateLimit } from "@/common/lib/rate-limit";
import { SITE } from "@/common/lib/seo";

export type EstimateState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<EstimateField | "photos", string>>;
  /** What the visitor typed, so the form can be refilled after an error. */
  values?: Partial<Record<EstimateField, string>>;
};

const FIELDS: EstimateField[] = [
  "name",
  "contact",
  "vehicle",
  "service",
  "details",
];

export async function submitEstimate(
  _previous: EstimateState,
  formData: FormData,
): Promise<EstimateState> {
  // Hidden field that people never see: only bots fill it in. Pretend it worked.
  if (String(formData.get("website") ?? "").trim()) {
    return { status: "success" };
  }

  const values = Object.fromEntries(
    FIELDS.map((field) => [field, String(formData.get(field) ?? "")]),
  ) as Record<EstimateField, string>;

  const parsed = estimateSchema.safeParse(values);
  if (!parsed.success) {
    const fieldErrors: EstimateState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as EstimateField;
      fieldErrors[field] ??= issue.message;
    }
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      fieldErrors,
      values,
    };
  }

  const files = formData
    .getAll("photos")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);
  const photoResult = await readPhotos(files);
  if ("error" in photoResult) {
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      fieldErrors: { photos: photoResult.error },
      values,
    };
  }

  const forwardedFor = (await headers()).get("x-forwarded-for");
  const visitor = forwardedFor?.split(",")[0].trim() || "unknown";
  if (!rateLimit(`estimate:${visitor}`)) {
    return {
      status: "error",
      message: `You've sent several requests recently. Please try again later, or email ${SITE.estimatesEmail}.`,
      values,
    };
  }

  try {
    await sendEstimateEmail(
      parsed.data satisfies EstimateRequest,
      photoResult.photos,
    );
  } catch (error) {
    console.error("Estimate email failed:", error);
    return {
      status: "error",
      message: `We couldn't send your request just now. Please try again, or email us directly at ${SITE.estimatesEmail}.`,
      values,
    };
  }
  return { status: "success" };
}
