/*
  Warnings:

  - You are about to drop the column `airlineProvider` on the `AnalyticsCombo` table. All the data in the column will be lost.
  - You are about to drop the column `break` on the `SearchAnalytics` table. All the data in the column will be lost.
  - You are about to drop the column `selectedDepID` on the `SearchAnalytics` table. All the data in the column will be lost.
  - You are about to drop the column `selectedRetID` on the `SearchAnalytics` table. All the data in the column will be lost.
  - Added the required column `airline` to the `AnalyticsCombo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `arrTime` to the `AnalyticsCombo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `depTime` to the `AnalyticsCombo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AnalyticsCombo" DROP COLUMN "airlineProvider",
ADD COLUMN     "airline" TEXT NOT NULL,
ADD COLUMN     "arrTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "chosenShuttle" INTEGER,
ADD COLUMN     "depTime" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "SearchAnalytics" DROP COLUMN "break",
DROP COLUMN "selectedDepID",
DROP COLUMN "selectedRetID";
