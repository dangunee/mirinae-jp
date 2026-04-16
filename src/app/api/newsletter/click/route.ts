import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyTracking } from "@/lib/newsletter/tracking";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const d = req.nextUrl.searchParams.get("d")?.trim() ?? "";
  const u = req.nextUrl.searchParams.get("u")?.trim() ?? "";
  const s = req.nextUrl.searchParams.get("s")?.trim() ?? "";

  let target = "https://mirinae.jp/";
  try {
    if (u) {
      const decoded = Buffer.from(u, "base64url").toString("utf8");
      if (decoded.startsWith("http://") || decoded.startsWith("https://")) {
        target = decoded;
      }
    }
  } catch {
    /* keep default */
  }

  if (!d || !verifyTracking(d, s)) {
    return NextResponse.redirect(target, 302);
  }

  try {
    const delivery = await prisma.newsletterCampaignDelivery.findUnique({
      where: { id: d },
    });

    if (delivery && delivery.deliveryStatus === "sent") {
      const first = !delivery.firstClickedAt;
      await prisma.newsletterCampaignDelivery.update({
        where: { id: d },
        data: {
          firstClickedAt: delivery.firstClickedAt ?? new Date(),
          clickCount: { increment: 1 },
          updatedAt: new Date(),
        },
      });
      await prisma.newsletterCampaign.update({
        where: { id: delivery.campaignId },
        data: {
          clickCount: { increment: 1 },
          ...(first ? { uniqueClickCount: { increment: 1 } } : {}),
        },
      });
    }
  } catch {
    /* still redirect */
  }

  return NextResponse.redirect(target, 302);
}
