import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const THEMES_BLOCK_KEY = "curriculum_themes";
const PAGE_SLUG_KOJIN = "kojin";

/**
 * POST /api/admin/curriculum/publish
 * body: { page: "kojin" | "group" | "kaiwa" | "special" }
 * 現在のカリキュラムを公開スナップショットに保存
 */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { page?: string };
    const page = body?.page;
    if (!page || !["kojin", "group", "kaiwa", "special"].includes(page)) {
      return NextResponse.json({ error: "page required (kojin, group, kaiwa, special)" }, { status: 400 });
    }

    const blocks = await prisma.siteTable.findMany({
      where: { pageSlug: page },
      orderBy: [{ blockKey: "asc" }],
    });

    const curriculumData = blocks.map((b) => ({
      id: b.id,
      pageSlug: b.pageSlug,
      blockKey: b.blockKey,
      title: b.title,
      rows: parseRows(b.rowsJson),
    }));

    // ブロック数 = site_table の kojin ページ全ブロック数（curriculum_shokyu/chukyu/jokyu + tanki_* + curriculum_themes 等）
    const curriculumBlocks = curriculumData.filter((b) =>
      ["curriculum_shokyu", "curriculum_chukyu", "curriculum_jokyu"].includes(b.blockKey)
    );

    await prisma.curriculumPublished.upsert({
      where: { id: `curriculum_${page}` },
      create: { id: `curriculum_${page}`, dataJson: JSON.stringify(curriculumData) },
      update: { dataJson: JSON.stringify(curriculumData) },
    });

    if (page === "kojin") {
      const themesRow = await prisma.siteTable.findUnique({
        where: {
          pageSlug_blockKey: { pageSlug: PAGE_SLUG_KOJIN, blockKey: THEMES_BLOCK_KEY },
        },
      });
      const themes = themesRow ? parseThemes(themesRow.rowsJson) : [];
      await prisma.curriculumPublished.upsert({
        where: { id: "themes_kojin" },
        create: { id: "themes_kojin", dataJson: JSON.stringify(themes) },
        update: { dataJson: JSON.stringify(themes) },
      });
    }

    const msg =
      page === "kojin"
        ? `フロントに反映しました（${page}）\n全ブロック数: ${curriculumData.length}（カリキュラム表: ${curriculumBlocks.length}）\n프론트 페이지를 새로고침하세요.`
        : `フロントに反映しました（${page}）\nブロック数: ${curriculumData.length}\n프론트 페이지를 새로고침하세요.`;
    return NextResponse.json({
      ok: true,
      message: msg,
      blocks: curriculumData.length,
    });
  } catch (e) {
    const err = e as { message?: string };
    if (err?.message?.includes("curriculum_published") || err?.message?.includes("column")) {
      return NextResponse.json(
        { error: "DBスキーマを適用してください。（DBスキーマ適用ボタン）" },
        { status: 500 }
      );
    }
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

function parseRows(rowsJson: string): unknown[] {
  try {
    const raw = JSON.parse(rowsJson) as unknown;
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

function parseThemes(json: string | null): unknown[] {
  if (!json) return [];
  try {
    const raw = JSON.parse(json) as unknown;
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}
