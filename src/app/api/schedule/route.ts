import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export type RecurringEvent = {
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
};

export type SingleEvent = {
  date: string;
  label: string;
  cat: string;
  categoryLabel?: string | null;
  time: string;
  detail: string;
  url: string;
};

export type CategoryInfo = { value: string; label: string; color: string };

export type ScheduleResponse = {
  recurring: RecurringEvent[];
  single: SingleEvent[];
  categories: CategoryInfo[];
};

// GET /api/schedule — メインページ用（公開）
export async function GET() {
  const [list, categories] = await Promise.all([
    prisma.scheduleEvent.findMany({
      orderBy: [{ eventType: "asc" }, { sortOrder: "asc" }, { dow: "asc" }, { date: "asc" }],
    }),
    prisma.scheduleCategory.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);
  const recurring: RecurringEvent[] = [];
  const single: SingleEvent[] = [];
  const categoryMap: CategoryInfo[] = categories.map((c) => ({ value: c.value, label: c.label, color: c.color }));
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
  return NextResponse.json({ recurring, single, categories: categoryMap });
}
