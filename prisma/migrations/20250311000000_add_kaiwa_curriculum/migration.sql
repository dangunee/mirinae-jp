-- CreateTable
CREATE TABLE "kaiwa_curriculum" (
    "id" TEXT NOT NULL,
    "levelKey" TEXT NOT NULL,
    "rowOrder" INTEGER NOT NULL,
    "theme" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kaiwa_curriculum_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "kaiwa_curriculum_levelKey_rowOrder_key" ON "kaiwa_curriculum"("levelKey", "rowOrder");
