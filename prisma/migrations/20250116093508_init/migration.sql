/*
  Warnings:

  - Added the required column `gender` to the `Registrants` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Registrants" ADD COLUMN     "accomodation" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "gender" TEXT NOT NULL;
