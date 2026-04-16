import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_OTP_COOKIE,
  ADMIN_SESSION_COOKIE,
  revokeSessionRawToken,
} from "@/lib/admin-session";

export async function GET(req: NextRequest) {
  const raw = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  await revokeSessionRawToken(raw);

  const res = NextResponse.redirect(new URL("/", req.url), 302);
  res.cookies.set(ADMIN_SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  res.cookies.set(ADMIN_OTP_COOKIE, "", { path: "/", maxAge: 0 });
  res.cookies.set("mirinae_admin", "", { path: "/", maxAge: 0 });
  return res;
}
