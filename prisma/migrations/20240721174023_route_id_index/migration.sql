-- DropIndex
DROP INDEX "Flight_airline_depTime_arrTime_layoverAirport_idx";

-- CreateIndex
CREATE INDEX "Flight_routeID_airline_depTime_arrTime_layoverAirport_idx" ON "Flight"("routeID", "airline", "depTime", "arrTime", "layoverAirport");
