import { Resend } from "resend";

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
