-- CreateEnum
CREATE TYPE "BlogCategory" AS ENUM ('Tech', 'Travel', 'Startup');

-- CreateEnum
CREATE TYPE "BreakType" AS ENUM ('Spring', 'Summer', 'Fall', 'Winter', 'Thanksgiving');

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
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "airportIATA" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "airports" TEXT[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
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
    "schoolID" SERIAL NOT NULL,
    "schoolName" TEXT NOT NULL,

    CONSTRAINT "School_pkey" PRIMARY KEY ("schoolID")
);

-- CreateTable
CREATE TABLE "Break" (
    "breakID" SERIAL NOT NULL,
    "schoolID" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "breakType" "BreakType" NOT NULL,

    CONSTRAINT "Break_pkey" PRIMARY KEY ("breakID")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "School_schoolName_key" ON "School"("schoolName");

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "Friend_userId1_fkey" FOREIGN KEY ("userId1") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "Friend_userId2_fkey" FOREIGN KEY ("userId2") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "BlogPost" ADD CONSTRAINT "BlogPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Break" ADD CONSTRAINT "Break_schoolID_fkey" FOREIGN KEY ("schoolID") REFERENCES "School"("schoolID") ON DELETE RESTRICT ON UPDATE CASCADE;

