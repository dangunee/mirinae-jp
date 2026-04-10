import { NextRequest, NextResponse } from "next/server";
import { sendPublicFormNotification } from "@/lib/email";

export const runtime = "nodejs";

const DEFAULT_REDIRECT =
  "https://mirinae.jp/trial.html?thanks=1&tab=tab02";

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
