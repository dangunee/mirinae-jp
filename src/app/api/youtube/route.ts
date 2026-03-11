import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export type YouTubeVideoItem = {
  id: string;
  videoId: string;
  title: string;
  description: string | null;
  seoSummary: string | null;
  duration: string | null;
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
    description: v.description,
    seoSummary: v.seoSummary,
    duration: v.duration,
    sortOrder: v.sortOrder,
  }));
  return NextResponse.json(items);
}
