import nodemailer from "nodemailer";
import { Resend } from "resend";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const EMAIL_LIKE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** FormSubmit の _replyto がメールアドレス文字列かフィールド名（例: メールアドレス）のどちらでも解決 */
function resolveReplyTo(data: Record<string, string>): string | undefined {
  const hint = data._replyto?.trim();
  if (!hint) return undefined;
  if (hint.includes("@")) return hint;
  const v = data[hint]?.trim();
  if (v && EMAIL_LIKE.test(v)) return v;
  return undefined;
}

/** 申請者への自動返信先（_replyto が無い場合もメールアドレス欄を参照） */
function resolveApplicantEmail(data: Record<string, string>): string | undefined {
  const fromReply = resolveReplyTo(data);
  if (fromReply) return fromReply;
  const direct = data["メールアドレス"]?.trim();
  if (direct && EMAIL_LIKE.test(direct)) return direct;
  return undefined;
}

function applicantConfirmationSubject(data: Record<string, string>): string {
  const s = data._subject || "";
  if (s.includes("体験申込")) return "【ミリネ韓国語教室】体験お申込みを受け付けました";
  if (s.includes("講座申込")) return "【ミリネ韓国語教室】講座お申込みを受け付けました";
  if (s.includes("お問い合わせ")) return "【ミリネ韓国語教室】お問い合わせを受け付けました";
  return "【ミリネ韓国語教室】お申込みを受け付けました";
}

let publicFormTransporter: nodemailer.Transporter | null | undefined;

function getPublicFormTransporter(): nodemailer.Transporter | null {
  if (publicFormTransporter === undefined) {
    const user = process.env.GMAIL_USER?.trim();
    const pass = process.env.GMAIL_APP_PASSWORD?.trim();
    if (!user || !pass) {
      publicFormTransporter = null;
    } else {
      publicFormTransporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user, pass },
      });
    }
  }
  return publicFormTransporter;
}

/**
 * 差出人（From）表示。GMAIL_USER と別にしたい場合に FORM_MAIL_FROM を設定。
 * SMTP 認証は常に GMAIL_USER。Google の「別のアドレスから送信」で許可済みのアドレスのみ有効。
 */
function getFormMailFrom(smtpUser: string): string {
  return process.env.FORM_MAIL_FROM?.trim() || smtpUser;
}

async function sendApplicantConfirmationEmail(
  to: string,
  data: Record<string, string>
): Promise<{ ok: boolean; error?: string }> {
  const gmailUser = process.env.GMAIL_USER?.trim();
  const t = getPublicFormTransporter();
  if (!t || !gmailUser) {
    return { ok: false, error: "GMAIL_USER / GMAIL_APP_PASSWORD is not set" };
  }

  const subject = applicantConfirmationSubject(data);
  const name = data["お名前"]?.trim();
  const greeting = name ? `${escapeHtml(name)} 様` : "お客様";

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:'Hiragino Sans','Hiragino Kaku Gothic ProN',Meiryo,sans-serif;font-size:15px;color:#333;line-height:1.8;">
<p style="margin:0 0 16px;">${greeting}</p>
<p style="margin:0 0 16px;">この度はミリネ韓国語教室にお申込み・お問い合わせいただき、ありがとうございます。<br>お送りいただいた内容は正常に受け付けました。</p>
<p style="margin:0 0 16px;">内容を確認のうえ、担当より順次ご連絡いたします。今しばらくお待ちください。</p>
<p style="margin:0 0 20px;color:#666;font-size:13px;">※本メールは送信専用の自動返信です。このメールに返信されてもお答えできない場合がございます。</p>
<p style="margin:0;font-size:13px;color:#666;">株式会社カオンヌリ　ミリネ韓国語教室<br><a href="https://mirinae.jp/" style="color:#b8912e;">https://mirinae.jp/</a></p>
</body></html>`;

  try {
    await t.sendMail({
      from: getFormMailFrom(gmailUser),
      to,
      subject,
      html,
    });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

/**
 * 公開フォーム（trial / syutyu / netlesson 等）からの送信を Gmail SMTP で通知。
 * FORM_NOTIFY_TO（未設定時は GMAIL_USER、さらに未設定時は mirinae@kaonnuri.com）
 */
export async function sendPublicFormNotification(
  data: Record<string, string>
): Promise<{ ok: boolean; error?: string }> {
  const gmailUser = process.env.GMAIL_USER?.trim();
  const t = getPublicFormTransporter();
  if (!t || !gmailUser) {
    return { ok: false, error: "GMAIL_USER / GMAIL_APP_PASSWORD is not set" };
  }

  const to =
    process.env.FORM_NOTIFY_TO?.trim() || gmailUser || "mirinae@kaonnuri.com";
  const subject = data._subject?.trim() || "【ミリネ韓国語】お問い合わせ";

  const replyTo = resolveReplyTo(data);

  const skip = new Set(["_next", "_captcha", "_honey", "_subject", "_replyto", "website"]);
  const rows: string[] = [];
  if (data._url) {
    rows.push(
      `<tr><th style="text-align:left;padding:8px;border:1px solid #e5e5e5;vertical-align:top;">送信元ページ</th><td style="padding:8px;border:1px solid #e5e5e5;">${escapeHtml(data._url)}</td></tr>`
    );
  }
  for (const [k, v] of Object.entries(data)) {
    if (skip.has(k) || k === "_url") continue;
    rows.push(
      `<tr><th style="text-align:left;padding:8px;border:1px solid #e5e5e5;vertical-align:top;">${escapeHtml(k)}</th><td style="padding:8px;border:1px solid #e5e5e5;white-space:pre-wrap;">${escapeHtml(v)}</td></tr>`
    );
  }

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:sans-serif;font-size:14px;color:#333;"><p style="margin:0 0 12px;">公開フォームからの送信です。</p><table style="border-collapse:collapse;width:100%;max-width:640px;">${rows.join("")}</table></body></html>`;

  try {
    await t.sendMail({
      from: getFormMailFrom(gmailUser),
      to,
      subject,
      replyTo: replyTo || undefined,
      html,
    });

    const applicant = resolveApplicantEmail(data);
    if (applicant) {
      const conf = await sendApplicantConfirmationEmail(applicant, data);
      if (!conf.ok) {
        console.error("[public-form] applicant confirmation failed:", conf.error);
      }
    }

    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

export async function sendOtpEmail(to: string, otp: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return false;

  const from = process.env.RESEND_FROM?.trim() || "Mirinae <onboarding@resend.dev>";

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      subject: "【ミリネ韓国語】管理画面ログイン用コード",
      html: `
        <p>管理画面ログイン用の確認コードです。</p>
        <p style="font-size:24px;font-weight:bold;letter-spacing:4px;">${otp}</p>
        <p style="color:#666;font-size:12px;">このコードは5分間有効です。心当たりがない場合は無視してください。</p>
      `,
    });
    return !error;
  } catch {
    return false;
  }
}
