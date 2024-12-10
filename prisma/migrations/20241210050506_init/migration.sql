/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `Registrants` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `phone` to the `Registrants` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Registrants" ADD COLUMN     "phone" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Registrants_phone_key" ON "Registrants"("phone");
