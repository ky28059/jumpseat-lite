/*
  Warnings:

  - You are about to drop the column `isAdded` on the `Break` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Break" DROP COLUMN "isAdded";

-- AlterTable
ALTER TABLE "School" ADD COLUMN     "excludedIatas" TEXT[] DEFAULT ARRAY[]::TEXT[];
