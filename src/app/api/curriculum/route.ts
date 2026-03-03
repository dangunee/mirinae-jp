import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export type CurriculumRow = {
  koma: string;
  c12: string;
  c24: string;
  c48: string;
  /** 短期集中: 12コマ列のテーマ（発音・文法・語彙など）slug */
  theme12?: string;
  theme24?: string;
  theme48?: string;
  cellGreen?: number[]; // 1-based column index: [2] = 12コマに cell-green
  cellComplete?: number[];
};

/** カリキュラム表示用テーマ（タグのラベル・色） */
export type CurriculumTheme = {
  slug: string;
  name: string;
  color: string;
  bgColor: string;
};

export type CurriculumBlock = {
  id: string;
  pageSlug: string;
  blockKey: string;
  title: string | null;
  rows: CurriculumRow[];
};

function parseRowsJson(rowsJson: string): CurriculumRow[] {
  try {
    const raw = JSON.parse(rowsJson) as unknown;
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

// GET /api/curriculum?page=kojin
export async function GET(req: NextRequest) {
  const page = req.nextUrl.searchParams.get("page");
  if (!page) {
    return NextResponse.json({ error: "page required" }, { status: 400 });
  }
  const blocks = await prisma.siteTable.findMany({
    where: { pageSlug: page },
    orderBy: [{ blockKey: "asc" }],
  });
  const result: CurriculumBlock[] = blocks.map((b) => ({
    id: b.id,
    pageSlug: b.pageSlug,
    blockKey: b.blockKey,
    title: b.title,
    rows: parseRowsJson(b.rowsJson),
  }));
  return NextResponse.json(result);
}

// POST /api/curriculum — create or update block
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { id, pageSlug, blockKey, title, rows } = body as {
    id?: string;
    pageSlug: string;
    blockKey: string;
    title?: string | null;
    rows: CurriculumRow[];
  };
  if (!pageSlug || !blockKey || !Array.isArray(rows)) {
    return NextResponse.json({ error: "pageSlug, blockKey, rows required" }, { status: 400 });
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
    where: {
      pageSlug_blockKey: { pageSlug, blockKey },
    },
    create: { pageSlug, blockKey, title: title ?? null, rowsJson },
    update: { title: title ?? null, rowsJson },
  });
  return NextResponse.json(created);
}
