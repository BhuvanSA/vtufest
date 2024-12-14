/*
  Warnings:

  - You are about to drop the column `maxRegistrant` on the `Events` table. All the data in the column will be lost.
  - You are about to drop the column `registrantEnrolled` on the `Events` table. All the data in the column will be lost.
  - Added the required column `maxAccompanist` to the `Events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxParticipant` to the `Events` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Events" DROP COLUMN "maxRegistrant",
DROP COLUMN "registrantEnrolled",
ADD COLUMN     "maxAccompanist" INTEGER NOT NULL,
ADD COLUMN     "maxParticipant" INTEGER NOT NULL,
ADD COLUMN     "registeredAccompanist" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "registeredParticipant" INTEGER NOT NULL DEFAULT 0;
