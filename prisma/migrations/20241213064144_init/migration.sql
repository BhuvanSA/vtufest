/*
  Warnings:

  - Added the required column `eventId` to the `EventRegistrations` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "EventRegistrations" DROP CONSTRAINT "EventRegistrations_id_fkey";

-- AlterTable
ALTER TABLE "EventRegistrations" ADD COLUMN     "eventId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "EventRegistrations" ADD CONSTRAINT "EventRegistrations_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
