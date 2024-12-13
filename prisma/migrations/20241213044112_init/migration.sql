/*
  Warnings:

  - You are about to drop the column `eventNo` on the `EventRegistrations` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "EventRegistrations" DROP CONSTRAINT "EventRegistrations_eventNo_fkey";

-- DropIndex
DROP INDEX "Events_eventNo_key";

-- AlterTable
ALTER TABLE "EventRegistrations" DROP COLUMN "eventNo";

-- AddForeignKey
ALTER TABLE "EventRegistrations" ADD CONSTRAINT "EventRegistrations_id_fkey" FOREIGN KEY ("id") REFERENCES "Events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
