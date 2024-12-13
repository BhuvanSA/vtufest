/*
  Warnings:

  - Added the required column `admission1Url` to the `Registrants` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Registrants" ADD COLUMN     "admission1Url" TEXT NOT NULL;
