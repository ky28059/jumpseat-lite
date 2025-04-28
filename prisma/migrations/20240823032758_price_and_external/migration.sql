/*
  Warnings:

  - You are about to drop the column `excludedIatas` on the `School` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "School" RENAME COLUMN "excludedIatas" to "externalIatas";

-- AlterTable
ALTER TABLE "ShuttleTime" ADD COLUMN     "price" INTEGER NOT NULL DEFAULT 0;
