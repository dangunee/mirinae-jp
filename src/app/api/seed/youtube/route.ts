import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const SEED: { videoId: string; title: string; category?: string; description?: string; seoSummary?: string; duration?: string }[] = [
  { videoId: "FEtiZL1n5ls", title: "役に立つ韓国語動画①", category: "生活韓国語", description: "", seoSummary: "生活韓国語「台所」の表現を紹介。知らないと損する韓国語の表現を学べます。", duration: "PT5M" },
  { videoId: "fnNVSCc200w", title: "役に立つ韓国語動画②", category: "生活韓国語", description: "", seoSummary: "化粧道具に関する生活韓国語。ミリネ韓国語教室が日常で使える表現を解説します。", duration: "PT6M" },
  { videoId: "G--wKHGNDyU", title: "役に立つ韓国語動画③", category: "TOPIK上級", description: "", seoSummary: "TOPIK II上級単語「自然・学1-60」。例文と一緒に覚える効率的な学習法を紹介します。", duration: "PT8M" },
];

export async function POST() {
  try {
    let count = 0;
    for (let i = 0; i < SEED.length; i++) {
      const v = SEED[i];
      const existing = await prisma.youTubeVideo.findFirst({ where: { videoId: v.videoId } });
      if (existing) {
        await prisma.youTubeVideo.update({
          where: { id: existing.id },
          data: {
            title: v.title,
            category: v.category || null,
            description: v.description || null,
            seoSummary: v.seoSummary || null,
            duration: v.duration || null,
            sortOrder: i,
          },
        });
      } else {
        await prisma.youTubeVideo.create({
          data: {
            videoId: v.videoId,
            title: v.title,
            category: v.category || null,
            description: v.description || null,
            seoSummary: v.seoSummary || null,
            duration: v.duration || null,
            sortOrder: i,
          },
        });
      }
      count++;
    }
    return NextResponse.json({ ok: true, count });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
