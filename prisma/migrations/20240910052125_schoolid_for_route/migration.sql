/*
  Warnings:

  - You are about to drop the column `schoolID` on the `ShuttleProvider` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ShuttleProvider" DROP COLUMN "schoolID";

-- AlterTable
ALTER TABLE "ShuttleTime" ADD COLUMN     "schoolID" INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE "ShuttleTime" ADD CONSTRAINT "ShuttleTime_schoolID_fkey" FOREIGN KEY ("schoolID") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
