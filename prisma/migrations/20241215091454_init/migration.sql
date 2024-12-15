/*
  Warnings:

  - You are about to drop the column `admissionUrl` on the `Registrants` table. All the data in the column will be lost.
  - Added the required column `category` to the `Events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxAccompanist` to the `Events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxParticipant` to the `Events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `admission1Url` to the `Registrants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `admission2Url` to the `Registrants` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Events" ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "maxAccompanist" INTEGER NOT NULL,
ADD COLUMN     "maxParticipant" INTEGER NOT NULL,
ADD COLUMN     "registeredAccompanist" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "registeredParticipant" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Registrants" DROP COLUMN "admissionUrl",
ADD COLUMN     "admission1Url" TEXT NOT NULL,
ADD COLUMN     "admission2Url" TEXT NOT NULL;
