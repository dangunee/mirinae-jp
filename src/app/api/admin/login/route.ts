import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    return NextResponse.redirect(new URL("/admin/login?error=config", req.url));
  }
  const form = await req.formData().catch(() => null);
  const submitted = (form?.get("password") as string) ?? "";
  if (submitted !== password) {
    return NextResponse.redirect(new URL("/admin/login?error=invalid", req.url));
  }
  const res = NextResponse.redirect(new URL("/admin", req.url), 302);
  res.cookies.set("mirinae_admin", "1", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 1 day
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}
