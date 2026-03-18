import { NextRequest, NextResponse } from "next/server";

const BLOG_ORIGIN = "https://mirinae.hippy.jp";
const BLOG_BASE = `${BLOG_ORIGIN}/blog`;

/**
 * WordPress に X-Forwarded-Host を渡して mirinae.jp を認識させるプロキシ。
 * これにより WordPress が hippy.jp へリダイレクトしなくなる。
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { path?: string[] } }
) {
  return proxyRequest(request, params.path ?? []);
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path?: string[] } }
) {
  return proxyRequest(request, params.path ?? []);
}

export async function HEAD(
  request: NextRequest,
  { params }: { params: { path?: string[] } }
) {
  return proxyRequest(request, params.path ?? []);
}

async function proxyRequest(request: NextRequest, pathSegments: string[]) {
  const path = pathSegments.length > 0 ? "/" + pathSegments.join("/") : "";
  const search = request.nextUrl.search;
  const targetUrl = `${BLOG_BASE}${path}${search}`;

  const headers = new Headers(request.headers);
  headers.set("X-Forwarded-Host", "mirinae.jp");
  headers.set("X-Forwarded-Proto", "https");
  headers.set("Host", "mirinae.hippy.jp");
  headers.set("Accept-Encoding", "identity");

  const init: RequestInit = {
    method: request.method,
    headers,
  };
  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.arrayBuffer();
  }

  const res = await fetch(targetUrl, init);

  const resHeaders = new Headers(res.headers);
  resHeaders.delete("transfer-encoding");
  resHeaders.delete("content-encoding");

  return new NextResponse(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers: resHeaders,
  });
}
