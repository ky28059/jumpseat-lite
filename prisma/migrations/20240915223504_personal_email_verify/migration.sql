/*
  Warnings:

  - You are about to drop the column `isPeronsalEmailVerified` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "isPeronsalEmailVerified",
ADD COLUMN     "isPersonalEmailVerified" BOOLEAN NOT NULL DEFAULT false;
