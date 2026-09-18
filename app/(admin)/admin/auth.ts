import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "auto_and_all_admin";

function expectedToken() {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  return createHash("sha256").update(password).digest("hex");
}

export async function isAdmin() {
  const expected = expectedToken();
  const actual = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!expected || !actual || expected.length !== actual.length) return false;
  return timingSafeEqual(Buffer.from(actual), Buffer.from(expected));
}

export function adminTokenFor(password: string) {
  const configured = process.env.ADMIN_PASSWORD;
  if (!configured || password.length !== configured.length) return null;
  if (!timingSafeEqual(Buffer.from(password), Buffer.from(configured))) return null;
  return createHash("sha256").update(configured).digest("hex");
}
