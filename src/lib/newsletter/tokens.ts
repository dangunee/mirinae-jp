import { createHash, randomBytes } from "crypto";

const TOKEN_BYTES = 32;

export function generateRawToken(): string {
  return randomBytes(TOKEN_BYTES).toString("hex");
}

export function hashToken(raw: string): string {
  return createHash("sha256").update(raw, "utf8").digest("hex");
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}
