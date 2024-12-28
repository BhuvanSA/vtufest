/*
  Warnings:

  - You are about to drop the column `admissionUrl` on the `Registrants` table. All the data in the column will be lost.
  - Added the required column `admission2Url` to the `Registrants` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Registrants" DROP COLUMN "admissionUrl",
ADD COLUMN     "admission2Url" TEXT NOT NULL;
