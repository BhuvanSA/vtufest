/*
  Warnings:

  - A unique constraint covering the columns `[eventNo,userId]` on the table `Events` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Events_eventNo_userId_key" ON "Events"("eventNo", "userId");
