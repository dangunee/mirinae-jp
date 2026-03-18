-- Supabase Security Advisor: RLS 활성화
-- Supabase Dashboard > SQL Editor에서 이 스크립트 전체를 실행하세요.
-- https://supabase.com/dashboard/project/qoagmarsvytdqliwomlb/sql

-- 1. schedule_published (공개 읽기 전용)
ALTER TABLE public.schedule_published ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read" ON public.schedule_published;
CREATE POLICY "Allow public read" ON public.schedule_published FOR SELECT USING (true);

-- 2. curriculum_published (공개 읽기 전용)
ALTER TABLE public.curriculum_published ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read" ON public.curriculum_published;
CREATE POLICY "Allow public read" ON public.curriculum_published FOR SELECT USING (true);

-- 3. schedule_categories (공개 읽기 전용)
ALTER TABLE public.schedule_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read" ON public.schedule_categories;
CREATE POLICY "Allow public read" ON public.schedule_categories FOR SELECT USING (true);

-- 4. youtube_videos (공개 읽기 전용)
ALTER TABLE public.youtube_videos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read" ON public.youtube_videos;
CREATE POLICY "Allow public read" ON public.youtube_videos FOR SELECT USING (true);

-- 5. schedule_events (공개 읽기 전용)
ALTER TABLE public.schedule_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read" ON public.schedule_events;
CREATE POLICY "Allow public read" ON public.schedule_events FOR SELECT USING (true);
