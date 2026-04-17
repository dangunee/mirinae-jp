import type { NextRequest } from "next/server";
import { getTurnstileTokenFromPayload, verifyTurnstileToken } from "@/lib/turnstile";

const EMAIL_LIKE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** 通信講座の JSON 送信など、電話番号が無いフォーム */
export function isNetlessonStyleSubject(subject: string | undefined): boolean {
  if (!subject) return false;
  return (
    subject.includes("作文トレーニング") ||
    subject.includes("音読トレーニング")
  );
}

/**
 * trial / syutyu の標準申込フォーム（Turnstile + Resend 対象）。
 * netlesson の JSON（「体験申込（作文…」形式）は含めない。
 */
export function requiresCourseTurnstile(subject: string | undefined): boolean {
  if (!subject) return false;
  const s = subject.trim();
  return s.startsWith("【体験申込】") || s.startsWith("【講座申込】");
}

/** 全角数字（０-９）を半角に。IME やコピペで混在しても桁数検証が効くようにする */
function normalizeFullWidthDigits(s: string): string {
  return s.replace(/[\uFF10-\uFF19]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0xff10 + 0x30)
  );
}

export function normalizeFormData(
  data: Record<string, string>
): Record<string, string> {
  const phoneKeys = new Set(["お電話番号", "ご連絡先"]);
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(data)) {
    let val = typeof v === "string" ? v.trim() : v;
    if (phoneKeys.has(k) && typeof val === "string") {
      val = normalizeFullWidthDigits(val);
    }
    out[k] = val;
  }
  return out;
}

function hasHttp(s: string): boolean {
  return s.toLowerCase().includes("http");
}

/** ユーザー表示名の「文字」数（ハングル・漢字・英字いずれも1文字ずつ数える） */
function graphemeCount(s: string): number {
  try {
    const Seg = (Intl as unknown as { Segmenter?: typeof Intl.Segmenter })
      .Segmenter;
    if (Seg) {
      const seg = new Seg("und", { granularity: "grapheme" });
      return [...seg.segment(s)].length;
    }
  } catch {
    /* ignore */
  }
  return [...s].length;
}

/** 同一文字の極端な繰り返し（1グラフェムの名前は許可） */
function looksLikeGibberishName(s: string): boolean {
  if (graphemeCount(s) < 1) return true;
  if (/^(.)\1{7,}$/u.test(s)) return true;
  return false;
}

/** 日本の電話らしい桁数（数字のみカウント。全角数字は normalizeFormData で半角化済み想定） */
function isPlausibleJpPhone(raw: string): boolean {
  const d = raw.replace(/\D/g, "");
  return d.length >= 10 && d.length <= 15;
}

/**
 * スパム除け・必須チェック。戻り値: null=OK、非null=エラーコード
 * invalid_phone … 電話が空・短い・桁数が10〜15の数字でない
 */
export function validatePublicFormPayload(
  data: Record<string, string>
): string | null {
  const subject = (data._subject || "").trim();
  if (subject.includes("メールマガジン")) {
    const email = (data.メールアドレス || "").trim();
    if (!email || !EMAIL_LIKE.test(email)) return "invalid_input";
    return null;
  }

  const name = (data.お名前 || "").trim();
  const furigana = (data.ふりがな || "").trim();
  const email = (data.メールアドレス || "").trim();
  const msgInquiry = (data.お問い合わせ || "").trim();
  const msgOther = (data.メッセージ || "").trim();

  if (!name || !email) return "invalid_input";
  if (name.length > 120) return "spam_detected";
  if (looksLikeGibberishName(name)) return "spam_detected";
  if (hasHttp(name)) return "spam_detected";

  if (!isNetlessonStyleSubject(subject) && !subject.includes("メールマガジン")) {
    if (!furigana || furigana.length < 1) return "invalid_input";
  }
  if (furigana.length > 120 || hasHttp(furigana)) return "spam_detected";

  if (!EMAIL_LIKE.test(email)) return "invalid_input";
  if (email.length > 254) return "invalid_input";

  if (msgInquiry.length > 0 && msgInquiry.length < 3) return "spam_detected";
  if (msgOther.length > 0 && msgOther.length < 3) return "spam_detected";

  if (!isNetlessonStyleSubject(data._subject)) {
    const phoneLine =
      (data.お電話番号 || "").trim() || (data.ご連絡先 || "").trim();
    if (!phoneLine || phoneLine.length < 3) return "invalid_phone";
    if (!isPlausibleJpPhone(phoneLine)) return "invalid_phone";
  }

  return null;
}

export async function assertCourseTurnstileOk(
  req: NextRequest,
  data: Record<string, string>
): Promise<string | null> {
  if (!requiresCourseTurnstile(data._subject)) return null;
  const token = getTurnstileTokenFromPayload(data);
  const ok = await verifyTurnstileToken(req, token);
  if (!ok) return "turnstile_failed";
  return null;
}
