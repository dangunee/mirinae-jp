import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/health — DB 연결 및 테이블 상태 확인
export async function GET() {
  try {
    const [siteCount, youtubeCount] = await Promise.all([
      prisma.siteTable.count(),
      prisma.youTubeVideo.count(),
    ]);
    return NextResponse.json({
      ok: true,
      database: "connected",
      site_tables: siteCount,
      youtube_videos: youtubeCount,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { ok: false, error: message, database: "error" },
      { status: 500 }
    );
  }
}
