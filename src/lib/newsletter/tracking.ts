import { createHmac, timingSafeEqual } from "crypto";

function trackingSecret(): string {
  const s = process.env.NEWSLETTER_TRACKING_SECRET?.trim();
  if (process.env.NODE_ENV === "production") {
    if (!s) {
      throw new Error("NEWSLETTER_TRACKING_SECRET is required in production");
    }
    return s;
  }
  return s || "dev-insecure-tracking";
}

export function signTracking(deliveryId: string): string {
  return createHmac("sha256", trackingSecret())
    .update(deliveryId, "utf8")
    .digest("base64url")
    .slice(0, 28);
}

export function verifyTracking(deliveryId: string, sig: string): boolean {
  const expected = signTracking(deliveryId);
  if (sig.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}
