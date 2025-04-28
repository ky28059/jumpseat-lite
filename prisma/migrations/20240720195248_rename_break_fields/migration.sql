/*
  Warnings:

  - You are about to drop the column `fromRange` on the `Break` table. All the data in the column will be lost.
  - You are about to drop the column `fromStart` on the `Break` table. All the data in the column will be lost.
  - You are about to drop the column `toRange` on the `Break` table. All the data in the column will be lost.
  - You are about to drop the column `toStart` on the `Break` table. All the data in the column will be lost.
  - Added the required column `endDate` to the `Break` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Break` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Break"
RENAME COLUMN "fromStart" TO "startDate";

ALTER TABLE "Break"
RENAME COLUMN "fromRange" TO "startRange";

ALTER TABLE "Break"
RENAME COLUMN "toStart" TO "endDate";

ALTER TABLE "Break"
RENAME COLUMN "toRange" TO "endRange";
