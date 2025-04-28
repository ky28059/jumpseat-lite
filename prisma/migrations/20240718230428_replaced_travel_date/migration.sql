/*
  Warnings:

  - You are about to drop the column `endDate` on the `Break` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Break` table. All the data in the column will be lost.
  - You are about to drop the `TravelDate` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TravelDate" DROP CONSTRAINT "TravelDate_breakID_fkey";

-- AlterTable
ALTER TABLE "Break" DROP COLUMN "endDate",
DROP COLUMN "startDate",
ADD COLUMN     "fromRange" INTEGER,
ADD COLUMN     "fromStart" DATE,
ADD COLUMN     "toRange" INTEGER,
ADD COLUMN     "toStart" DATE;

-- DropTable
DROP TABLE "TravelDate";
