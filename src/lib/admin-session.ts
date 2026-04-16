import { createHash, randomBytes } from "crypto";
import { prisma } from "@/lib/db";

export const ADMIN_SESSION_COOKIE = "mirinae_admin_session";
/** Pre-auth OTP challenge cookie (opaque token → DB row). */
export const ADMIN_OTP_COOKIE = "mirinae_otp_token";

const SESSION_MAX_AGE_SEC = 60 * 60 * 24; // 1 day

function getPepper(): string {
  const s = process.env.ADMIN_SESSION_SECRET?.trim();
  if (process.env.NODE_ENV === "production") {
    if (!s) {
      throw new Error("ADMIN_SESSION_SECRET is required in production");
    }
    return s;
  }
  return s || "dev-only-admin-session-secret-change-me";
}

export function hashOpaqueToken(raw: string): string {
  return createHash("sha256")
    .update(`${getPepper()}:${raw}`, "utf8")
    .digest("hex");
}

export function generateSessionToken(): string {
  return randomBytes(32).toString("base64url");
}

export async function createAdminSession(): Promise<{ rawToken: string }> {
  const rawToken = generateSessionToken();
  const tokenHash = hashOpaqueToken(rawToken);
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SEC * 1000);
  await prisma.adminSession.create({
    data: { tokenHash, expiresAt },
  });
  return { rawToken };
}

export async function validateSessionRawToken(rawToken: string | undefined): Promise<boolean> {
  if (!rawToken || rawToken.length < 32) return false;
  const tokenHash = hashOpaqueToken(rawToken);
  const row = await prisma.adminSession.findUnique({
    where: { tokenHash },
  });
  if (!row) return false;
  if (row.expiresAt.getTime() < Date.now()) {
    await prisma.adminSession.deleteMany({ where: { tokenHash } });
    return false;
  }
  return true;
}

export async function revokeSessionRawToken(rawToken: string | undefined): Promise<void> {
  if (!rawToken || rawToken.length < 32) return;
  const tokenHash = hashOpaqueToken(rawToken);
  await prisma.adminSession.deleteMany({ where: { tokenHash } });
}

export function sessionCookieOptions(): {
  path: string;
  httpOnly: boolean;
  sameSite: "lax";
  maxAge: number;
  secure: boolean;
} {
  return {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE_SEC,
    secure: process.env.NODE_ENV === "production",
  };
}
