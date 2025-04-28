-- AlterTable
ALTER TABLE "SearchAnalytics" ADD COLUMN     "break" "BreakType",
ADD COLUMN     "userID" INTEGER;

-- AddForeignKey
ALTER TABLE "SearchAnalytics" ADD CONSTRAINT "SearchAnalytics_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
