import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const DEFAULT_CATEGORIES = [
  { value: "cat-tsushin", label: "通信講座", color: "#2563eb", sortOrder: 0 },
  { value: "cat-jokyu", label: "上級・会話強化", color: "#0891b2", sortOrder: 1 },
  { value: "cat-group", label: "グループレッスン", color: "#7c3aed", sortOrder: 2 },
  { value: "cat-kojin", label: "個人レッスン", color: "#059669", sortOrder: 3 },
  { value: "cat-special", label: "集中・特別講座", color: "#dc2626", sortOrder: 4 },
];

// POST /api/seed/schedule — 初期データ登録
export async function POST() {
  try {
    const existing = await prisma.scheduleEvent.count();
    if (existing > 0) {
      return NextResponse.json({ error: "既にデータがあります。削除してから再実行してください。", recurring: 0, single: 0 }, { status: 400 });
    }
    const catCount = await prisma.scheduleCategory.count();
    if (catCount === 0) {
      for (const c of DEFAULT_CATEGORIES) {
        await prisma.scheduleCategory.create({ data: c });
      }
    }
    const recurring = [
      { eventType: "recurring" as const, label: "通信音読トレーニング", cat: "cat-tsushin", time: "随時受付中", detail: "毎週水曜日・通信講座", url: "netlesson.html#tab02", dow: 3, biweekly: false, sortOrder: 0 },
      { eventType: "recurring" as const, label: "通信作文トレーニング", cat: "cat-tsushin", time: "随時受付中", detail: "毎週水曜日・通信講座", url: "netlesson.html#tab01", dow: 3, biweekly: false, sortOrder: 1 },
      { eventType: "recurring" as const, label: "上級文法＆会話講座", cat: "cat-jokyu", time: "隔週日曜日", detail: "隔週日曜・上級クラス", url: "group.html#tab05", dow: 0, biweekly: true, biweeklyStartDate: new Date("2026-04-05"), sortOrder: 2 },
      { eventType: "recurring" as const, label: "会話強化クラス", cat: "cat-jokyu", time: "14:00〜", detail: "毎週土曜 14:00〜 会話強化", url: "kaiwa.html", dow: 6, biweekly: false, sortOrder: 3 },
      { eventType: "recurring" as const, label: "グループレッスン", cat: "cat-group", time: "19:00〜", detail: "毎週木曜 19:00〜 グループ", url: "group.html", dow: 4, biweekly: false, sortOrder: 4 },
    ];
    const single = [
      { eventType: "single" as const, label: "春期集中講座（初級）", cat: "cat-special", time: "10:00〜16:00", detail: "春期集中講座・初級コース", url: "syutyu.html#tab02", date: "2026-04-12", sortOrder: 0 },
      { eventType: "single" as const, label: "春期集中講座（中級）", cat: "cat-special", time: "10:00〜16:00", detail: "春期集中講座・中級コース", url: "syutyu.html#tab03", date: "2026-04-19", sortOrder: 1 },
      { eventType: "single" as const, label: "GW特別講座", cat: "cat-special", time: "13:00〜", detail: "ゴールデンウィーク特別講座", url: "syutyu.html", date: "2026-05-03", sortOrder: 2 },
    ];
    for (const r of recurring) {
      await prisma.scheduleEvent.create({
        data: {
          eventType: r.eventType,
          label: r.label,
          cat: r.cat,
          time: r.time,
          detail: r.detail,
          url: r.url,
          dow: r.dow,
          biweekly: r.biweekly,
          biweeklyStartDate: r.biweekly && r.biweeklyStartDate ? r.biweeklyStartDate : null,
          sortOrder: r.sortOrder,
        },
      });
    }
    for (const s of single) {
      await prisma.scheduleEvent.create({ data: s });
    }
    return NextResponse.json({ recurring: recurring.length, single: single.length });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: String(e), recurring: 0, single: 0 }, { status: 500 });
  }
}
