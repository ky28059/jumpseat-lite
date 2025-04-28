/*
  Warnings:

  - You are about to drop the `_BreakToRoute` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_BreakToRoute" DROP CONSTRAINT "_BreakToRoute_A_fkey";

-- DropForeignKey
ALTER TABLE "_BreakToRoute" DROP CONSTRAINT "_BreakToRoute_B_fkey";

-- DropTable
DROP TABLE "_BreakToRoute";

-- CreateTable
CREATE TABLE "BreaksOnRoutes" (
    "routeID" INTEGER NOT NULL,
    "breakID" INTEGER NOT NULL,

    CONSTRAINT "BreaksOnRoutes_pkey" PRIMARY KEY ("routeID","breakID")
);

-- CreateIndex
CREATE INDEX "BreaksOnRoutes_routeID_idx" ON "BreaksOnRoutes"("routeID");

-- CreateIndex
CREATE INDEX "BreaksOnRoutes_breakID_idx" ON "BreaksOnRoutes"("breakID");

-- AddForeignKey
ALTER TABLE "BreaksOnRoutes" ADD CONSTRAINT "BreaksOnRoutes_routeID_fkey" FOREIGN KEY ("routeID") REFERENCES "Route"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BreaksOnRoutes" ADD CONSTRAINT "BreaksOnRoutes_breakID_fkey" FOREIGN KEY ("breakID") REFERENCES "Break"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
