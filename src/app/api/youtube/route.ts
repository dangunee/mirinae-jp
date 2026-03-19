import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

function toUploadDate(v: { uploadDate: string | null; createdAt: Date }): string {
  if (v.uploadDate) return v.uploadDate;
  const jst = new Date(v.createdAt.getTime() + 9 * 60 * 60 * 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${jst.getUTCFullYear()}-${pad(jst.getUTCMonth() + 1)}-${pad(jst.getUTCDate())}T${pad(jst.getUTCHours())}:${pad(jst.getUTCMinutes())}:${pad(jst.getUTCSeconds())}+09:00`;
}

export type YouTubeVideoItem = {
  id: string;
  videoId: string;
  title: string;
  category: string | null;
  description: string | null;
  seoSummary: string | null;
  duration: string | null;
  uploadDate: string;
  sortOrder: number;
};

// GET /api/youtube — 公開用（メインページ）
export async function GET() {
  const list = await prisma.youTubeVideo.findMany({
    orderBy: { sortOrder: "asc" },
  });
  const items: YouTubeVideoItem[] = list.map((v) => ({
    id: v.id,
    videoId: v.videoId,
    title: v.title,
    category: v.category,
    description: v.description,
    seoSummary: v.seoSummary,
    duration: v.duration,
    uploadDate: toUploadDate(v),
    sortOrder: v.sortOrder,
  }));
  return NextResponse.json(items);
}
