/*
  Warnings:

  - The `PaymentVerified` column on the `Users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "PaymentVerifiedStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "PaymentVerified",
ADD COLUMN     "PaymentVerified" "PaymentVerifiedStatus" NOT NULL DEFAULT 'PENDING';
