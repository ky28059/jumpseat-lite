-- CreateTable
CREATE TABLE "TravelDate" (
    "id" SERIAL NOT NULL,
    "breakID" INTEGER,
    "date" DATE NOT NULL,

    CONSTRAINT "TravelDate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TravelDate" ADD CONSTRAINT "TravelDate_breakID_fkey" FOREIGN KEY ("breakID") REFERENCES "Break"("id") ON DELETE SET NULL ON UPDATE CASCADE;
