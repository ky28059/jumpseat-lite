/*
  Warnings:

  - You are about to drop the column `defaultEndDate` on the `Break` table. All the data in the column will be lost.
  - You are about to drop the column `defaultStartDate` on the `Break` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Break` table. All the data in the column will be lost.
  - You are about to drop the column `leftEndRange` on the `Break` table. All the data in the column will be lost.
  - You are about to drop the column `leftStartRange` on the `Break` table. All the data in the column will be lost.
  - You are about to drop the column `realEndDate` on the `Break` table. All the data in the column will be lost.
  - You are about to drop the column `realStartDate` on the `Break` table. All the data in the column will be lost.
  - You are about to drop the column `rightEndRange` on the `Break` table. All the data in the column will be lost.
  - You are about to drop the column `rightStartRange` on the `Break` table. All the data in the column will be lost.
  - Added the required column `endDate` to the `Break` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Break` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Break_isActive_idx";

-- AlterTable
ALTER TABLE "Break"
RENAME COLUMN "defaultEndDate" TO "endDate";

ALTER TABLE "Break"
RENAME COLUMN "defaultStartDate" TO "startDate";

ALTER TABLE "Break" DROP COLUMN "isActive",
DROP COLUMN "leftEndRange",
DROP COLUMN "leftStartRange",
DROP COLUMN "realEndDate",
DROP COLUMN "realStartDate",
DROP COLUMN "rightEndRange",
DROP COLUMN "rightStartRange";
