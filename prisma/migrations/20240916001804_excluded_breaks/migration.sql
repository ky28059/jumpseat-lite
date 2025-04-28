-- AlterTable
ALTER TABLE "User" ADD COLUMN     "excludedBreaks" "BreakType"[] DEFAULT ARRAY[]::"BreakType"[];
