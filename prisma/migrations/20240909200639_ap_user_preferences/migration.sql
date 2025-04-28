/*
  Warnings:

  - You are about to drop the column `airlines` on the `UserBreak` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "excludedAirlines" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "excludedAirports" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "wantsEmails" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "UserBreak" DROP COLUMN "airlines";
