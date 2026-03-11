-- Supabase SQL Editor에서 실행하세요.
-- youtube_videos 테이블에 category 컬럼 추가

ALTER TABLE "youtube_videos" ADD COLUMN IF NOT EXISTS "category" TEXT;
