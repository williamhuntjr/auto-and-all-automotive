import { cookies } from "next/headers";
import { ADMIN_COOKIE } from "@/app/(admin)/admin/auth";

export async function POST() {
  (await cookies()).delete(ADMIN_COOKIE);
  return new Response(null, { status: 303, headers: { Location: "/" } });
}
