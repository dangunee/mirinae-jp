import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const PAGE_SLUG = "group";
const BLOCK_KEY = "curriculum_jokyu";
const TITLE = "上級文法";

/** 上級文法カリキュラム行: 回数, 時限, 項目, 概要, 日程 */
type GroupJokyuRow = {
  kaisu: string;
  jigen: string;
  koumoku: string;
  shosai: string;
  nittei?: string;
};

const ROWS: GroupJokyuRow[] = [
  { kaisu: "1", jigen: "1限目", koumoku: "選択", shosai: "-느니, -(으)ㄹ 바에야, -건-건", nittei: "2/7(土)" },
  { kaisu: "", jigen: "2限目", koumoku: "選択・引用", shosai: "-(느)ㄴ다기보다는, -고, など" },
  { kaisu: "2", jigen: "1限目", koumoku: "引用", shosai: "-(느)ㄴ다니까, -(느)ㄴ다면서, ~에 의하면 など", nittei: "2/14(土)" },
  { kaisu: "", jigen: "2限目", koumoku: "名詞化", shosai: "-(으)ㅁ, -는 데, -는 바" },
  { kaisu: "3", jigen: "1限目", koumoku: "原因と理由❶", shosai: "(으)로 인해서, -는 통에, (으)로 말미암아", nittei: "2/21(土)" },
  { kaisu: "", jigen: "2限目", koumoku: "原因と理由❷", shosai: "-느니만큼, -는 이상, -기로서니" },
  { kaisu: "4", jigen: "1限目", koumoku: "原因と理由❸", shosai: "-기에망정이지, -(느)ㄴ답시고, -(으)ㅁ으로써", nittei: "2/28(土)" },
  { kaisu: "", jigen: "2限目", koumoku: "原因と理由❹", shosai: "-기에, -길래" },
  { kaisu: "5", jigen: "1限目", koumoku: "仮定❶", shosai: "-더라도, -(으)ㄹ지라도, -(으)ㄴ들", nittei: "3/7(土)" },
  { kaisu: "", jigen: "2限目", koumoku: "仮定❷", shosai: "-(으)ㄹ망정, -(느)ㄴ다고 치다, -는 셈치다" },
  { kaisu: "6", jigen: "1限目", koumoku: "続けてやる行動", shosai: "-기가 무섭게, -자", nittei: "3/14(土)" },
  { kaisu: "", jigen: "2限目", koumoku: "条件・決定", shosai: "-는 한, -(으)ㄹ라치면, -노라면" },
  { kaisu: "7", jigen: "1限目", koumoku: "条件・決定", shosai: "-느냐에 달려 있다, -기 나름이다", nittei: "3/21(土)" },
  { kaisu: "", jigen: "2限目", koumoku: "別々にする行動 / 一緒にする行動", shosai: "은/는 대로, -는 김에" },
  { kaisu: "8", jigen: "1限目", koumoku: "対照・反対", shosai: "-건만, -고도, -(으)ㅁ에도 불구하고", nittei: "3/28(土)" },
  { kaisu: "", jigen: "2限目", koumoku: "類似", shosai: "-듯이, -다시피 하다" },
];

export async function POST() {
  try {
    await prisma.siteTable.upsert({
      where: { pageSlug_blockKey: { pageSlug: PAGE_SLUG, blockKey: BLOCK_KEY } },
      create: {
        pageSlug: PAGE_SLUG,
        blockKey: BLOCK_KEY,
        title: TITLE,
        rowsJson: JSON.stringify(ROWS),
      },
      update: {
        title: TITLE,
        rowsJson: JSON.stringify(ROWS),
      },
    });
    return NextResponse.json({ ok: true, blockKey: BLOCK_KEY });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
