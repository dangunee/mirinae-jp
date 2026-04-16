import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyTracking } from "@/lib/newsletter/tracking";

export const runtime = "nodejs";

/** 1x1 open tracking pixel */
export async function GET(req: NextRequest) {
  const d = req.nextUrl.searchParams.get("d")?.trim() ?? "";
  const s = req.nextUrl.searchParams.get("s")?.trim() ?? "";

  if (!d || !verifyTracking(d, s)) {
    return pixel();
  }

  try {
    const delivery = await prisma.newsletterCampaignDelivery.findUnique({
      where: { id: d },
      include: { campaign: true },
    });

    if (delivery && delivery.deliveryStatus === "sent") {
      const first = !delivery.firstOpenedAt;
      await prisma.newsletterCampaignDelivery.update({
        where: { id: d },
        data: {
          firstOpenedAt: delivery.firstOpenedAt ?? new Date(),
          openCount: { increment: 1 },
          updatedAt: new Date(),
        },
      });
      await prisma.newsletterCampaign.update({
        where: { id: delivery.campaignId },
        data: {
          openCount: { increment: 1 },
          ...(first ? { uniqueOpenCount: { increment: 1 } } : {}),
        },
      });
    }
  } catch {
    /* ignore */
  }

  return pixel();
}

function pixel(): Response {
  const buf = Buffer.from(
    "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
    "base64"
  );
  return new Response(buf, {
    status: 200,
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
