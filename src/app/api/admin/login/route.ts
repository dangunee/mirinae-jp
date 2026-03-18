import { NextRequest, NextResponse } from "next/server";
import { generateOtp, generateToken, saveOtp } from "@/lib/otp-store";
import { sendOtpEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
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
  const hasResend = !!process.env.RESEND_API_KEY?.trim();

  // OTP 2FA: ADMIN_EMAIL + RESEND_API_KEY が設定されていれば OTP フロー
  if (adminEmail && hasResend) {
    const otp = generateOtp();
    const token = generateToken();
    saveOtp(token, otp);

    const sent = await sendOtpEmail(adminEmail, otp);
    if (!sent) {
      return NextResponse.json(
        { ok: false, error: "email_failed" },
        { status: 500 }
      );
    }

    const res = NextResponse.json({ ok: true, requiresOtp: true });
    res.cookies.set("mirinae_otp_token", token, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 5, // 5 min
      secure: process.env.NODE_ENV === "production",
    });
    return res;
  }

  // 従来どおりパスワードのみでログイン
  const res = NextResponse.json({ ok: true });
  res.cookies.set("mirinae_admin", "1", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 1 day
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}
