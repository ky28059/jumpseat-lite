-- AlterTable
ALTER TABLE "Break" ADD COLUMN     "isAdded" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Flight_airline_depTime_arrTime_layoverAirport_idx" ON "Flight"("airline", "depTime", "arrTime", "layoverAirport");

-- CreateIndex
CREATE INDEX "Flight_routeID_idx" ON "Flight"("routeID");

-- CreateIndex
CREATE INDEX "Route_lastUpdated_idx" ON "Route"("lastUpdated");

-- CreateIndex
CREATE INDEX "Route_origin_destination_depDate_idx" ON "Route"("origin", "destination", "depDate");

-- CreateIndex
CREATE INDEX "ScrapeLog_time_idx" ON "ScrapeLog"("time");
