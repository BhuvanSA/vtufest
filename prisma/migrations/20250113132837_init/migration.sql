-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "Amount" TEXT,
ADD COLUMN     "PaymentVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "paymentUrl" TEXT,
ADD COLUMN     "txnNumber" TEXT;
