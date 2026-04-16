import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdminRequest } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const scope = searchParams.get("scope") || "all";

  const where =
    scope === "scheduled"
      ? { status: { in: ["scheduled", "sending"] } }
      : scope === "history"
        ? {
            status: { in: ["sent", "failed", "canceled"] },
          }
        : {};

  const items = await prisma.newsletterCampaign.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 200,
    select: {
      id: true,
      subject: true,
      status: true,
      scheduledAt: true,
      sentAt: true,
      totalTargetCount: true,
      sentCount: true,
      failedCount: true,
      openCount: true,
      uniqueOpenCount: true,
      clickCount: true,
      uniqueClickCount: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const subject = String(body?.subject ?? "").trim();
  const bodyHtml = String(body?.bodyHtml ?? "").trim();

  if (!subject || !bodyHtml) {
    return NextResponse.json(
      { error: "subject and bodyHtml required" },
      { status: 400 }
    );
  }

  const c = await prisma.newsletterCampaign.create({
    data: {
      subject,
      preheader: body?.preheader?.trim() || null,
      bodyHtml,
      ctaLabel: body?.ctaLabel?.trim() || null,
      ctaUrl: body?.ctaUrl?.trim() || null,
      status: "draft",
      createdBy: "admin",
    },
  });

  return NextResponse.json(c);
}
