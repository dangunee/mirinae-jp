/**
 * グループページの中級・上級シラバスを DB に反映し、公開スナップショットも更新する。
 *
 * 1) site_tables に curriculum_chubu / curriculum_jokyu を upsert（seed と同じ内容）
 * 2) curriculum_published.id = curriculum_group を、group ページの全 site_tables から再構築
 *
 * 実行: DATABASE_URL が届く環境で
 *   npm run db:sync-group-curriculum
 *
 * public/group.html の静的表とズレないよう、日程変更時は seed スクリプトとあわせて更新すること。
 */
const path = require("path");
const { execSync } = require("child_process");
const { PrismaClient } = require("@prisma/client");

const root = path.join(__dirname, "..");
const prisma = new PrismaClient();

function parseRows(rowsJson) {
  try {
    const raw = JSON.parse(rowsJson);
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

async function main() {
  execSync("node scripts/seed-group-chubu.cjs", { stdio: "inherit", cwd: root });
  execSync("node scripts/seed-group-jokyu.cjs", { stdio: "inherit", cwd: root });

  const blocks = await prisma.siteTable.findMany({
    where: { pageSlug: "group" },
    orderBy: [{ blockKey: "asc" }],
  });

  const curriculumData = blocks.map((b) => ({
    id: b.id,
    pageSlug: b.pageSlug,
    blockKey: b.blockKey,
    title: b.title,
    rows: parseRows(b.rowsJson),
  }));

  await prisma.curriculumPublished.upsert({
    where: { id: "curriculum_group" },
    create: {
      id: "curriculum_group",
      dataJson: JSON.stringify(curriculumData),
    },
    update: {
      dataJson: JSON.stringify(curriculumData),
    },
  });

  console.log(
    "OK: curriculum_published (curriculum_group) updated. site_tables blocks for group:",
    curriculumData.length
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
