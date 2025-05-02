-- CreateEnum
CREATE TYPE "BlogCategory" AS ENUM ('Tech', 'Travel', 'Startup');

-- CreateEnum
CREATE TYPE "BreakType" AS ENUM ('Spring', 'Summer', 'Fall', 'Winter', 'Thanksgiving');

-- CreateEnum
CREATE TYPE "Direction" AS ENUM ('fromSchool', 'toSchool');

-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat');

-- CreateTable
CREATE TABLE "Friend" (
    "id" SERIAL NOT NULL,
    "userId1" INTEGER NOT NULL,
    "userId2" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Friend_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "firstName" TEXT,
    "lastName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "airports" TEXT[],
    "schoolID" INTEGER,
    "personalEmail" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogPost" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "preview" TEXT NOT NULL DEFAULT '',
    "content" TEXT NOT NULL,
    "category" "BlogCategory" NOT NULL DEFAULT 'Travel',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" INTEGER,

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "School" (
    "id" SERIAL NOT NULL,
    "schoolName" TEXT NOT NULL,
    "airportIatas" TEXT[],

    CONSTRAINT "School_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Break" (
    "id" SERIAL NOT NULL,
    "schoolID" INTEGER NOT NULL,
    "breakType" "BreakType" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "defaultEndDate" DATE NOT NULL DEFAULT '1970-01-01'::date,
    "defaultStartDate" DATE NOT NULL DEFAULT '1970-01-01'::date,
    "leftEndRange" INTEGER NOT NULL DEFAULT 0,
    "leftStartRange" INTEGER NOT NULL DEFAULT 0,
    "realEndDate" DATE NOT NULL DEFAULT '1970-01-01'::date,
    "realStartDate" DATE NOT NULL DEFAULT '1970-01-01'::date,
    "rightEndRange" INTEGER NOT NULL DEFAULT 0,
    "rightStartRange" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Break_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShuttleProvider" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "iconUrl" TEXT,
    "bookingUrl" TEXT NOT NULL,
    "schoolID" INTEGER NOT NULL,

    CONSTRAINT "ShuttleProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShuttleTime" (
    "id" SERIAL NOT NULL,
    "depTime" TIME(6) NOT NULL,
    "arrTime" TIME(6) NOT NULL,
    "providerID" INTEGER NOT NULL,
    "direction" "Direction" NOT NULL,
    "airport" TEXT NOT NULL,
    "price" INTEGER NOT NULL DEFAULT 0,
    "arrTimeZone" TEXT NOT NULL DEFAULT 'America/Indianapolis',
    "depTimeZone" TEXT NOT NULL DEFAULT 'America/Indianapolis',

    CONSTRAINT "ShuttleTime_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_email_token_key" ON "VerificationToken"("email", "token");

-- CreateIndex
CREATE UNIQUE INDEX "School_schoolName_key" ON "School"("schoolName");

-- CreateIndex
CREATE INDEX "Break_isActive_idx" ON "Break"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "ShuttleProvider_name_schoolID_key" ON "ShuttleProvider"("name", "schoolID");

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "Friend_userId1_fkey" FOREIGN KEY ("userId1") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "Friend_userId2_fkey" FOREIGN KEY ("userId2") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_schoolID_fkey" FOREIGN KEY ("schoolID") REFERENCES "School"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogPost" ADD CONSTRAINT "BlogPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Break" ADD CONSTRAINT "Break_schoolID_fkey" FOREIGN KEY ("schoolID") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShuttleProvider" ADD CONSTRAINT "ShuttleProvider_schoolID_fkey" FOREIGN KEY ("schoolID") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShuttleTime" ADD CONSTRAINT "ShuttleTime_providerID_fkey" FOREIGN KEY ("providerID") REFERENCES "ShuttleProvider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
