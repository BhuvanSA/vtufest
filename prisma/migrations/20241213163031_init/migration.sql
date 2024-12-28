/*
  Warnings:

  - You are about to drop the column `maxRegistrants` on the `Events` table. All the data in the column will be lost.
  - Added the required column `maxRegistrant` to the `Events` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Events" DROP COLUMN "maxRegistrants",
ADD COLUMN     "maxRegistrant" INTEGER NOT NULL,
ADD COLUMN     "registrantEnrolled" INTEGER NOT NULL DEFAULT 0;
