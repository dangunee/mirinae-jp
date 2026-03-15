import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const DEFAULT_CATEGORIES = [
  { value: "cat-tsushin", label: "通信講座", color: "#2563eb", sortOrder: 0 },
  { value: "cat-jokyu", label: "上級・会話強化", color: "#0891b2", sortOrder: 1 },
  { value: "cat-group", label: "グループレッスン", color: "#7c3aed", sortOrder: 2 },
  { value: "cat-kojin", label: "個人レッスン", color: "#059669", sortOrder: 3 },
  { value: "cat-special", label: "集中・特別講座", color: "#dc2626", sortOrder: 4 },
];

// POST /api/seed/schedule/categories — カテゴリ初期データ登録
export async function POST() {
  try {
    const count = await prisma.scheduleCategory.count();
    if (count > 0) {
      return NextResponse.json({ message: "既にカテゴリがあります。", count }, { status: 200 });
    }
    for (const c of DEFAULT_CATEGORIES) {
      await prisma.scheduleCategory.create({ data: c });
    }
    return NextResponse.json({ message: "カテゴリを登録しました。", count: DEFAULT_CATEGORIES.length });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
