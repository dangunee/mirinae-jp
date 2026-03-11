import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const CACHE_TTL_MS = 60 * 1000; // 1分
let curriculumCache: { data: CurriculumBlock[]; ts: number } | null = null;

function invalidateCurriculumCache() {
  curriculumCache = null;
}

export type CurriculumBlock = {
  id: string;
  pageSlug: string;
  blockKey: string;
  title: string | null;
  rows: (CurriculumRow | GroupCurriculumRow | KaiwaThemeRow)[];
};

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

/** グループ文法カリキュラム行（回数・時限・項目・概要・日程） */
export type GroupCurriculumRow = {
  kaisu: string;
  jigen: string;
  koumoku: string;
  shosai: string;
  nittei?: string;
};

/** 会話クラス主なテーマ例行（1行1テーマ、50行/レベル） */
export type KaiwaThemeRow = { theme?: string; themes?: string };

/** カリキュラム表示用テーマ（タグのラベル・色） */
export type CurriculumTheme = {
  slug: string;
  name: string;
  color: string;
  bgColor: string;
};

function parseRowsJson(
  rowsJson: string
): (CurriculumRow | GroupCurriculumRow | KaiwaThemeRow)[] {
  try {
    const raw = JSON.parse(rowsJson) as unknown;
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

// GET /api/curriculum?page=kojin（1分キャッシュ・POSTで無効化）
export async function GET(req: NextRequest) {
  const page = req.nextUrl.searchParams.get("page");
  if (!page) {
    return NextResponse.json({ error: "page required" }, { status: 400 });
  }
  if (page === "kojin" && curriculumCache && Date.now() - curriculumCache.ts < CACHE_TTL_MS) {
    return NextResponse.json(curriculumCache.data);
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
  if (page === "kojin") {
    curriculumCache = { data: result, ts: Date.now() };
  }
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
    rows: (CurriculumRow | GroupCurriculumRow | KaiwaThemeRow)[];
  };
  if (!pageSlug || !blockKey || !Array.isArray(rows)) {
    return NextResponse.json({ error: "pageSlug, blockKey, rows required" }, { status: 400 });
  }
  const rowsJson = JSON.stringify(rows);
  invalidateCurriculumCache();
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
