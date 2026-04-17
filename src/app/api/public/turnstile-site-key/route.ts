import { NextResponse } from "next/server";

/**
 * Public site key for Turnstile widgets on static HTML pages.
 * The site key is not secret; it is exposed to browsers anyway.
 */
export async function GET() {
  const siteKey =
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() ||
    process.env.TURNSTILE_SITE_KEY?.trim() ||
    "";
  return NextResponse.json({ siteKey: siteKey || null });
}
