-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat');

-- AlterTable
ALTER TABLE "ShuttleTime" ADD COLUMN     "arrTimeZone" TEXT NOT NULL DEFAULT 'Eastern',
ADD COLUMN     "depTimeZone" TEXT NOT NULL DEFAULT 'Eastern',
ADD COLUMN     "operationalDOW" "DayOfWeek"[] DEFAULT ARRAY[]::"DayOfWeek"[];
