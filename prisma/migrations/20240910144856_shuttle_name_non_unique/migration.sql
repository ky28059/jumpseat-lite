/*
  Warnings:

  - A unique constraint covering the columns `[name,schoolID]` on the table `ShuttleProvider` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ShuttleProvider_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "ShuttleProvider_name_schoolID_key" ON "ShuttleProvider"("name", "schoolID");
