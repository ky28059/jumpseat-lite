/*
  Warnings:

  - A unique constraint covering the columns `[userID,breakID]` on the table `UserBreak` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserBreak_userID_breakID_key" ON "UserBreak"("userID", "breakID");
