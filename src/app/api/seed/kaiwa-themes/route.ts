import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// 会話クラス「主なテーマ例」— 短期集中と同じ SiteTable 形式で保存
// 初中級・中級1・中級2・上級の4タブ

type KaiwaThemeRow = { themes: string };

const KAIWA_BLOCKS: { blockKey: string; title: string; rows: KaiwaThemeRow[] }[] = [
  {
    blockKey: "curriculum_kaiwa_shuchukyu",
    title: "初中級",
    rows: [{ themes: "初対面の挨拶・自己紹介／余暇・趣味／旅行／家族／ニュース など" }],
  },
  {
    blockKey: "curriculum_kaiwa_chukyu1",
    title: "中級1",
    rows: [{ themes: "韓国語の勉強／私について／結婚式・結婚文化 など" }],
  },
  {
    blockKey: "curriculum_kaiwa_chukyu2",
    title: "中級2",
    rows: [{ themes: "気分転換／映画・スマートフォン／日常の出来事 など" }],
  },
  {
    blockKey: "curriculum_kaiwa_jokyu",
    title: "上級",
    rows: [{ themes: "職場の人間関係／育児・教育／お金・老後設計／韓国社会のニュース・時事問題 など" }],
  },
];

const PAGE_SLUG = "kaiwa";

export async function POST() {
  for (const { blockKey, title, rows } of KAIWA_BLOCKS) {
    await prisma.siteTable.upsert({
      where: { pageSlug_blockKey: { pageSlug: PAGE_SLUG, blockKey } },
      create: { pageSlug: PAGE_SLUG, blockKey, title, rowsJson: JSON.stringify(rows) },
      update: { title, rowsJson: JSON.stringify(rows) },
    });
  }
  return NextResponse.json({
    ok: true,
    message: "会話クラス主なテーマ例（初中級・中級1・中級2・上級）を登録しました。",
  });
}
