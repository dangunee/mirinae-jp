/**
 * In-memory OTP store for 2FA.
 * OTP expires after 5 minutes.
 */
const store = new Map<
  string,
  { otp: string; expiresAt: number }
>();

const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes

export function saveOtp(token: string, otp: string): void {
  store.set(token, {
    otp,
    expiresAt: Date.now() + OTP_TTL_MS,
  });
}

export function verifyOtp(token: string, otp: string): boolean {
  const entry = store.get(token);
  if (!entry) return false;
  if (Date.now() > entry.expiresAt) {
    store.delete(token);
    return false;
  }
  if (entry.otp !== otp) return false;
  store.delete(token);
  return true;
}

export function generateToken(): string {
  return crypto.randomUUID();
}

export function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}
