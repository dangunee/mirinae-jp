import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export type RecurringEvent = {
  dow: number;
  label: string;
  cat: string;
  time: string;
  detail: string;
  url: string;
  biweekly?: boolean;
  biweeklyStartDate?: string;
};

export type SingleEvent = {
  date: string;
  label: string;
  cat: string;
  time: string;
  detail: string;
  url: string;
};

export type ScheduleResponse = {
  recurring: RecurringEvent[];
  single: SingleEvent[];
};

// GET /api/schedule — メインページ用（公開）
export async function GET() {
  const list = await prisma.scheduleEvent.findMany({
    orderBy: [{ eventType: "asc" }, { sortOrder: "asc" }, { dow: "asc" }, { date: "asc" }],
  });
  const recurring: RecurringEvent[] = [];
  const single: SingleEvent[] = [];
  for (const e of list) {
    const item = {
      label: e.label,
      cat: e.cat,
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
      });
    } else if (e.eventType === "single" && e.date) {
      single.push({ ...item, date: e.date });
    }
  }
  return NextResponse.json({ recurring, single });
}
