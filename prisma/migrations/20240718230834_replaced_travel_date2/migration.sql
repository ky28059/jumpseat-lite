/*
  Warnings:

  - Made the column `fromRange` on table `Break` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fromStart` on table `Break` required. This step will fail if there are existing NULL values in that column.
  - Made the column `toRange` on table `Break` required. This step will fail if there are existing NULL values in that column.
  - Made the column `toStart` on table `Break` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Break" ALTER COLUMN "fromRange" SET NOT NULL,
ALTER COLUMN "fromRange" SET DEFAULT 3,
ALTER COLUMN "fromStart" SET NOT NULL,
ALTER COLUMN "toRange" SET NOT NULL,
ALTER COLUMN "toRange" SET DEFAULT 3,
ALTER COLUMN "toStart" SET NOT NULL;
