import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import {
  ADMIN_SESSION_COOKIE,
  validateSessionRawToken,
} from "@/lib/admin-session";

/** Server-side validation: opaque session token + DB row (see admin-session.ts). */
export async function isAdminRequest(req: NextRequest): Promise<boolean> {
  const raw = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  return validateSessionRawToken(raw);
}

/** For Server Components / Route handlers using cookies() from next/headers. */
export async function validateAdminFromCookies(): Promise<boolean> {
  const c = cookies();
  const raw = c.get(ADMIN_SESSION_COOKIE)?.value;
  return validateSessionRawToken(raw);
}
