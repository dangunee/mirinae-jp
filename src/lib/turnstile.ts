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

async function siteverify(
  body: URLSearchParams
): Promise<{ ok: boolean; codes?: string[] }> {
  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body,
      }
    );
    const json = (await res.json()) as {
      success?: boolean;
      "error-codes"?: string[];
    };
    return {
      ok: json.success === true,
      codes: json["error-codes"],
    };
  } catch (e) {
    console.error("[turnstile] siteverify request error:", e);
    return { ok: false };
  }
}

export async function verifyTurnstileToken(
  req: NextRequest,
  token: string | undefined
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret) return false;
  if (!token || token.trim() === "") return false;

  const response = token.trim();

  // 1) IP なしを先に（Vercel 等で X-Forwarded-For が Turnstile 側の記録とずれ invalid になりやすい）
  const withoutIp = new URLSearchParams();
  withoutIp.set("secret", secret);
  withoutIp.set("response", response);
  const first = await siteverify(withoutIp);
  if (first.ok) return true;

  // 2) remoteip 付きで再試行
  const remoteip = getClientIp(req);
  if (remoteip && remoteip !== "unknown") {
    const withIp = new URLSearchParams();
    withIp.set("secret", secret);
    withIp.set("response", response);
    withIp.set("remoteip", remoteip);
    const second = await siteverify(withIp);
    if (second.ok) return true;
    console.error(
      "[turnstile] both attempts failed. error-codes:",
      first.codes?.join(", ") || "(none)",
      "/",
      second.codes?.join(", ") || "(none)"
    );
  } else {
    console.error(
      "[turnstile] verify failed. error-codes:",
      first.codes?.join(", ") || "(none)"
    );
  }

  return false;
}
