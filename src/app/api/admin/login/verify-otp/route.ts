import { NextRequest, NextResponse } from "next/server";
import { consumeOtpChallenge } from "@/lib/admin-otp";
import { rateLimitOrThrow } from "@/lib/rate-limit";
import {
  ADMIN_OTP_COOKIE,
  ADMIN_SESSION_COOKIE,
  createAdminSession,
  sessionCookieOptions,
} from "@/lib/admin-session";

export async function POST(req: NextRequest) {
  try {
    await rateLimitOrThrow(req, "admin_verify_otp");
  } catch (e) {
    if ((e as Error & { status?: number }).status === 429) {
      return NextResponse.json(
        { ok: false, error: "rate_limited" },
        { status: 429 }
      );
    }
    throw e;
  }

  const cookieToken = req.cookies.get(ADMIN_OTP_COOKIE)?.value;
  if (!cookieToken) {
    return NextResponse.json(
      { ok: false, error: "expired" },
      { status: 401 }
    );
  }

  let otp = "";
  try {
    const body = await req.json();
    otp = String(body?.otp ?? "").trim();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const ok = await consumeOtpChallenge(cookieToken, otp);
  if (!ok) {
    return NextResponse.json(
      { ok: false, error: "invalid" },
      { status: 401 }
    );
  }

  const { rawToken } = await createAdminSession();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_OTP_COOKIE, "", { path: "/", maxAge: 0 });
  res.cookies.set(ADMIN_SESSION_COOKIE, rawToken, sessionCookieOptions());
  return res;
}
