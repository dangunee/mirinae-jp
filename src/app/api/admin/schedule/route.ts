import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type ScheduleEventInput = {
  eventType: "recurring" | "single";
  label: string;
  cat: string;
  categoryLabel?: string | null;
  time?: string | null;
  detail?: string | null;
  url?: string | null;
  dow?: number | null;
  biweekly?: boolean;
  biweeklyStartDate?: string | null;
  monthlyWeeks?: string | null;
  endDate?: string | null;
  date?: string | null;
  sortOrder?: number;
};

// GET /api/admin/schedule — 管理用一覧
export async function GET() {
  const list = await prisma.scheduleEvent.findMany({
    orderBy: [{ eventType: "asc" }, { sortOrder: "asc" }, { dow: "asc" }, { date: "asc" }],
  });
  return NextResponse.json(list);
}

// POST /api/admin/schedule — 新規作成
export async function POST(req: NextRequest) {
  const body = (await req.json()) as ScheduleEventInput;
  const { eventType, label, cat, categoryLabel, time, detail, url, dow, biweekly, biweeklyStartDate, monthlyWeeks, endDate, date, sortOrder } = body;
  if (!eventType || !label?.trim() || !cat?.trim()) {
    return NextResponse.json({ error: "eventType, label, cat required" }, { status: 400 });
  }
  if (eventType === "recurring" && (dow === undefined || dow === null)) {
    return NextResponse.json({ error: "dow required for recurring" }, { status: 400 });
  }
  if (eventType === "single" && !date?.trim()) {
    return NextResponse.json({ error: "date required for single" }, { status: 400 });
  }
  const data = {
    eventType,
    label: label.trim(),
    cat: cat.trim(),
    categoryLabel: categoryLabel?.trim() || null,
    time: time?.trim() || null,
    detail: detail?.trim() || null,
    url: url?.trim() || null,
    dow: eventType === "recurring" ? dow : null,
    biweekly: eventType === "recurring" ? !!biweekly : false,
    biweeklyStartDate: eventType === "recurring" && biweeklyStartDate
      ? new Date(biweeklyStartDate)
      : null,
    monthlyWeeks: eventType === "recurring" && monthlyWeeks?.trim() ? monthlyWeeks.trim() : null,
    endDate: eventType === "recurring" && endDate?.trim() ? endDate.trim() : null,
    date: eventType === "single" ? date?.trim() : null,
    sortOrder: typeof sortOrder === "number" ? sortOrder : 0,
  };
  const created = await prisma.scheduleEvent.create({ data });
  return NextResponse.json(created);
}

// PUT /api/admin/schedule — 更新
export async function PUT(req: NextRequest) {
  const body = (await req.json()) as ScheduleEventInput & { id: string };
  const { id, eventType, label, cat, categoryLabel, time, detail, url, dow, biweekly, biweeklyStartDate, monthlyWeeks, endDate, date, sortOrder } = body;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const data: Record<string, unknown> = {
    eventType: eventType || "recurring",
    label: label?.trim() || "",
    cat: cat?.trim() || "",
    time: time?.trim() || null,
    detail: detail?.trim() || null,
    url: url?.trim() || null,
    dow: eventType === "recurring" ? (dow ?? null) : null,
    biweekly: eventType === "recurring" ? !!biweekly : false,
    biweeklyStartDate: eventType === "recurring" && biweekly && biweeklyStartDate ? new Date(biweeklyStartDate) : null,
    monthlyWeeks: eventType === "recurring" && monthlyWeeks?.trim() ? monthlyWeeks.trim() : null,
    endDate: eventType === "recurring" && endDate?.trim() ? endDate.trim() : null,
    date: eventType === "single" ? (date?.trim() || null) : null,
    sortOrder: typeof sortOrder === "number" ? sortOrder : 0,
  };
  if (categoryLabel !== undefined) data.categoryLabel = categoryLabel?.trim() || null;
  const updated = await prisma.scheduleEvent.update({
    where: { id },
    data,
  });
  return NextResponse.json(updated);
}

// DELETE /api/admin/schedule — 削除
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await prisma.scheduleEvent.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
