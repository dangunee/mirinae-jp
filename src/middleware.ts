import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  // 루트 → index.html (App Router 404 방지)
  if (path === "/" || path === "") {
    return NextResponse.rewrite(new URL("/index.html", req.url));
  }
  if (!path.startsWith("/admin")) return NextResponse.next();
  if (path.startsWith("/admin/login")) return NextResponse.next();
  const token = req.cookies.get("mirinae_admin")?.value;
  if (token === "1") return NextResponse.next();
  return NextResponse.redirect(new URL("/admin/login/", req.url));
}

export const config = { matcher: ["/", "/admin", "/admin/:path*"] };
