import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdminRequest } from "@/lib/admin-auth";
import { getNewsletterResend, newsletterFromAddress } from "@/lib/newsletter/resend-mail";
import { buildNewsletterHtml } from "@/lib/newsletter/template";

export const runtime = "nodejs";

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const resend = getNewsletterResend();
  if (!resend) {
    return NextResponse.json({ error: "RESEND_API_KEY missing" }, { status: 503 });
  }

  const body = await req.json().catch(() => ({}));
  const to = String(body?.to ?? "").trim();
  if (!to.includes("@")) {
    return NextResponse.json({ error: "valid 'to' email required" }, { status: 400 });
  }

  const campaign = await prisma.newsletterCampaign.findUnique({ where: { id } });
  if (!campaign) return NextResponse.json({ error: "not found" }, { status: 404 });

  const html = buildNewsletterHtml({
    subject: `[TEST] ${campaign.subject}`,
    preheader: campaign.preheader,
    bodyHtml: campaign.bodyHtml,
    ctaLabel: campaign.ctaLabel,
    ctaUrl: campaign.ctaUrl,
    deliveryId: `test-${campaign.id}`,
    subscriberId: "test",
  });

  const { error } = await resend.emails.send({
    from: newsletterFromAddress(),
    to,
    subject: `[TEST] ${campaign.subject}`,
    html,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
