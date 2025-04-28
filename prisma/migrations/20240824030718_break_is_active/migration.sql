/*
  Warnings:

  - You are about to drop the column `isAdded` on the `Break` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Break" RENAME COLUMN "isAdded" TO "isActive";

-- CreateIndex
CREATE INDEX "Break_isActive_idx" ON "Break"("isActive");

-- CreateIndex
CREATE INDEX "Route_breakID_idx" ON "Route"("breakID");
