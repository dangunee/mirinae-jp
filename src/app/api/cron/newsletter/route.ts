import { NextRequest, NextResponse } from "next/server";
import { runNewsletterDispatcher } from "@/lib/newsletter/send-queue";

export const runtime = "nodejs";

/**
 * Vercel Cron: scheduled campaigns & queued deliveries.
 * Schedule is in vercel.json — Hobby plan allows at most once per day; use Pro or an external
 * cron (Bearer CRON_SECRET) for more frequent runs.
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim();
  const auth = req.headers.get("authorization") || "";
  const vercelCron = req.headers.get("x-vercel-cron");
  const isProd = process.env.VERCEL === "1" || process.env.NODE_ENV === "production";
  if (isProd && vercelCron !== "1" && (!secret || auth !== `Bearer ${secret}`)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { processed, error } = await runNewsletterDispatcher();
  return NextResponse.json({ ok: true, processed, error: error ?? null });
}
