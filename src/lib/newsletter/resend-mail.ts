import { Resend } from "resend";

export function getNewsletterResend(): Resend | null {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return null;
  return new Resend(key);
}

/** From address for newsletter / subscribe / transactional (Resend). */
export function newsletterFromAddress(): string {
  return (
    process.env.NEWSLETTER_RESEND_FROM?.trim() ||
    process.env.RESEND_FROM?.trim() ||
    "Mirinae <onboarding@resend.dev>"
  );
}
