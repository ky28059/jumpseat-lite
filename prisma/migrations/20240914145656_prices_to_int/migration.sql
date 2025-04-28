/*
  Warnings:

  - You are about to alter the column `prices` on the `Flight` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Flight" ALTER COLUMN "prices" SET DATA TYPE INTEGER[];
