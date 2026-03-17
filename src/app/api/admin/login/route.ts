import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    return NextResponse.json({ ok: false, error: "config" }, { status: 400 });
  }
  const contentType = req.headers.get("content-type") ?? "";
  let submitted = "";
  if (contentType.includes("application/json")) {
    const body = await req.json().catch(() => ({}));
    submitted = (body?.password as string) ?? "";
  } else {
    const form = await req.formData().catch(() => null);
    submitted = (form?.get("password") as string) ?? "";
  }
  if (submitted !== password) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 401 });
  }
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
