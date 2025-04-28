/*
  Warnings:

  - You are about to drop the column `chosenShuttle` on the `AnalyticsCombo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AnalyticsCombo" DROP COLUMN "chosenShuttle",
ADD COLUMN     "chosenShuttleID" INTEGER;

-- AddForeignKey
ALTER TABLE "AnalyticsCombo" ADD CONSTRAINT "AnalyticsCombo_chosenShuttleID_fkey" FOREIGN KEY ("chosenShuttleID") REFERENCES "ShuttleTime"("id") ON DELETE SET NULL ON UPDATE CASCADE;
