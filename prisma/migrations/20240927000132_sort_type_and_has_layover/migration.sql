/*
  Warnings:

  - Added the required column `hasLayover` to the `AnalyticsCombo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sortType` to the `AnalyticsCombo` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SortType" AS ENUM ('BEST', 'CHEAPEST', 'FASTEST');

-- AlterTable
ALTER TABLE "AnalyticsCombo" ADD COLUMN     "hasLayover" BOOLEAN NOT NULL,
ADD COLUMN     "sortType" "SortType" NOT NULL;
