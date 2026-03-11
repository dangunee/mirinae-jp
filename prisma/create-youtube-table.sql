-- Supabase SQL Editor에서 직접 실행하세요.
-- youtube_videos 테이블만 생성합니다（기존 테이블에는 영향 없음）

CREATE TABLE IF NOT EXISTS "youtube_videos" (
    "id" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "seoSummary" TEXT,
    "duration" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "youtube_videos_pkey" PRIMARY KEY ("id")
);
