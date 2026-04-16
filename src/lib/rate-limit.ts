import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

export function getClientIp(req: NextRequest): string {
  const xf = req.headers.get("x-forwarded-for");
  if (xf) {
    const first = xf.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = req.headers.get("x-real-ip")?.trim();
  if (real) return real;
  return "unknown";
}

type LimitRule = { windowMs: number; max: number };

const RULES: Record<string, LimitRule> = {
  admin_login: { windowMs: 15 * 60 * 1000, max: 10 },
  admin_verify_otp: { windowMs: 15 * 60 * 1000, max: 20 },
  newsletter_subscribe: { windowMs: 60 * 60 * 1000, max: 30 },
};

function windowIndex(now: number, windowMs: number): number {
  return Math.floor(now / windowMs);
}

export async function rateLimitOrThrow(
  req: NextRequest,
  bucket: keyof typeof RULES
): Promise<void> {
  const rule = RULES[bucket];
  const ip = getClientIp(req);
  const key = `${bucket}:${ip}`;
  const w = windowIndex(Date.now(), rule.windowMs);

  const row = await prisma.rateLimitBucket.upsert({
    where: {
      rate_limit_key_window: { key, windowKey: w },
    },
    create: {
      key,
      windowKey: w,
      count: 1,
    },
    update: {
      count: { increment: 1 },
    },
  });

  if (row.count > rule.max) {
    const err = new Error("rate_limited");
    (err as Error & { status: number }).status = 429;
    throw err;
  }

  // Best-effort cleanup of old windows (non-blocking)
  prisma.rateLimitBucket
    .deleteMany({
      where: {
        key,
        windowKey: { lt: w - 2 },
      },
    })
    .catch(() => {});
}
