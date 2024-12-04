-- CreateEnum
CREATE TYPE "type" AS ENUM ('PARTICIPANT', 'TEAMMANAGER', 'ACCOMPANIST');

-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "collegeCode" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "collegeName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "adminPassword" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Registrants" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "usn" TEXT NOT NULL,
    "type" "type" NOT NULL,
    "events" JSONB[],
    "photoUrl" TEXT NOT NULL,
    "aadharUrl" TEXT NOT NULL,
    "sslcUrl" TEXT NOT NULL,
    "pucUrl" TEXT NOT NULL,
    "admissionUrl" TEXT NOT NULL,
    "idcardUrl" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Registrants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_collegeCode_key" ON "Users"("collegeCode");

-- CreateIndex
CREATE UNIQUE INDEX "Users_userName_key" ON "Users"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "Users_collegeName_key" ON "Users"("collegeName");

-- CreateIndex
CREATE UNIQUE INDEX "Users_phone_key" ON "Users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Registrants_usn_key" ON "Registrants"("usn");

-- AddForeignKey
ALTER TABLE "Registrants" ADD CONSTRAINT "Registrants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
