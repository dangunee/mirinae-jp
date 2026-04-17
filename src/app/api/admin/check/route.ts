import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";

/** 未ログインでも 401 にしない（ブラウザがコンソールに失敗ログを出すのを避ける） */
export async function GET(req: NextRequest) {
  if (await isAdminRequest(req)) {
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ ok: false });
}
