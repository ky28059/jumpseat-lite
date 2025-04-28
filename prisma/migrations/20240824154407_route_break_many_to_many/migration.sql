/*
  Warnings:

  - You are about to drop the column `breakID` on the `Route` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Route" DROP CONSTRAINT "Route_breakID_fkey";

-- DropIndex
DROP INDEX "Route_breakID_idx";

-- AlterTable
ALTER TABLE "Route" DROP COLUMN "breakID";

-- CreateTable
CREATE TABLE "_BreakToRoute" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BreakToRoute_AB_unique" ON "_BreakToRoute"("A", "B");

-- CreateIndex
CREATE INDEX "_BreakToRoute_B_index" ON "_BreakToRoute"("B");

-- AddForeignKey
ALTER TABLE "_BreakToRoute" ADD CONSTRAINT "_BreakToRoute_A_fkey" FOREIGN KEY ("A") REFERENCES "Break"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BreakToRoute" ADD CONSTRAINT "_BreakToRoute_B_fkey" FOREIGN KEY ("B") REFERENCES "Route"("id") ON DELETE CASCADE ON UPDATE CASCADE;
