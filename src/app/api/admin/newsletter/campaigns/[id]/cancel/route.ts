import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdminRequest } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const c = await prisma.newsletterCampaign.findUnique({ where: { id } });
  if (!c) return NextResponse.json({ error: "not found" }, { status: 404 });
  if (c.status !== "scheduled") {
    return NextResponse.json({ error: "only scheduled can be canceled" }, { status: 400 });
  }

  const updated = await prisma.newsletterCampaign.update({
    where: { id },
    data: {
      status: "canceled",
      scheduledAt: null,
      updatedAt: new Date(),
    },
  });

  return NextResponse.json(updated);
}
