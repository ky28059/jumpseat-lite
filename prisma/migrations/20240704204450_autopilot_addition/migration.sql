-- CreateEnum
CREATE TYPE "Direction" AS ENUM ('fromSchool', 'toSchool');

-- CreateEnum
CREATE TYPE "StatusType" AS ENUM ('Inactive', 'Trial', 'Paid');

-- AlterTable
ALTER TABLE "School" ADD COLUMN     "airportIatas" TEXT[];

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "schoolID" INTEGER;

-- CreateTable
CREATE TABLE "UserBreak" (
    "id" INTEGER NOT NULL,
    "userID" INTEGER NOT NULL,
    "breakID" INTEGER NOT NULL,
    "depStartTime" TIMESTAMP(3) NOT NULL,
    "depEndTime" TIMESTAMP(3) NOT NULL,
    "retStartTime" TIMESTAMP(3) NOT NULL,
    "retEndTime" TIMESTAMP(3) NOT NULL,
    "airlines" TEXT[],
    "noLayovers" BOOLEAN NOT NULL DEFAULT false,
    "needsCarryOn" BOOLEAN NOT NULL DEFAULT false,
    "hasBooked" BOOLEAN NOT NULL DEFAULT false,
    "wantsEmails" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "UserBreak_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShuttleProvider" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "schoolID" INTEGER NOT NULL,
    "isVariable" BOOLEAN NOT NULL,

    CONSTRAINT "ShuttleProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShuttleTime" (
    "id" SERIAL NOT NULL,
    "depTime" TIME NOT NULL,
    "arrTime" TIME NOT NULL,
    "providerID" INTEGER NOT NULL,
    "direction" "Direction" NOT NULL,
    "airport" TEXT NOT NULL,

    CONSTRAINT "ShuttleTime_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DateStatus" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL,
    "providerID" INTEGER NOT NULL,
    "overrides" JSONB NOT NULL,

    CONSTRAINT "DateStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AutopilotStatus" (
    "id" SERIAL NOT NULL,
    "status" "StatusType" NOT NULL,
    "userID" INTEGER NOT NULL,
    "willRenew" BOOLEAN NOT NULL,
    "expiration" TIMESTAMP(3) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AutopilotStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Route" (
    "id" SERIAL NOT NULL,
    "origin" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "depDate" TIMESTAMP(3) NOT NULL,
    "retDate" TIMESTAMP(3),
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isIntl" BOOLEAN NOT NULL DEFAULT false,
    "timings" TIMESTAMP(3)[],
    "breakID" INTEGER,

    CONSTRAINT "Route_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScrapeLog" (
    "id" SERIAL NOT NULL,
    "routeID" INTEGER NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "success" BOOLEAN NOT NULL,
    "userAgent" TEXT NOT NULL,
    "errorMsg" TEXT,

    CONSTRAINT "ScrapeLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Flight" (
    "id" SERIAL NOT NULL,
    "routeID" INTEGER NOT NULL,
    "airline" TEXT NOT NULL,
    "depTime" TIMESTAMP(3) NOT NULL,
    "arrTime" TIMESTAMP(3) NOT NULL,
    "layoverAirport" TEXT,
    "prices" DECIMAL(65,30)[],

    CONSTRAINT "Flight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchasedFlight" (
    "id" SERIAL NOT NULL,
    "purchasePrice" DECIMAL(65,30) NOT NULL,
    "purchaseDate" TIMESTAMP(3) NOT NULL,
    "targetPrice" DECIMAL(65,30) NOT NULL,
    "userID" INTEGER NOT NULL,
    "flightID" INTEGER NOT NULL,
    "flightNumber" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PurchasedFlight_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShuttleProvider_name_key" ON "ShuttleProvider"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AutopilotStatus_userID_key" ON "AutopilotStatus"("userID");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_schoolID_fkey" FOREIGN KEY ("schoolID") REFERENCES "School"("schoolID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBreak" ADD CONSTRAINT "UserBreak_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBreak" ADD CONSTRAINT "UserBreak_breakID_fkey" FOREIGN KEY ("breakID") REFERENCES "Break"("breakID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShuttleProvider" ADD CONSTRAINT "ShuttleProvider_schoolID_fkey" FOREIGN KEY ("schoolID") REFERENCES "School"("schoolID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShuttleTime" ADD CONSTRAINT "ShuttleTime_providerID_fkey" FOREIGN KEY ("providerID") REFERENCES "ShuttleProvider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DateStatus" ADD CONSTRAINT "DateStatus_providerID_fkey" FOREIGN KEY ("providerID") REFERENCES "ShuttleProvider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AutopilotStatus" ADD CONSTRAINT "AutopilotStatus_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Route" ADD CONSTRAINT "Route_breakID_fkey" FOREIGN KEY ("breakID") REFERENCES "Break"("breakID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScrapeLog" ADD CONSTRAINT "ScrapeLog_routeID_fkey" FOREIGN KEY ("routeID") REFERENCES "Route"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flight" ADD CONSTRAINT "Flight_routeID_fkey" FOREIGN KEY ("routeID") REFERENCES "Route"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchasedFlight" ADD CONSTRAINT "PurchasedFlight_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchasedFlight" ADD CONSTRAINT "PurchasedFlight_flightID_fkey" FOREIGN KEY ("flightID") REFERENCES "Flight"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
