/*
  Warnings:

  - The `attendanceStatus` column on the `EventRegistrations` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "EventRegistrations" DROP COLUMN "attendanceStatus",
ADD COLUMN     "attendanceStatus" BOOLEAN NOT NULL DEFAULT false;
