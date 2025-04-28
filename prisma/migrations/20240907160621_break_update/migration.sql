/*
  Warnings:

  - You are about to drop the column `endDate` on the `Break` table. All the data in the column will be lost.
  - You are about to drop the column `endRange` on the `Break` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Break` table. All the data in the column will be lost.
  - You are about to drop the column `startRange` on the `Break` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Break" DROP COLUMN "endDate",
DROP COLUMN "endRange",
DROP COLUMN "startDate",
DROP COLUMN "startRange",
ADD COLUMN     "defaultEndDate" DATE NOT NULL DEFAULT '1970-01-01 00:00:00 +00:00',
ADD COLUMN     "defaultStartDate" DATE NOT NULL DEFAULT '1970-01-01 00:00:00 +00:00',
ADD COLUMN     "leftEndRange" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "leftStartRange" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "realEndDate" DATE NOT NULL DEFAULT '1970-01-01 00:00:00 +00:00',
ADD COLUMN     "realStartDate" DATE NOT NULL DEFAULT '1970-01-01 00:00:00 +00:00',
ADD COLUMN     "rightEndRight" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "rightStartRight" INTEGER NOT NULL DEFAULT 0;
