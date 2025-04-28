/*
  Warnings:

  - You are about to drop the column `depCombos` on the `SearchAnalytics` table. All the data in the column will be lost.
  - You are about to drop the column `retCombos` on the `SearchAnalytics` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SearchAnalytics" DROP COLUMN "depCombos",
DROP COLUMN "retCombos";

-- CreateTable
CREATE TABLE "AnalyticsCombo" (
    "id" SERIAL NOT NULL,
    "analyticsID" INTEGER NOT NULL,
    "airlineProvider" TEXT NOT NULL,
    "direction" "Direction" NOT NULL,

    CONSTRAINT "AnalyticsCombo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AnalyticsComboToShuttleTime" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AnalyticsComboToShuttleTime_AB_unique" ON "_AnalyticsComboToShuttleTime"("A", "B");

-- CreateIndex
CREATE INDEX "_AnalyticsComboToShuttleTime_B_index" ON "_AnalyticsComboToShuttleTime"("B");

-- AddForeignKey
ALTER TABLE "AnalyticsCombo" ADD CONSTRAINT "AnalyticsCombo_analyticsID_fkey" FOREIGN KEY ("analyticsID") REFERENCES "SearchAnalytics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnalyticsComboToShuttleTime" ADD CONSTRAINT "_AnalyticsComboToShuttleTime_A_fkey" FOREIGN KEY ("A") REFERENCES "AnalyticsCombo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnalyticsComboToShuttleTime" ADD CONSTRAINT "_AnalyticsComboToShuttleTime_B_fkey" FOREIGN KEY ("B") REFERENCES "ShuttleTime"("id") ON DELETE CASCADE ON UPDATE CASCADE;
