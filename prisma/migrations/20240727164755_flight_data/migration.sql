-- DropIndex
DROP INDEX "Route_lastUpdated_idx";

-- AlterTable
ALTER TABLE "Flight" ADD COLUMN     "startDate" DATE;

-- AlterTable
ALTER TABLE "Route" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE INDEX "Route_lastUpdated_isActive_idx" ON "Route"("lastUpdated", "isActive");
