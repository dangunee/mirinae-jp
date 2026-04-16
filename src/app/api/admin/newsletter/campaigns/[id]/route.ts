import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdminRequest } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  if (!(await isAdminRequest(_req))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const c = await prisma.newsletterCampaign.findUnique({ where: { id } });
  if (!c) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(c);
}

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const c = await prisma.newsletterCampaign.findUnique({ where: { id } });
  if (!c) return NextResponse.json({ error: "not found" }, { status: 404 });
  if (!["draft", "scheduled"].includes(c.status)) {
    return NextResponse.json({ error: "readonly" }, { status: 400 });
  }

  const body = await req.json().catch(() => ({}));
  const updated = await prisma.newsletterCampaign.update({
    where: { id },
    data: {
      ...(body.subject != null ? { subject: String(body.subject).trim() } : {}),
      ...(body.preheader !== undefined
        ? { preheader: body.preheader?.trim() || null }
        : {}),
      ...(body.bodyHtml != null
        ? { bodyHtml: String(body.bodyHtml).trim() }
        : {}),
      ...(body.ctaLabel !== undefined
        ? { ctaLabel: body.ctaLabel?.trim() || null }
        : {}),
      ...(body.ctaUrl !== undefined
        ? { ctaUrl: body.ctaUrl?.trim() || null }
        : {}),
      updatedAt: new Date(),
    },
  });

  return NextResponse.json(updated);
}
