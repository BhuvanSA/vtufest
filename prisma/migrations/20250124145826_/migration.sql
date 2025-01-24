/*
  Warnings:

  - A unique constraint covering the columns `[collegeName]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[collegeOurCode]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - Made the column `collegeCode` on table `Users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "collegeOurCode" TEXT,
ADD COLUMN     "region" TEXT,
ALTER COLUMN "collegeCode" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Users_collegeName_key" ON "Users"("collegeName");

-- CreateIndex
CREATE UNIQUE INDEX "Users_collegeOurCode_key" ON "Users"("collegeOurCode");
