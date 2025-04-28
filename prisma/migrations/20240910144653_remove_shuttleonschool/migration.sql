/*
  Warnings:

  - You are about to drop the column `schoolID` on the `ShuttleTime` table. All the data in the column will be lost.
  - You are about to drop the `ShuttleProviderOnSchool` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ShuttleProviderOnSchool" DROP CONSTRAINT "ShuttleProviderOnSchool_schoolID_fkey";

-- DropForeignKey
ALTER TABLE "ShuttleProviderOnSchool" DROP CONSTRAINT "ShuttleProviderOnSchool_shuttleProviderID_fkey";

-- DropForeignKey
ALTER TABLE "ShuttleTime" DROP CONSTRAINT "ShuttleTime_schoolID_fkey";

-- AlterTable
ALTER TABLE "ShuttleProvider" ADD COLUMN     "schoolID" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "ShuttleTime" DROP COLUMN "schoolID";

-- DropTable
DROP TABLE "ShuttleProviderOnSchool";

-- AddForeignKey
ALTER TABLE "ShuttleProvider" ADD CONSTRAINT "ShuttleProvider_schoolID_fkey" FOREIGN KEY ("schoolID") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
