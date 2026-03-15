import { NextResponse } from "next/server";
import { execSync } from "child_process";
import path from "path";

/**
 * POST /api/admin/db-sync
 * Prisma 스키마를 DB에 적용합니다.
 * 터미널에서 npx prisma db push 가 안 될 때,
 * 앱 서버(DB 연결 가능)에서 실행합니다.
 */
export async function POST() {
  try {
    const projectRoot = path.resolve(process.cwd());
    execSync("npx prisma db push", {
      cwd: projectRoot,
      env: process.env,
      encoding: "utf-8",
    });
    return NextResponse.json({ ok: true, message: "DBスキーマを適用しました" });
  } catch (e) {
    const err = e as { stderr?: string; stdout?: string; message?: string };
    const msg = err.stderr || err.stdout || err.message || String(e);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
