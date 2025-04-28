/*
  Warnings:

  - A unique constraint covering the columns `[origin,destination,depDate,retDate]` on the table `Route` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Route" ADD COLUMN     "lowestPrices" INTEGER[],
ADD COLUMN     "lowestStart" DATE,
ADD COLUMN     "lwrPrice" INTEGER,
ADD COLUMN     "uprPrice" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Route_origin_destination_depDate_retDate_key" ON "Route"("origin", "destination", "depDate", "retDate");
