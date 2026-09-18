import { cookies } from "next/headers";
import { ADMIN_COOKIE, adminTokenFor } from "@/app/(admin)/admin/auth";

// Redirects use a relative Location so the browser stays on the host it used.
// (`request.url` can carry the server's bind address, e.g. 0.0.0.0 in Docker.)
const redirectTo = (path: string) =>
  new Response(null, { status: 303, headers: { Location: path } });

export async function POST(request: Request) {
  const form = await request.formData();
  const token = adminTokenFor(String(form.get("password") || ""));
  if (!token) return redirectTo("/admin/login?error=1");
  (await cookies()).set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return redirectTo("/admin");
}
