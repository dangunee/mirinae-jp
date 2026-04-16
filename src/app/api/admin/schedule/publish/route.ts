import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdminRequest } from "@/lib/admin-auth";

/**
 * POST /api/admin/schedule/publish
 * 現在のスケジュールを公開スナップショットに保存。
 * フロントページはこのスナップショットを読む（DB直接参照しない）
 */
export async function POST(req: NextRequest) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const [list, categories] = await Promise.all([
      prisma.scheduleEvent.findMany({
        orderBy: [{ eventType: "asc" }, { sortOrder: "asc" }, { dow: "asc" }, { date: "asc" }],
      }),
      prisma.scheduleCategory.findMany({ orderBy: { sortOrder: "asc" } }),
    ]);

    const recurring: Array<{
      dow: number;
      label: string;
      cat: string;
      categoryLabel?: string | null;
      time: string;
      detail: string;
      url: string;
      biweekly?: boolean;
      biweeklyStartDate?: string;
      monthlyWeeks?: string | null;
      endDate?: string | null;
    }> = [];
    const single: Array<{
      date: string;
      label: string;
      cat: string;
      categoryLabel?: string | null;
      time: string;
      detail: string;
      url: string;
    }> = [];
    const categoryMap = categories.map((c) => ({ value: c.value, label: c.label, color: c.color }));

    for (const e of list) {
      const item = {
        label: e.label,
        cat: e.cat,
        categoryLabel: e.categoryLabel || null,
        time: e.time || "",
        detail: e.detail || "",
        url: e.url || "",
      };
      if (e.eventType === "recurring" && e.dow !== null) {
        recurring.push({
          ...item,
          dow: e.dow,
          biweekly: e.biweekly,
          biweeklyStartDate: e.biweeklyStartDate?.toISOString().slice(0, 10),
          monthlyWeeks: e.monthlyWeeks || null,
          endDate: e.endDate || null,
        });
      } else if (e.eventType === "single" && e.date) {
        single.push({ ...item, date: e.date });
      }
    }

    const data = { recurring, single, categories: categoryMap };
    const dataJson = JSON.stringify(data);

    await prisma.schedulePublished.upsert({
      where: { id: "schedule" },
      create: { id: "schedule", dataJson },
      update: { dataJson },
    });

    return NextResponse.json({
      ok: true,
      message: "フロントページに反映しました",
      recurring: recurring.length,
      single: single.length,
    });
  } catch (e) {
    const err = e as { code?: string; message?: string };
    if (err?.message?.includes("schedule_published") || err?.message?.includes("column")) {
      return NextResponse.json(
        { error: "DBスキーマを適用してください。（DBスキーマ適用ボタン）" },
        { status: 500 }
      );
    }
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
