import { createHmac, timingSafeEqual } from "crypto";
import { getPublicSiteUrl } from "@/lib/site-url";
import { signTracking } from "@/lib/newsletter/tracking";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function unsubSecret(): string {
  const s = process.env.NEWSLETTER_UNSUB_SECRET?.trim();
  if (process.env.NODE_ENV === "production") {
    if (!s) {
      throw new Error("NEWSLETTER_UNSUB_SECRET is required in production");
    }
    return s;
  }
  return s || process.env.NEWSLETTER_TRACKING_SECRET?.trim() || "dev-unsub-local-only";
}

export function signSubscriberUnsub(subscriberId: string): string {
  return createHmac("sha256", unsubSecret())
    .update(`unsub:${subscriberId}`, "utf8")
    .digest("base64url")
    .slice(0, 32);
}

export function verifySubscriberUnsub(
  subscriberId: string,
  sig: string
): boolean {
  const expected = signSubscriberUnsub(subscriberId);
  if (sig.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}

/** Encode redirect URL for click tracking. */
function encodeClickUrl(url: string): string {
  return Buffer.from(url, "utf8").toString("base64url");
}

export function buildNewsletterHtml(params: {
  subject: string;
  preheader: string | null;
  bodyHtml: string;
  ctaLabel: string | null;
  ctaUrl: string | null;
  deliveryId: string;
  subscriberId: string;
}): string {
  const base = getPublicSiteUrl();
  const sig = signTracking(params.deliveryId);
  const openPixel = `${base}/api/newsletter/open?d=${encodeURIComponent(params.deliveryId)}&s=${encodeURIComponent(sig)}`;
  const unsubSig = signSubscriberUnsub(params.subscriberId);
  const unsub = `${base}/api/newsletter/unsubscribe?sid=${encodeURIComponent(params.subscriberId)}&s=${encodeURIComponent(unsubSig)}`;

  let ctaBlock = "";
  if (params.ctaLabel?.trim() && params.ctaUrl?.trim()) {
    const clickUrl = `${base}/api/newsletter/click?d=${encodeURIComponent(params.deliveryId)}&u=${encodeClickUrl(params.ctaUrl.trim())}&s=${encodeURIComponent(sig)}`;
    ctaBlock = `<p style="margin:24px 0;"><a href="${escapeHtml(clickUrl)}" style="display:inline-block;padding:12px 24px;background:#b8912e;color:#fff;text-decoration:none;border-radius:6px;font-weight:600;">${escapeHtml(params.ctaLabel.trim())}</a></p>`;
  }

  const preheaderHidden = params.preheader?.trim()
    ? `<div style="display:none;max-height:0;overflow:hidden">${escapeHtml(params.preheader.trim())}</div>`
    : "";

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escapeHtml(params.subject)}</title></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Hiragino Sans','Hiragino Kaku Gothic ProN',Meiryo,'Malgun Gothic',sans-serif;color:#333;line-height:1.7;font-size:15px;">
${preheaderHidden}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:24px 12px;">
<tr><td align="center">
<table role="presentation" width="100%" style="max-width:560px;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.06);">
<tr><td style="padding:20px 24px;background:linear-gradient(135deg,#3d6b6b,#2d5050);color:#fff;font-size:18px;font-weight:600;">ミリネ韓国語教室 メールマガジン</td></tr>
<tr><td style="padding:28px 24px 16px;">
<div class="body">${params.bodyHtml}</div>
${ctaBlock}
<p style="margin:32px 0 0;font-size:12px;color:#888;line-height:1.6;">このメールはミリネ韓国語教室のメールマガジンにご登録の方にお送りしています。<br>
<a href="${escapeHtml(unsub)}" style="color:#666;">配信を停止する（解除）</a></p>
<img src="${escapeHtml(openPixel)}" width="1" height="1" style="display:block;border:0;width:1px;height:1px;" alt="" />
</td></tr>
<tr><td style="padding:16px 24px;background:#fafafa;font-size:11px;color:#999;">株式会社カオンヌリ・ミリネ韓国語教室</td></tr>
</table>
</td></tr></table>
</body></html>`;
}
