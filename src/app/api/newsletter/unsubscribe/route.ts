import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifySubscriberUnsub } from "@/lib/newsletter/template";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const sid = req.nextUrl.searchParams.get("sid")?.trim() ?? "";
  const sig = req.nextUrl.searchParams.get("s")?.trim() ?? "";

  if (!sid || !sig || !verifySubscriberUnsub(sid, sig)) {
    return NextResponse.redirect(
      new URL("/newsletter/error?e=invalid", req.nextUrl.origin),
      303
    );
  }

  await prisma.newsletterSubscriber.updateMany({
    where: { id: sid },
    data: {
      status: "unsubscribed",
      unsubscribedAt: new Date(),
      updatedAt: new Date(),
    },
  });

  return NextResponse.redirect(
    new URL("/newsletter/unsubscribed", req.nextUrl.origin),
    303
  );
}
