import { NextRequest, NextResponse } from "next/server";
import { sendPublicFormNotification } from "@/lib/email";
import { rateLimitOrThrow } from "@/lib/rate-limit";
import {
  assertCourseTurnstileOk,
  normalizeFormData,
  validatePublicFormPayload,
} from "@/lib/public-form-validate";

export const runtime = "nodejs";

const DEFAULT_REDIRECT =
  "https://mirinae.jp/trial.html?thanks=1&tab=tab02";

const TRIAL_ERROR_BASE = "https://mirinae.jp/trial.html";

const ALLOWED_REDIRECT_HOST = new Set([
  "mirinae.jp",
  "www.mirinae.jp",
  "localhost",
  "127.0.0.1",
]);

/** 失敗時の遷移先。フォームの _error_next（任意）があれば優先（例: 集中講座から送信→syutyu に戻す） */
function redirectFormError(
  code: string,
  data?: Record<string, string>
): NextResponse {
  const custom = data?._error_next?.trim();
  if (custom) {
    try {
      const u = new URL(custom);
      if (ALLOWED_REDIRECT_HOST.has(u.hostname)) {
        u.searchParams.set("form_error", code);
        return NextResponse.redirect(u, 303);
      }
    } catch {
      /* fall through */
    }
  }
  const u = new URL(TRIAL_ERROR_BASE);
  u.searchParams.set("form_error", code);
  return NextResponse.redirect(u, 303);
}

const SAFE_CLIENT_ERROR = "入力内容をご確認ください。";
const SAFE_SERVER_ERROR = "送信に失敗しました。しばらくしてから再度お試しください。";
const SAFE_RATE_ERROR =
  "送信が集中しています。しばらく時間をおいてから再度お試しください。";
const SAFE_PARSE_ERROR =
  "通信エラーが発生しました。再度お試しください。";
const SAFE_TURNSTILE_ERROR =
  "認証の確認に失敗しました。ページを再読み込みのうえ、再度お試しください。";

/** fetch + FormData 送信時は JSON で code を返し、画面にメッセージを出せるようにする */
function wantsJsonResponse(req: NextRequest): boolean {
  const ct = req.headers.get("content-type") || "";
  if (ct.includes("application/json")) return true;
  const accept = req.headers.get("accept") || "";
  if (accept.includes("application/json")) return true;
  return req.headers.get("x-mirinae-form-fetch") === "1";
}

function safeRedirectUrl(next: string | undefined): URL {
  const fallback = new URL(DEFAULT_REDIRECT);
  if (!next?.trim()) return fallback;
  try {
    const u = new URL(next.trim());
    const allowed = new Set([
      "mirinae.jp",
      "www.mirinae.jp",
      "localhost",
      "127.0.0.1",
    ]);
    if (allowed.has(u.hostname)) return u;
  } catch {
    /* ignore */
  }
  return fallback;
}

function isAllowedOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");
  const blob = `${origin || ""} ${referer || ""}`;
  if (!blob.trim()) return true;
  return (
    blob.includes("mirinae.jp") ||
    blob.includes("localhost") ||
    blob.includes("127.0.0.1")
  );
}

async function readBody(req: NextRequest): Promise<Record<string, string>> {
  const ct = req.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    const body = await req.json();
    if (typeof body !== "object" || body === null) return {};
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(body)) {
      if (v === undefined || v === null) continue;
      out[k] = String(v);
    }
    return out;
  }
  const fd = await req.formData();
  const out: Record<string, string> = {};
  fd.forEach((value, key) => {
    if (typeof value === "string") out[key] = value;
    else if (value instanceof File && value.size > 0)
      out[key] = `[file: ${value.name}]`;
  });
  return out;
}

export async function POST(req: NextRequest) {
  if (!isAllowedOrigin(req)) {
    return NextResponse.json(
      { success: false, message: "Forbidden", code: "forbidden" as const },
      { status: 403 }
    );
  }

  try {
    await rateLimitOrThrow(req, "public_form_submit");
  } catch (e) {
    if ((e as Error & { status?: number }).status === 429) {
      if (wantsJsonResponse(req)) {
        return NextResponse.json(
          {
            success: false,
            message: SAFE_RATE_ERROR,
            code: "rate" as const,
          },
          { status: 429 }
        );
      }
      return redirectFormError("rate");
    }
    throw e;
  }

  const wantsJson = wantsJsonResponse(req);

  let data: Record<string, string>;
  try {
    data = await readBody(req);
  } catch {
    if (wantsJson)
      return NextResponse.json(
        {
          success: false,
          message: SAFE_PARSE_ERROR,
          code: "parse" as const,
        },
        { status: 400 }
      );
    return redirectFormError("parse");
  }

  data = normalizeFormData(data);

  // スパム用ハニーポット（値が入っていたら送信せず成功扱い）
  if (data._honey && data._honey.trim() !== "") {
    if (wantsJson) return NextResponse.json({ success: true });
    return NextResponse.redirect(safeRedirectUrl(data._next), 303);
  }
  if (data.website && data.website.trim() !== "") {
    if (wantsJson) return NextResponse.json({ success: true });
    return NextResponse.redirect(safeRedirectUrl(data._next), 303);
  }

  const validationError = validatePublicFormPayload(data);
  if (validationError) {
    if (wantsJson)
      return NextResponse.json(
        {
          success: false,
          message: SAFE_CLIENT_ERROR,
          code: "validation" as const,
        },
        { status: 400 }
      );
    return redirectFormError("validation", data);
  }

  const turnstileErr = await assertCourseTurnstileOk(req, data);
  if (turnstileErr) {
    if (wantsJson)
      return NextResponse.json(
        {
          success: false,
          message: SAFE_TURNSTILE_ERROR,
          code: "turnstile" as const,
        },
        { status: 400 }
      );
    return redirectFormError("turnstile", data);
  }

  const result = await sendPublicFormNotification(data);
  if (!result.ok) {
    if (wantsJson)
      return NextResponse.json(
        {
          success: false,
          message: SAFE_SERVER_ERROR,
          code: "mail" as const,
        },
        { status: 500 }
      );
    return redirectFormError("mail", data);
  }

  if (wantsJson) return NextResponse.json({ success: true });

  return NextResponse.redirect(safeRedirectUrl(data._next), 303);
}
