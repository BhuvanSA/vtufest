/*
  Warnings:

  - A unique constraint covering the columns `[registrantId,eventId]` on the table `EventRegistrations` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "EventRegistrations_registrantId_eventId_key" ON "EventRegistrations"("registrantId", "eventId");
