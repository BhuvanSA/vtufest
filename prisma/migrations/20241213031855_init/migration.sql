/*
  Warnings:

  - The primary key for the `Registrants` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `events` on the `Registrants` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `userName` on the `Users` table. All the data in the column will be lost.
  - Changed the type of `type` on the `Registrants` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `updatedAt` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Type" AS ENUM ('PARTICIPANT', 'TEAMMANAGER', 'ACCOMPANIST');

-- DropIndex
DROP INDEX "Users_collegeName_key";

-- DropIndex
DROP INDEX "Users_userName_key";

-- AlterTable
ALTER TABLE "Registrants" DROP CONSTRAINT "Registrants_pkey",
DROP COLUMN "events",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
DROP COLUMN "type",
ADD COLUMN     "type" "Type" NOT NULL,
ADD CONSTRAINT "Registrants_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Registrants_id_seq";

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "updateAt",
DROP COLUMN "userName",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropEnum
DROP TYPE "type";

-- CreateTable
CREATE TABLE "Events" (
    "id" TEXT NOT NULL,
    "eventNo" INTEGER NOT NULL,
    "eventName" TEXT NOT NULL,

    CONSTRAINT "Events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventRegistrations" (
    "id" TEXT NOT NULL,
    "registrantId" TEXT NOT NULL,
    "eventNo" INTEGER NOT NULL,
    "attendanceStatus" TEXT NOT NULL,
    "prize" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "EventRegistrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EventRegistrations" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_EventRegistrations_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_UserEvents" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserEvents_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Events_eventNo_key" ON "Events"("eventNo");

-- CreateIndex
CREATE INDEX "_EventRegistrations_B_index" ON "_EventRegistrations"("B");

-- CreateIndex
CREATE INDEX "_UserEvents_B_index" ON "_UserEvents"("B");

-- AddForeignKey
ALTER TABLE "EventRegistrations" ADD CONSTRAINT "EventRegistrations_registrantId_fkey" FOREIGN KEY ("registrantId") REFERENCES "Registrants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventRegistrations" ADD CONSTRAINT "EventRegistrations_eventNo_fkey" FOREIGN KEY ("eventNo") REFERENCES "Events"("eventNo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventRegistrations" ADD CONSTRAINT "_EventRegistrations_A_fkey" FOREIGN KEY ("A") REFERENCES "Events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventRegistrations" ADD CONSTRAINT "_EventRegistrations_B_fkey" FOREIGN KEY ("B") REFERENCES "Registrants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserEvents" ADD CONSTRAINT "_UserEvents_A_fkey" FOREIGN KEY ("A") REFERENCES "Events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserEvents" ADD CONSTRAINT "_UserEvents_B_fkey" FOREIGN KEY ("B") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
