#!/usr/bin/env node
/**
 * 강좌 스케줄 DB 데이터 확인 스크립트
 * 실행: node scripts/check-schedule-db.mjs
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    const [eventCount, catCount] = await Promise.all([
      prisma.scheduleEvent.count(),
      prisma.scheduleCategory.count(),
    ]);

    console.log("=== 강좌 스케줄 DB 현황 ===");
    console.log("카테고리 수:", catCount);
    console.log("이벤트 수:", eventCount);

    if (eventCount > 0) {
      const events = await prisma.scheduleEvent.findMany({
        orderBy: [{ eventType: "asc" }, { sortOrder: "asc" }],
        take: 10,
      });
      console.log("\n--- 최근 이벤트 샘플 (최대 10개) ---");
      events.forEach((e) => {
        console.log(`  [${e.eventType}] ${e.label} (${e.cat})`);
      });
    } else {
      console.log("\n※ 이벤트가 없습니다.");
    }
  } catch (e) {
    console.error("DB 연결 실패:", e.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
