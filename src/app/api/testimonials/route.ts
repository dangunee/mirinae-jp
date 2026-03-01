import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export type TestimonialRow = { header: string; content: string };
export type TestimonialsBlock = {
  id: string;
  pageSlug: string;
  blockKey: string;
  title: string | null;
  rows: TestimonialRow[];
};

function parseRows(rowsJson: string): TestimonialRow[] {
  try {
    const raw = JSON.parse(rowsJson) as unknown;
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

// GET /api/testimonials?page=kojin
export async function GET(req: NextRequest) {
  const page = req.nextUrl.searchParams.get("page");
  if (!page) return NextResponse.json({ error: "page required" }, { status: 400 });
  const blocks = await prisma.siteTable.findMany({
    where: {
      pageSlug: page,
      blockKey: { startsWith: "testimonials_" },
    },
    orderBy: { blockKey: "asc" },
  });
  const result: TestimonialsBlock[] = blocks.map((b) => ({
    id: b.id,
    pageSlug: b.pageSlug,
    blockKey: b.blockKey,
    title: b.title,
    rows: parseRows(b.rowsJson),
  }));
  return NextResponse.json(result);
}

// POST /api/testimonials — upsert one block
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { id, pageSlug, blockKey, title, rows } = body as {
    id?: string;
    pageSlug: string;
    blockKey: string;
    title?: string | null;
    rows: TestimonialRow[];
  };
  if (!pageSlug || !blockKey || !blockKey.startsWith("testimonials_")) {
    return NextResponse.json(
      { error: "pageSlug and blockKey (testimonials_*) required" },
      { status: 400 }
    );
  }
  if (!Array.isArray(rows)) {
    return NextResponse.json({ error: "rows array required" }, { status: 400 });
  }
  const rowsJson = JSON.stringify(rows);
  if (id) {
    const updated = await prisma.siteTable.update({
      where: { id },
      data: { title: title ?? null, rowsJson },
    });
    return NextResponse.json(updated);
  }
  const created = await prisma.siteTable.upsert({
    where: { pageSlug_blockKey: { pageSlug, blockKey } },
    create: { pageSlug, blockKey, title: title ?? null, rowsJson },
    update: { title: title ?? null, rowsJson },
  });
  return NextResponse.json(created);
}
