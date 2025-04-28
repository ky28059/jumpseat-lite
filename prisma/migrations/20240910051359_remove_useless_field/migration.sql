/*
  Warnings:

  - You are about to drop the column `assignedAt` on the `ShuttleProviderOnSchool` table. All the data in the column will be lost.
  - You are about to drop the column `assignedBy` on the `ShuttleProviderOnSchool` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ShuttleProviderOnSchool" DROP COLUMN "assignedAt",
DROP COLUMN "assignedBy";
