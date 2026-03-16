import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import type { CurriculumTheme } from "../route";

const THEMES_BLOCK_KEY = "curriculum_themes";
const PAGE_SLUG = "kojin";

const DEFAULT_THEMES: CurriculumTheme[] = [
  { slug: "phon", name: "発音", color: "#2d7a6e", bgColor: "#e8f5f3" },
  { slug: "vocab", name: "語彙", color: "#b06a00", bgColor: "#fff3e0" },
  { slug: "bunpou", name: "文法", color: "#b06a00", bgColor: "#fff3e0" },
  { slug: "single", name: "単語", color: "#b06a00", bgColor: "#fff3e0" },
  { slug: "expr", name: "表現", color: "#b06a00", bgColor: "#fff3e0" },
  { slug: "conv", name: "抑揚", color: "#3d6b8a", bgColor: "#e8f0f8" },
  { slug: "listen", name: "聴解", color: "#6b4a8a", bgColor: "#f3e8f5" },
  { slug: "ondoku", name: "音読", color: "#6b4a8a", bgColor: "#f3e8f5" },
  { slug: "kaiwa", name: "会話", color: "#3d6b8a", bgColor: "#e8f0f8" },
  { slug: "write", name: "作文", color: "#7a6a00", bgColor: "#fef9e0" },
  { slug: "summary", name: "総まとめ", color: "#b06a00", bgColor: "#fff3e0" },
  { slug: "end", name: "修了", color: "#b8924a", bgColor: "#f7f0e3" },
];

function parseThemesJson(json: string | null): CurriculumTheme[] {
  if (!json) return [];
  try {
    const raw = JSON.parse(json) as unknown;
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

// GET /api/curriculum/themes
// kojin用テーマ: 常にDBから直接取得（キャッシュ・スナップショットなし）
export async function GET() {
  const row = await prisma.siteTable.findUnique({
    where: {
      pageSlug_blockKey: { pageSlug: PAGE_SLUG, blockKey: THEMES_BLOCK_KEY },
    },
  });
  const themes = row ? parseThemesJson(row.rowsJson) : DEFAULT_THEMES;
  return NextResponse.json(themes, {
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate, max-age=0",
      "Pragma": "no-cache",
      "Expires": "0",
    },
  });
}

// POST /api/curriculum/themes — save themes array
export async function POST(req: NextRequest) {
  const body = (await req.json()) as CurriculumTheme[];
  if (!Array.isArray(body)) {
    return NextResponse.json({ error: "themes array required" }, { status: 400 });
  }
  const themes = body.map((t) => ({
    slug: String(t.slug || "").trim() || "theme",
    name: String(t.name ?? "").trim(),
    color: String(t.color ?? "#333").trim(),
    bgColor: String(t.bgColor ?? "#f0f0f0").trim(),
  }));
  const rowsJson = JSON.stringify(themes);
  await prisma.siteTable.upsert({
    where: {
      pageSlug_blockKey: { pageSlug: PAGE_SLUG, blockKey: THEMES_BLOCK_KEY },
    },
    create: { pageSlug: PAGE_SLUG, blockKey: THEMES_BLOCK_KEY, title: "テーマ", rowsJson },
    update: { rowsJson },
  });
  return NextResponse.json(themes);
}
