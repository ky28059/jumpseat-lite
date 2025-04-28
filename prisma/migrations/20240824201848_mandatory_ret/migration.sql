/*
  Warnings:

  - Made the column `retDate` on table `Route` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Route" ALTER COLUMN "retDate" SET NOT NULL,
ALTER COLUMN "retDate" SET DEFAULT '1970-01-01 00:00:00 +00:00';
