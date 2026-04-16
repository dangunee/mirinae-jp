import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdminRequest } from "@/lib/admin-auth";
import { startCampaignSend } from "@/lib/newsletter/send-queue";

export const runtime = "nodejs";

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const result = await startCampaignSend(id);
  if (!result.ok) {
    return NextResponse.json(
      { error: result.message || "send_failed" },
      { status: 400 }
    );
  }

  const c = await prisma.newsletterCampaign.findUnique({ where: { id } });
  return NextResponse.json({ ok: true, campaign: c });
}
