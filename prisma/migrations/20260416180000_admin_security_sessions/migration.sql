-- Admin sessions, OTP challenges, rate limiting (additive only)

CREATE TABLE "public"."admin_sessions" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "admin_sessions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "admin_sessions_tokenHash_key" ON "public"."admin_sessions"("tokenHash");

CREATE TABLE "public"."admin_otp_challenges" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "otpHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "consumedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "admin_otp_challenges_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "admin_otp_challenges_tokenHash_key" ON "public"."admin_otp_challenges"("tokenHash");

CREATE TABLE "public"."rate_limit_buckets" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "windowKey" INTEGER NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "rate_limit_buckets_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "rate_limit_key_window" ON "public"."rate_limit_buckets"("key", "windowKey");
