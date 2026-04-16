import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdminRequest } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const take = Math.min(Number(searchParams.get("take") || 100), 500);
  const skip = Math.max(Number(searchParams.get("skip") || 0), 0);
  const q = searchParams.get("q")?.trim();

  const where = q
    ? {
        email: { contains: q, mode: "insensitive" as const },
      }
    : {};

  const [items, total] = await Promise.all([
    prisma.newsletterSubscriber.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take,
      skip,
      select: {
        id: true,
        email: true,
        name: true,
        status: true,
        source: true,
        confirmedAt: true,
        unsubscribedAt: true,
        createdAt: true,
      },
    }),
    prisma.newsletterSubscriber.count({ where }),
  ]);

  return NextResponse.json({ items, total, take, skip });
}
