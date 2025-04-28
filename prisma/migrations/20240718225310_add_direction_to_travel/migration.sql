/*
  Warnings:

  - Added the required column `direction` to the `TravelDate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TravelDate" ADD COLUMN     "direction" "Direction" NOT NULL;
