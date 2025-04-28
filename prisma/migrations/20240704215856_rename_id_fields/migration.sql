-- DropForeignKey
ALTER TABLE "Break" DROP CONSTRAINT "Break_schoolID_fkey";

-- DropForeignKey
ALTER TABLE "Route" DROP CONSTRAINT "Route_breakID_fkey";

-- DropForeignKey
ALTER TABLE "ShuttleProvider" DROP CONSTRAINT "ShuttleProvider_schoolID_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_schoolID_fkey";

-- DropForeignKey
ALTER TABLE "UserBreak" DROP CONSTRAINT "UserBreak_breakID_fkey";

-- AlterTable
ALTER TABLE "Break" DROP CONSTRAINT "Break_pkey";
ALTER TABLE "Break" RENAME COLUMN "breakID" TO "id";
ALTER TABLE "Break" ADD CONSTRAINT "Break_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "School" DROP CONSTRAINT "School_pkey";
ALTER TABLE "School" RENAME COLUMN "schoolID" TO "id";
ALTER TABLE "School" ADD CONSTRAINT "School_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_schoolID_fkey" FOREIGN KEY ("schoolID") REFERENCES "School"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBreak" ADD CONSTRAINT "UserBreak_breakID_fkey" FOREIGN KEY ("breakID") REFERENCES "Break"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Break" ADD CONSTRAINT "Break_schoolID_fkey" FOREIGN KEY ("schoolID") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShuttleProvider" ADD CONSTRAINT "ShuttleProvider_schoolID_fkey" FOREIGN KEY ("schoolID") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Route" ADD CONSTRAINT "Route_breakID_fkey" FOREIGN KEY ("breakID") REFERENCES "Break"("id") ON DELETE SET NULL ON UPDATE CASCADE;
