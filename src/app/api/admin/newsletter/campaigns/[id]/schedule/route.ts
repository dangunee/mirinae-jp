import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdminRequest } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const iso = String(body?.scheduledAt ?? "").trim();
  const d = new Date(iso);
  if (Number.isNaN(d.getTime()) || d.getTime() < Date.now() - 60_000) {
    return NextResponse.json(
      { error: "scheduledAt must be a future ISO datetime" },
      { status: 400 }
    );
  }

  const c = await prisma.newsletterCampaign.findUnique({ where: { id } });
  if (!c) return NextResponse.json({ error: "not found" }, { status: 404 });
  if (c.status !== "draft") {
    return NextResponse.json({ error: "only draft can be scheduled" }, { status: 400 });
  }

  const updated = await prisma.newsletterCampaign.update({
    where: { id },
    data: {
      status: "scheduled",
      scheduledAt: d,
      updatedAt: new Date(),
    },
  });

  return NextResponse.json(updated);
}
