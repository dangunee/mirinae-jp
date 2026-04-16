import { createHash, randomBytes } from "crypto";
import { prisma } from "@/lib/db";

const OTP_TTL_MS = 5 * 60 * 1000;

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

function hashOtp(otp: string): string {
  return createHash("sha256")
    .update(`${getPepper()}:otp:${otp}`, "utf8")
    .digest("hex");
}

function hashChallengeToken(raw: string): string {
  return createHash("sha256")
    .update(`${getPepper()}:otp-challenge:${raw}`, "utf8")
    .digest("hex");
}

export function generateOtpDigits(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function generateOtpCookieToken(): string {
  return randomBytes(32).toString("base64url");
}

export async function createOtpChallenge(otp: string): Promise<{ cookieToken: string }> {
  const cookieToken = generateOtpCookieToken();
  const tokenHash = hashChallengeToken(cookieToken);
  const otpHash = hashOtp(otp);
  const expiresAt = new Date(Date.now() + OTP_TTL_MS);

  await prisma.adminOtpChallenge.create({
    data: { tokenHash, otpHash, expiresAt },
  });

  return { cookieToken };
}

export async function consumeOtpChallenge(
  cookieToken: string | undefined,
  otp: string
): Promise<boolean> {
  if (!cookieToken || cookieToken.length < 32) return false;
  const tokenHash = hashChallengeToken(cookieToken);
  const row = await prisma.adminOtpChallenge.findUnique({
    where: { tokenHash },
  });
  if (!row || row.consumedAt) return false;
  if (row.expiresAt.getTime() < Date.now()) {
    await prisma.adminOtpChallenge.deleteMany({ where: { tokenHash } });
    return false;
  }
  if (row.otpHash !== hashOtp(otp)) return false;

  await prisma.adminOtpChallenge.delete({ where: { id: row.id } });
  return true;
}

export function otpCookieOptions(): {
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
    maxAge: 60 * 5,
    secure: process.env.NODE_ENV === "production",
  };
}
