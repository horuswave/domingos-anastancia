-- CreateEnum
CREATE TYPE "BackgroundStyle" AS ENUM ('DARK', 'LIGHT', 'IMAGE');

-- DropForeignKey
ALTER TABLE "GuestCompanion" DROP CONSTRAINT "GuestCompanion_guestId_fkey";

-- DropForeignKey
ALTER TABLE "MessageLog" DROP CONSTRAINT "MessageLog_guestId_fkey";

-- DropForeignKey
ALTER TABLE "Rsvp" DROP CONSTRAINT "Rsvp_guestId_fkey";

-- AlterTable
ALTER TABLE "AdminUser" ADD COLUMN     "isSuperAdmin" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "accentColor" TEXT NOT NULL DEFAULT '#0e0b07',
ADD COLUMN     "backgroundStyle" "BackgroundStyle" NOT NULL DEFAULT 'DARK',
ADD COLUMN     "fontBody" TEXT NOT NULL DEFAULT 'Jost',
ADD COLUMN     "fontDisplay" TEXT NOT NULL DEFAULT 'Cormorant Garamond',
ADD COLUMN     "heroImageUrl" TEXT,
ADD COLUMN     "logoUrl" TEXT,
ADD COLUMN     "primaryColor" TEXT NOT NULL DEFAULT '#c8890e';

-- CreateTable
CREATE TABLE "EventAdmin" (
    "id" TEXT NOT NULL,
    "adminUserId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventAdmin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EventAdmin_adminUserId_eventId_key" ON "EventAdmin"("adminUserId", "eventId");

-- AddForeignKey
ALTER TABLE "EventAdmin" ADD CONSTRAINT "EventAdmin_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "AdminUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventAdmin" ADD CONSTRAINT "EventAdmin_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rsvp" ADD CONSTRAINT "Rsvp_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuestCompanion" ADD CONSTRAINT "GuestCompanion_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageLog" ADD CONSTRAINT "MessageLog_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
