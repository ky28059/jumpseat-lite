-- DropForeignKey
ALTER TABLE "ShuttleProvider" DROP CONSTRAINT "ShuttleProvider_schoolID_fkey";

-- CreateTable
CREATE TABLE "ShuttleProviderOnSchool" (
    "shuttleProviderID" INTEGER NOT NULL,
    "schoolID" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT NOT NULL,

    CONSTRAINT "ShuttleProviderOnSchool_pkey" PRIMARY KEY ("shuttleProviderID","schoolID")
);

-- AddForeignKey
ALTER TABLE "ShuttleProviderOnSchool" ADD CONSTRAINT "ShuttleProviderOnSchool_schoolID_fkey" FOREIGN KEY ("schoolID") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShuttleProviderOnSchool" ADD CONSTRAINT "ShuttleProviderOnSchool_shuttleProviderID_fkey" FOREIGN KEY ("shuttleProviderID") REFERENCES "ShuttleProvider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
