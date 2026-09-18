import { z } from "zod";
import {
  createCategory,
  deleteCategory,
  listCategories,
  updateCategory,
} from "@/common/db/categories";
import { isAdmin } from "@/app/(admin)/admin/auth";

export const dynamic = "force-dynamic";

const number = z.unknown().transform((value) => Number(value) || 0);

const categoryBody = z.object({
  id: number.optional(),
  parentId: number.transform((id) => id || null).optional(),
  name: z.string().trim().min(1),
  slug: z.string().trim().min(1),
  description: z.string().nullish().transform((value) => value || ""),
  image: z.string().nullish().transform((value) => value || ""),
  displayOrder: number.optional().transform((order) => order ?? 0),
  isVisible: z.boolean().optional().transform((visible) => visible !== false),
});

const unauthorized = () =>
  Response.json({ error: "Unauthorized" }, { status: 401 });

const invalid = () =>
  Response.json({ error: "Invalid category data." }, { status: 400 });

async function parseCategory(request: Request) {
  const parsed = categoryBody.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return null;
  const { id, parentId, ...rest } = parsed.data;
  return { id, input: { ...rest, parentId: parentId ?? null } };
}

export async function GET(request: Request) {
  const admin = new URL(request.url).searchParams.get("admin") === "1";
  if (admin && !(await isAdmin())) return unauthorized();
  return Response.json(await listCategories(admin));
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return unauthorized();
  const category = await parseCategory(request);
  if (!category) return invalid();
  return Response.json({ id: await createCategory(category.input) });
}

export async function PUT(request: Request) {
  if (!(await isAdmin())) return unauthorized();
  const category = await parseCategory(request);
  if (!category?.id) return invalid();
  await updateCategory(category.id, category.input);
  return Response.json({ ok: true });
}

export async function DELETE(request: Request) {
  if (!(await isAdmin())) return unauthorized();
  const id = Number(new URL(request.url).searchParams.get("id"));
  if (!id) return invalid();
  await deleteCategory(id);
  return Response.json({ ok: true });
}
