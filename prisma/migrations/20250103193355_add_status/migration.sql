/*
  Warnings:

  - You are about to drop the column `verified` on the `Registrants` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "DocumentVerificationStatus" AS ENUM ('PENDING', 'PROCESSING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Registrants" DROP COLUMN "verified",
ADD COLUMN     "docStatus" "DocumentVerificationStatus" NOT NULL DEFAULT 'PENDING';
