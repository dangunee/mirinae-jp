/**
 * Run: node scripts/seed-group-chubu.cjs
 * Seeds 中級文法 curriculum (curriculum_chubu) into the database.
 */
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const PAGE_SLUG = "group";
const BLOCK_KEY = "curriculum_chubu";
const TITLE = "中級文法";

const ROWS = [
  { kaisu: "1", jigen: "1限目", koumoku: "推測と予想❶", shosai: "-아/어 보이다, -은/는 모양이다", nittei: "2/7(土)" },
  { kaisu: "", jigen: "2限目", koumoku: "推測と予想❷", shosai: "-을 텐데, -을 걸요" },
  { kaisu: "2", jigen: "1限目", koumoku: "推測と予想❸", shosai: "-은/는/을 줄 몰랐다(알았다), -을지도 모르다", nittei: "2/14(土)" },
  { kaisu: "", jigen: "2限目", koumoku: "対照", shosai: "-기는 하지만, -기는 -지만, -은/는 반면에, -은/는데도" },
  { kaisu: "3", jigen: "1限目", koumoku: "叙述とタメ口", shosai: "서술체・반말체", nittei: "2/21(土)" },
  { kaisu: "", jigen: "2限目", koumoku: "理由❶", shosai: "-거든요, -잖아요, -느라고" },
  { kaisu: "4", jigen: "1限目", koumoku: "理由❷", shosai: "-는 바람에, -는 탓에", nittei: "2/28(土)" },
  { kaisu: "", jigen: "2限目", koumoku: "理由❸", shosai: "-고 해서, -을까 봐" },
  { kaisu: "5", jigen: "1限目", koumoku: "他人の話や文の引用❶", shosai: "-다고요?, -다고 하던데", nittei: "3/7(土)" },
  { kaisu: "", jigen: "2限目", koumoku: "他人の話や文の引用❷", shosai: "-다면서요?, -다니요?" },
  { kaisu: "6", jigen: "1限目", koumoku: "決心と意図❶", shosai: "-을까 하다, -고자, -(으)려던 참이다", nittei: "3/14(土)" },
  { kaisu: "", jigen: "2限目", koumoku: "決心と意図❷", shosai: "-을 겸 -을 겸, -아/어야지요" },
  { kaisu: "7", jigen: "1限目", koumoku: "推薦と助言", shosai: "-을 만하다, -도록 하다, -지 그래요?", nittei: "3/21(土)" },
  { kaisu: "", jigen: "2限目", koumoku: "回想", shosai: "-던, -더라고요, -던데요" },
  { kaisu: "8", jigen: "1限目", koumoku: "受け身", shosai: "피동(-이/히/리/기-), -아/어지다, -게 되다", nittei: "3/28(土)" },
  { kaisu: "", jigen: "2限目", koumoku: "使役", shosai: "사동(-이/히/리/기-), -게 하다" },
  { kaisu: "9", jigen: "1限目", koumoku: "条件", shosai: "-아/어야, -거든", nittei: "4/7(土)" },
  { kaisu: "", jigen: "2限目", koumoku: "追加❶", shosai: "-을 뿐만 아니라, -은/는 데다가" },
  { kaisu: "10", jigen: "1限目", koumoku: "追加❷", shosai: "-조차, -만 해도", nittei: "4/14(土)" },
  { kaisu: "", jigen: "2限目", koumoku: "途中", shosai: "-는 길에, -다가" },
];

async function main() {
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
  console.log("OK: curriculum_chubu seeded");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
