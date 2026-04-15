import { NextRequest, NextResponse } from "next/server";
import { sendPublicFormNotification } from "@/lib/email";

export const runtime = "nodejs";

const DEFAULT_REDIRECT =
  "https://mirinae.jp/trial.html?thanks=1&tab=tab02";

const EMAIL_LIKE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** 通信講座の JSON 送信など、電話番号が無いフォーム */
function isNetlessonStyleSubject(subject: string | undefined): boolean {
  if (!subject) return false;
  return (
    subject.includes("作文トレーニング") ||
    subject.includes("音読トレーニング")
  );
}

/**
 * スパム除け（名前・メール必須、名前に URL 禁止、任意メッセージは 3 文字未満なら拒否）。
 * 電話は trial / syutyu 系のみ必須（通信講座の JSON は除く）。
 */
function validatePublicFormPayload(
  data: Record<string, string>
): string | null {
  const name = (data.お名前 || "").trim();
  const email = (data.メールアドレス || "").trim();
  const msgInquiry = (data.お問い合わせ || "").trim();
  const msgOther = (data.メッセージ || "").trim();

  if (!name || !email) return "invalid_input";
  if (name.length < 2) return "spam_detected";
  if (name.toLowerCase().includes("http")) return "spam_detected";
  if (!EMAIL_LIKE.test(email)) return "invalid_input";
  if (msgInquiry.length > 0 && msgInquiry.length < 3) return "spam_detected";
  if (msgOther.length > 0 && msgOther.length < 3) return "spam_detected";

  if (!isNetlessonStyleSubject(data._subject)) {
    // tab01/02 は お電話番号、tab04 お問い合わせは ご連絡先（携帯番号等）
    const phoneLine =
      (data.お電話番号 || "").trim() || (data.ご連絡先 || "").trim();
    if (!phoneLine || phoneLine.length < 3) return "invalid_input";
  }

  return null;
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
      { success: false, message: "Forbidden" },
      { status: 403 }
    );
  }

  const wantsJson = (req.headers.get("content-type") || "").includes(
    "application/json"
  );

  let data: Record<string, string>;
  try {
    data = await readBody(req);
  } catch {
    if (wantsJson)
      return NextResponse.json(
        { success: false, message: "Bad request" },
        { status: 400 }
      );
    return NextResponse.redirect(
      new URL("https://mirinae.jp/trial.html?form_error=1"),
      303
    );
  }

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
          message: "入力内容をご確認ください。",
        },
        { status: 400 }
      );
    return NextResponse.redirect(
      new URL("https://mirinae.jp/trial.html?form_error=1"),
      303
    );
  }

  const result = await sendPublicFormNotification(data);
  if (!result.ok) {
    if (wantsJson)
      return NextResponse.json(
        {
          success: false,
          message: result.error || "送信に失敗しました",
        },
        { status: 500 }
      );
    return NextResponse.redirect(
      new URL("https://mirinae.jp/trial.html?form_error=1"),
      303
    );
  }

  if (wantsJson) return NextResponse.json({ success: true });

  return NextResponse.redirect(safeRedirectUrl(data._next), 303);
}
