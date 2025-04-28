/*
  Warnings:

  - You are about to drop the column `rightEndRight` on the `Break` table. All the data in the column will be lost.
  - You are about to drop the column `rightStartRight` on the `Break` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Break" DROP COLUMN "rightEndRight",
DROP COLUMN "rightStartRight",
ADD COLUMN     "rightEndRange" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "rightStartRange" INTEGER NOT NULL DEFAULT 0;
