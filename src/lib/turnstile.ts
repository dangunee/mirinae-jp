/**
 * Cloudflare Turnstile server-side verification.
 * https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
 */

import type { NextRequest } from "next/server";
import { getClientIp } from "@/lib/rate-limit";

export function getTurnstileTokenFromPayload(
  data: Record<string, string>
): string {
  const t =
    data.turnstileToken?.trim() ||
    data["cf-turnstile-response"]?.trim() ||
    "";
  return t;
}

export async function verifyTurnstileToken(
  req: NextRequest,
  token: string | undefined
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret) return false;
  if (!token || token.trim() === "") return false;

  const remoteip = getClientIp(req);
  const body = new URLSearchParams();
  body.set("secret", secret);
  body.set("response", token.trim());
  if (remoteip && remoteip !== "unknown") body.set("remoteip", remoteip);

  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body,
      }
    );
    const json = (await res.json()) as { success?: boolean };
    return json.success === true;
  } catch {
    return false;
  }
}
