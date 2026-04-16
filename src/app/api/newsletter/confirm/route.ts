import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashToken } from "@/lib/newsletter/tokens";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get("t")?.trim() ?? "";
  if (!raw) {
    return NextResponse.redirect(
      new URL("/newsletter/error?e=missing", req.nextUrl.origin),
      303
    );
  }

  const tokenHash = hashToken(raw);
  const token = await prisma.newsletterSubscriptionToken.findUnique({
    where: { tokenHash },
    include: { subscriber: true },
  });

  if (
    !token ||
    token.purpose !== "confirm_subscription" ||
    token.expiresAt < new Date()
  ) {
    return NextResponse.redirect(
      new URL("/newsletter/error?e=expired", req.nextUrl.origin),
      303
    );
  }

  if (token.usedAt) {
    return NextResponse.redirect(
      new URL("/newsletter/confirmed?already=1", req.nextUrl.origin),
      303
    );
  }

  if (!token.subscriberId) {
    return NextResponse.redirect(
      new URL("/newsletter/error?e=data", req.nextUrl.origin),
      303
    );
  }

  await prisma.$transaction([
    prisma.newsletterSubscriber.update({
      where: { id: token.subscriberId },
      data: {
        status: "active",
        confirmedAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.newsletterSubscriptionToken.update({
      where: { id: token.id },
      data: { usedAt: new Date() },
    }),
  ]);

  return NextResponse.redirect(
    new URL("/newsletter/confirmed", req.nextUrl.origin),
    303
  );
}
