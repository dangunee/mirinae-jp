import { NextRequest, NextResponse } from "next/server";
import { verifyOtp } from "@/lib/otp-store";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("mirinae_otp_token")?.value;
  if (!token) {
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

  if (!verifyOtp(token, otp)) {
    return NextResponse.json(
      { ok: false, error: "invalid" },
      { status: 401 }
    );
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.delete("mirinae_otp_token");
  res.cookies.set("mirinae_admin", "1", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 1 day
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}
