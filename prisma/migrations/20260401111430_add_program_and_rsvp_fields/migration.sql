-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "programItems" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "rsvpFields" JSONB NOT NULL DEFAULT '{"companions":true,"dietary":true,"transport":true,"message":true}';
