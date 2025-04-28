/*
  Warnings:

  - Added the required column `fareBrandName` to the `PurchasedFlight` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Flight" ADD COLUMN     "layoverDuration" INTEGER;

-- AlterTable
ALTER TABLE "PurchasedFlight" ADD COLUMN     "fareBrandName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "onSniperBeta" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "DuffelFlight" (
    "id" INTEGER NOT NULL,
    "route" TEXT NOT NULL,
    "dep_time" TIMESTAMP(3) NOT NULL,
    "arr_time" TIMESTAMP(3) NOT NULL,
    "layover_airport" TEXT,
    "present" BOOLEAN[],
    "flight_number" TEXT NOT NULL,
    "fare_brand_name" TEXT NOT NULL,
    "airline" TEXT NOT NULL,
    "date_added" DATE NOT NULL,

    CONSTRAINT "DuffelFlight_pkey" PRIMARY KEY ("id")
);
