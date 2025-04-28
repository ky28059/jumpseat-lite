/*
  Warnings:

  - A unique constraint covering the columns `[breakID,date]` on the table `TravelDate` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TravelDate_breakID_date_key" ON "TravelDate"("breakID", "date");
