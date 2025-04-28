-- AlterTable
CREATE SEQUENCE duffelflight_id_seq;
ALTER TABLE "DuffelFlight" ALTER COLUMN "id" SET DEFAULT nextval('duffelflight_id_seq');
ALTER SEQUENCE duffelflight_id_seq OWNED BY "DuffelFlight"."id";
