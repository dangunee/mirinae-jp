-- Additive only: newsletter module tables (public schema)
CREATE TABLE "newsletter_subscribers" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "source" TEXT NOT NULL DEFAULT 'web',
    "confirmedAt" TIMESTAMP(3),
    "unsubscribedAt" TIMESTAMP(3),
    "bouncedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "newsletter_subscribers_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "newsletter_subscribers_email_key" ON "newsletter_subscribers"("email");

CREATE TABLE "newsletter_subscription_tokens" (
    "id" TEXT NOT NULL,
    "subscriberId" TEXT,
    "email" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "newsletter_subscription_tokens_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "newsletter_subscription_tokens_tokenHash_key" ON "newsletter_subscription_tokens"("tokenHash");
CREATE INDEX "newsletter_subscription_tokens_email_idx" ON "newsletter_subscription_tokens"("email");

ALTER TABLE "newsletter_subscription_tokens" ADD CONSTRAINT "newsletter_subscription_tokens_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "newsletter_subscribers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "newsletter_campaigns" (
    "id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "preheader" TEXT,
    "bodyHtml" TEXT NOT NULL,
    "ctaLabel" TEXT,
    "ctaUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "scheduledAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "totalTargetCount" INTEGER NOT NULL DEFAULT 0,
    "sentCount" INTEGER NOT NULL DEFAULT 0,
    "failedCount" INTEGER NOT NULL DEFAULT 0,
    "openCount" INTEGER NOT NULL DEFAULT 0,
    "uniqueOpenCount" INTEGER NOT NULL DEFAULT 0,
    "clickCount" INTEGER NOT NULL DEFAULT 0,
    "uniqueClickCount" INTEGER NOT NULL DEFAULT 0,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "newsletter_campaigns_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "newsletter_campaigns_status_scheduledAt_idx" ON "newsletter_campaigns"("status", "scheduledAt");

CREATE TABLE "newsletter_campaign_deliveries" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "subscriberId" TEXT,
    "email" TEXT NOT NULL,
    "resendMessageId" TEXT,
    "deliveryStatus" TEXT NOT NULL DEFAULT 'queued',
    "errorMessage" TEXT,
    "sentAt" TIMESTAMP(3),
    "firstOpenedAt" TIMESTAMP(3),
    "firstClickedAt" TIMESTAMP(3),
    "openCount" INTEGER NOT NULL DEFAULT 0,
    "clickCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "newsletter_campaign_deliveries_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "newsletter_campaign_deliveries_campaignId_idx" ON "newsletter_campaign_deliveries"("campaignId");
CREATE INDEX "newsletter_campaign_deliveries_campaignId_deliveryStatus_idx" ON "newsletter_campaign_deliveries"("campaignId", "deliveryStatus");
CREATE INDEX "newsletter_campaign_deliveries_email_idx" ON "newsletter_campaign_deliveries"("email");

ALTER TABLE "newsletter_campaign_deliveries" ADD CONSTRAINT "newsletter_campaign_deliveries_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "newsletter_campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "newsletter_campaign_deliveries" ADD CONSTRAINT "newsletter_campaign_deliveries_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "newsletter_subscribers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "newsletter_import_jobs" (
    "id" TEXT NOT NULL,
    "originalFilename" TEXT NOT NULL,
    "totalRows" INTEGER NOT NULL DEFAULT 0,
    "insertedRows" INTEGER NOT NULL DEFAULT 0,
    "updatedRows" INTEGER NOT NULL DEFAULT 0,
    "skippedRows" INTEGER NOT NULL DEFAULT 0,
    "invalidRows" INTEGER NOT NULL DEFAULT 0,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "newsletter_import_jobs_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "newsletter_import_job_rows" (
    "id" TEXT NOT NULL,
    "importJobId" TEXT NOT NULL,
    "rawEmail" TEXT NOT NULL,
    "normalizedEmail" TEXT,
    "resultType" TEXT NOT NULL,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "newsletter_import_job_rows_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "newsletter_import_job_rows_importJobId_idx" ON "newsletter_import_job_rows"("importJobId");

ALTER TABLE "newsletter_import_job_rows" ADD CONSTRAINT "newsletter_import_job_rows_importJobId_fkey" FOREIGN KEY ("importJobId") REFERENCES "newsletter_import_jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
