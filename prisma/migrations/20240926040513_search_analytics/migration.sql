-- CreateTable
CREATE TABLE "SearchAnalytics" (
    "id" SERIAL NOT NULL,
    "schoolID" INTEGER NOT NULL,
    "external" TEXT[],
    "direction" "Direction" NOT NULL,
    "depDate" DATE NOT NULL,
    "retDate" DATE,
    "depCombos" TEXT[],
    "retCombos" TEXT[],
    "onFinalize" BOOLEAN NOT NULL,
    "links" TEXT[],

    CONSTRAINT "SearchAnalytics_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SearchAnalytics" ADD CONSTRAINT "SearchAnalytics_schoolID_fkey" FOREIGN KEY ("schoolID") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
