/*
  Warnings:

  - A unique constraint covering the columns `[userId,eventNo]` on the table `Events` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Events_eventNo_userId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Events_userId_eventNo_key" ON "Events"("userId", "eventNo");
