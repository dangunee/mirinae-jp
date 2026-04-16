import { NextRequest, NextResponse } from "next/server";
import {
  createOtpChallenge,
  generateOtpDigits,
  otpCookieOptions,
} from "@/lib/admin-otp";
import { sendOtpEmail } from "@/lib/email";
import { rateLimitOrThrow } from "@/lib/rate-limit";
import {
  ADMIN_OTP_COOKIE,
  ADMIN_SESSION_COOKIE,
  createAdminSession,
  sessionCookieOptions,
} from "@/lib/admin-session";

export async function POST(req: NextRequest) {
  try {
    await rateLimitOrThrow(req, "admin_login");
  } catch (e) {
    if ((e as Error & { status?: number }).status === 429) {
      return NextResponse.json(
        { ok: false, error: "rate_limited" },
        { status: 429 }
      );
    }
    throw e;
  }

  const password = (process.env.ADMIN_PASSWORD ?? "").trim();
  if (!password) {
    return NextResponse.json({ ok: false, error: "config" }, { status: 400 });
  }

  const contentType = req.headers.get("content-type") ?? "";
  let submitted = "";
  if (contentType.includes("application/json")) {
    const body = await req.json().catch(() => ({}));
    submitted = String((body?.password as string) ?? "").trim();
  } else {
    const form = await req.formData().catch(() => null);
    submitted = String((form?.get("password") as string) ?? "").trim();
  }

  if (submitted !== password) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 401 });
  }

  const adminEmail = process.env.ADMIN_EMAIL?.trim();
  const hasGmail = !!(
    process.env.GMAIL_USER?.trim() && process.env.GMAIL_APP_PASSWORD?.trim()
  );
  const hasResend = !!process.env.RESEND_API_KEY?.trim();

  if (adminEmail && (hasGmail || hasResend)) {
    const otp = generateOtpDigits();
    const { cookieToken } = await createOtpChallenge(otp);

    const sent = await sendOtpEmail(adminEmail, otp);
    if (!sent) {
      return NextResponse.json(
        { ok: false, error: "email_failed" },
        { status: 500 }
      );
    }

    const res = NextResponse.json({ ok: true, requiresOtp: true });
    res.cookies.set(ADMIN_OTP_COOKIE, cookieToken, otpCookieOptions());
    return res;
  }

  const { rawToken } = await createAdminSession();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_SESSION_COOKIE, rawToken, sessionCookieOptions());
  return res;
}
