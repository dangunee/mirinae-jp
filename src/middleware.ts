import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Must match `ADMIN_SESSION_COOKIE` in `@/lib/admin-session` (avoid importing Node crypto into Edge). */
const ADMIN_SESSION_COOKIE = "mirinae_admin_session";

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-mirinae-path", path);

  if (path === "/" || path === "") {
    return NextResponse.rewrite(new URL("/index.html", req.url), {
      request: { headers: requestHeaders },
    });
  }

  if (!path.startsWith("/admin")) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }
  if (path.startsWith("/admin/login")) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const token = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (token && token.length >= 40) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }
  return NextResponse.redirect(new URL("/admin/login/", req.url));
}

export const config = { matcher: ["/", "/admin", "/admin/:path*"] };
