import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdminRequest } from "@/lib/admin-auth";

// GET /api/admin/youtube — 管理用一覧
export async function GET(req: NextRequest) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const list = await prisma.youTubeVideo.findMany({
    orderBy: [{ sortOrder: "asc" }, { uploadDate: "desc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(list);
}

// POST /api/admin/youtube — 新規作成
export async function POST(req: NextRequest) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { videoId, title, category, description, seoSummary, duration, uploadDate, sortOrder } = body as {
    videoId: string;
    title: string;
    category?: string | null;
    description?: string | null;
    seoSummary?: string | null;
    duration?: string | null;
    uploadDate?: string | null;
    sortOrder?: number;
  };
  if (!videoId?.trim() || !title?.trim()) {
    return NextResponse.json({ error: "videoId, title required" }, { status: 400 });
  }
  const id = (videoId || "").replace(/^.*(?:youtube\.com\/watch\?v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11}).*$/, "$1") || videoId.trim();
  const created = await prisma.youTubeVideo.create({
    data: {
      videoId: id,
      title: title.trim(),
      category: category?.trim() || null,
      description: description?.trim() || null,
      seoSummary: seoSummary?.trim() || null,
      duration: duration?.trim() || null,
      uploadDate: uploadDate?.trim() || null,
      sortOrder: typeof sortOrder === "number" ? sortOrder : 0,
    },
  });
  return NextResponse.json(created);
}

// PUT /api/admin/youtube — 更新
export async function PUT(req: NextRequest) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { id, videoId, title, category, description, seoSummary, duration, uploadDate, sortOrder } = body as {
    id: string;
    videoId?: string;
    title?: string;
    category?: string | null;
    description?: string | null;
    seoSummary?: string | null;
    duration?: string | null;
    uploadDate?: string | null;
    sortOrder?: number;
  };
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const data: Record<string, unknown> = {};
  if (videoId !== undefined) {
    const extracted = (videoId || "").replace(/^.*(?:youtube\.com\/watch\?v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11}).*$/, "$1") || videoId.trim();
    data.videoId = extracted;
  }
  if (title !== undefined) data.title = title.trim();
  if (category !== undefined) data.category = category?.trim() || null;
  if (description !== undefined) data.description = description?.trim() || null;
  if (seoSummary !== undefined) data.seoSummary = seoSummary?.trim() || null;
  if (duration !== undefined) data.duration = duration?.trim() || null;
  if (uploadDate !== undefined) data.uploadDate = uploadDate?.trim() || null;
  if (sortOrder !== undefined) data.sortOrder = sortOrder;
  const updated = await prisma.youTubeVideo.update({
    where: { id },
    data,
  });
  return NextResponse.json(updated);
}

// DELETE /api/admin/youtube — 削除
export async function DELETE(req: NextRequest) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await prisma.youTubeVideo.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
