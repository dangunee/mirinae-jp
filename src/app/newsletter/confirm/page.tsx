import { redirect } from "next/navigation";

/** メール内リンク用（/newsletter/confirm?t=... → API で検証して Thanks へ） */
export default function NewsletterConfirmLanding({
  searchParams,
}: {
  searchParams: { t?: string };
}) {
  const t = searchParams.t?.trim();
  if (!t) redirect("/newsletter/error?e=missing");
  redirect(`/api/newsletter/confirm?t=${encodeURIComponent(t)}`);
}
