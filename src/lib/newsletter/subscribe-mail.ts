import { getNewsletterResend, newsletterFromAddress } from "@/lib/newsletter/resend-mail";
import { getPublicSiteUrl } from "@/lib/site-url";

export async function sendDoubleOptInEmail(
  email: string,
  rawToken: string
): Promise<boolean> {
  const resend = getNewsletterResend();
  if (!resend) return false;

  const base = getPublicSiteUrl();
  const link = `${base}/newsletter/confirm?t=${encodeURIComponent(rawToken)}`;

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:Meiryo,sans-serif;font-size:15px;color:#333;line-height:1.8;">
<p>ミリネ韓国語教室メールマガジンへのご登録ありがとうございます。</p>
<p>次のリンクをクリックして登録を完了してください（有効期限：7日間）。</p>
<p><a href="${link}" style="color:#b8912e;font-weight:bold;">登録を完了する</a></p>
<p style="font-size:12px;color:#888;">心当たりがない場合はこのメールを破棄してください。</p>
</body></html>`;

  try {
    const { error } = await resend.emails.send({
      from: newsletterFromAddress(),
      to: email,
      subject: "【ミリネ韓国語教室】メールマガジン登録の確認",
      html,
    });
    return !error;
  } catch {
    return false;
  }
}
