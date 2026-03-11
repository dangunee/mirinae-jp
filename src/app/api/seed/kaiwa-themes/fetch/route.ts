import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import * as cheerio from "cheerio";

// mirinae.jp/kaiwa.html から会話テーマ表を取得してDBに登録

const PAGE_SLUG = "kaiwa";
const SOURCE_URL = "https://mirinae.jp/kaiwa.html?tab=tab01";

export async function POST() {
  try {
    const res = await fetch(SOURCE_URL, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; MirinaeAdmin/1.0)" },
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: `fetch failed: ${res.status}` },
        { status: 502 }
      );
    }
    const html = await res.text();
    const $ = cheerio.load(html);

    // 内容テーブル: 初中級 | 中級1 | 中級2 | 上級 の表を探す
    let shuchukyu: string[] = [];
    let chukyu1: string[] = [];
    let chukyu2: string[] = [];
    let jokyu: string[] = [];

    function extractFromTable($table: cheerio.Cheerio<cheerio.Element>) {
      const allRows = $table.find("tr");
      const cols: string[][] = [[], [], [], []];
      let startRow = 0;
      for (let i = 0; i < Math.min(3, allRows.length); i++) {
        const headerText = $(allRows[i]).text();
        if (headerText.includes("初中級") && headerText.includes("中級1") && headerText.includes("上級")) {
          startRow = i + 1;
          break;
        }
      }
      allRows.slice(startRow).each((_, tr) => {
        const cells = $(tr).find("td, th");
        if (cells.length >= 5) {
          for (let c = 0; c < 4; c++) {
            const text = $(cells[c + 1]).text().trim();
            if (text && !/^\d+$/.test(text)) cols[c].push(text);
          }
        }
      });
      if (cols[0].length >= 50) {
        shuchukyu = cols[0];
        chukyu1 = cols[1];
        chukyu2 = cols[2];
        jokyu = cols[3];
        return true;
      }
      return false;
    }

    $("table").each((_, table) => {
      if (extractFromTable($(table))) return false; // break
    });

    // 正規表現フォールバック（HTMLが複雑な場合）
    if (shuchukyu.length < 50) {
      const rows = html.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi) || [];
      for (const row of rows) {
        const cells = row.match(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gi);
        if (cells && cells.length >= 5) {
          const texts = cells.slice(1, 5).map((c) =>
            c.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim()
          );
          if (texts[0] && !/^\d+$/.test(texts[0])) {
            shuchukyu.push(texts[0]);
            chukyu1.push(texts[1] || "");
            chukyu2.push(texts[2] || "");
            jokyu.push(texts[3] || "");
          }
        }
      }
      if (shuchukyu.length >= 50) {
        shuchukyu = shuchukyu.slice(0, 50);
        chukyu1 = chukyu1.slice(0, 50);
        chukyu2 = chukyu2.slice(0, 50);
        jokyu = jokyu.slice(0, 50);
      }
    }

    if (shuchukyu.length < 50) {
      return NextResponse.json(
        {
          error: "テーマ表を取得できませんでした",
          detail: `初中級: ${shuchukyu.length}件`,
        },
        { status: 422 }
      );
    }

    // DBに保存
    const blocks = [
      { blockKey: "curriculum_kaiwa_shuchukyu", title: "初中級", themes: shuchukyu },
      { blockKey: "curriculum_kaiwa_chukyu1", title: "中級1", themes: chukyu1 },
      { blockKey: "curriculum_kaiwa_chukyu2", title: "中級2", themes: chukyu2 },
      { blockKey: "curriculum_kaiwa_jokyu", title: "上級", themes: jokyu },
    ];

    for (const { blockKey, title, themes } of blocks) {
      const rows = themes.slice(0, 50).map((t) => ({ theme: t }));
      await prisma.siteTable.upsert({
        where: { pageSlug_blockKey: { pageSlug: PAGE_SLUG, blockKey } },
        create: { pageSlug: PAGE_SLUG, blockKey, title, rowsJson: JSON.stringify(rows) },
        update: { title, rowsJson: JSON.stringify(rows) },
      });
    }

    return NextResponse.json({
      ok: true,
      message: `mirinae.jp から取得しました（各レベル ${shuchukyu.length} テーマ）`,
    });
  } catch (e) {
    console.error("kaiwa fetch error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "取得に失敗しました" },
      { status: 500 }
    );
  }
}
