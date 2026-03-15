import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * POST /api/admin/db-sync
 * schedule_categories, schedule_events 테이블을 생성/업데이트합니다.
 * 서버리스 환경(Vercel 등)에서도 동작합니다。
 */
export async function POST() {
  try {
    // schedule_categories 테이블 생성
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "public"."schedule_categories" (
        "id" TEXT NOT NULL,
        "value" TEXT NOT NULL,
        "label" TEXT NOT NULL,
        "color" TEXT NOT NULL DEFAULT '#e5e7eb',
        "sortOrder" INTEGER NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "schedule_categories_pkey" PRIMARY KEY ("id")
      );
    `);
    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "schedule_categories_value_key" ON "public"."schedule_categories"("value");
    `);

    // schedule_events 테이블 생성 (없으면)
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "public"."schedule_events" (
        "id" TEXT NOT NULL,
        "eventType" TEXT NOT NULL,
        "label" TEXT NOT NULL,
        "cat" TEXT NOT NULL,
        "categoryLabel" TEXT,
        "time" TEXT,
        "detail" TEXT,
        "url" TEXT,
        "dow" INTEGER,
        "biweekly" BOOLEAN NOT NULL DEFAULT false,
        "biweeklyStartDate" TIMESTAMP(3),
        "monthlyWeeks" TEXT,
        "endDate" TEXT,
        "date" TEXT,
        "sortOrder" INTEGER NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "schedule_events_pkey" PRIMARY KEY ("id")
      );
    `);

    // 기존 schedule_events에 컬럼 추가 (있으면 스킵)
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE "public"."schedule_events" ADD COLUMN IF NOT EXISTS "monthlyWeeks" TEXT;`);
      await prisma.$executeRawUnsafe(`ALTER TABLE "public"."schedule_events" ADD COLUMN IF NOT EXISTS "endDate" TEXT;`);
      await prisma.$executeRawUnsafe(`ALTER TABLE "public"."schedule_events" ADD COLUMN IF NOT EXISTS "categoryLabel" TEXT;`);
    } catch {
      // 무시
    }

    return NextResponse.json({ ok: true, message: "DBスキーマを適用しました" });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
