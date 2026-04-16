import type { NextRequest } from "next/server";

/** Cookie set by /api/admin/login — same pattern as middleware for /admin pages. */
export function isAdminRequest(req: NextRequest): boolean {
  return req.cookies.get("mirinae_admin")?.value === "1";
}
