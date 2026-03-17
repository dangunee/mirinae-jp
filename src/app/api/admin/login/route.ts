import { NextRequest, NextResponse } from "next/server";

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
