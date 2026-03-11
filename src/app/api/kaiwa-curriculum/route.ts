import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const LEVEL_KEYS = ["shochukyu", "chukyu1", "chukyu2", "jokyu"] as const;

export type KaiwaTheme = {
  id: string;
  levelKey: string;
  rowOrder: number;
  theme: string;
};

// GET /api/kaiwa-curriculum — レベル別カリキュラム取得
export async function GET(req: NextRequest) {
  const level = req.nextUrl.searchParams.get("level");
  const items = await prisma.kaiwaCurriculum.findMany({
    where: level && LEVEL_KEYS.includes(level as (typeof LEVEL_KEYS)[number]) ? { levelKey: level } : undefined,
    orderBy: [{ levelKey: "asc" }, { rowOrder: "asc" }],
  });
  const byLevel: Record<string, KaiwaTheme[]> = {};
  for (const k of LEVEL_KEYS) {
    byLevel[k] = [];
  }
  for (const r of items) {
    byLevel[r.levelKey].push({
      id: r.id,
      levelKey: r.levelKey,
      rowOrder: r.rowOrder,
      theme: r.theme,
    });
  }
  return NextResponse.json(byLevel);
}

// POST /api/kaiwa-curriculum — 一括更新（レベル・行ごと）
export async function POST(req: NextRequest) {
  const body = (await req.json()) as {
    levelKey: string;
    themes: string[];
  };
  const { levelKey, themes } = body;
  if (!LEVEL_KEYS.includes(levelKey as (typeof LEVEL_KEYS)[number]) || !Array.isArray(themes)) {
    return NextResponse.json({ error: "levelKey and themes[] required" }, { status: 400 });
  }
  await prisma.$transaction(async (tx) => {
    await tx.kaiwaCurriculum.deleteMany({ where: { levelKey } });
    for (let i = 0; i < themes.length; i++) {
      await tx.kaiwaCurriculum.create({
        data: { levelKey, rowOrder: i + 1, theme: String(themes[i] ?? "").trim() },
      });
    }
  });
  return NextResponse.json({ ok: true });
}
