import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type CategoryInput = { value: string; label: string; color?: string; sortOrder?: number };

// GET — カテゴリ一覧
export async function GET() {
  const list = await prisma.scheduleCategory.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(list);
}

// POST — 新規作成
export async function POST(req: NextRequest) {
  const body = (await req.json()) as CategoryInput;
  const { value, label, color, sortOrder } = body;
  if (!value?.trim() || !label?.trim()) {
    return NextResponse.json({ error: "value, label required" }, { status: 400 });
  }
  const created = await prisma.scheduleCategory.create({
    data: {
      value: value.trim(),
      label: label.trim(),
      color: color?.trim() || "#e5e7eb",
      sortOrder: typeof sortOrder === "number" ? sortOrder : 0,
    },
  });
  return NextResponse.json(created);
}

// PUT — 更新
export async function PUT(req: NextRequest) {
  const body = (await req.json()) as CategoryInput & { id: string };
  const { id, value, label, color, sortOrder } = body;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const data: { value?: string; label?: string; color?: string; sortOrder?: number } = {};
  if (value !== undefined) data.value = value.trim();
  if (label !== undefined) data.label = label.trim();
  if (color !== undefined) data.color = color?.trim() || "#e5e7eb";
  if (typeof sortOrder === "number") data.sortOrder = sortOrder;
  const updated = await prisma.scheduleCategory.update({
    where: { id },
    data,
  });
  return NextResponse.json(updated);
}

// DELETE — 削除
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await prisma.scheduleCategory.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
