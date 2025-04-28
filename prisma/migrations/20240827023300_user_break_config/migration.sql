/*
  Warnings:

  - You are about to drop the column `wantsEmails` on the `UserBreak` table. All the data in the column will be lost.

*/
-- AlterTable
CREATE SEQUENCE userbreak_id_seq;
ALTER TABLE "UserBreak" DROP COLUMN "wantsEmails",
ALTER COLUMN "id" SET DEFAULT nextval('userbreak_id_seq');
ALTER SEQUENCE userbreak_id_seq OWNED BY "UserBreak"."id";
