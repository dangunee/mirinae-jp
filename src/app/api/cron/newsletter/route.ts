import { NextRequest, NextResponse } from "next/server";
import { runNewsletterDispatcher } from "@/lib/newsletter/send-queue";

export const runtime = "nodejs";

/** Vercel Cron: process scheduled campaigns & queued deliveries. */
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
