/*
  Warnings:

  - The `status` column on the `Worker` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `fruitId` to the `WorkRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Worker` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "WorkerStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "WorkRecord" ADD COLUMN     "fruitId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Worker" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "WorkerStatus" NOT NULL DEFAULT 'ACTIVE';

-- CreateTable
CREATE TABLE "Fruit" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "pricePerKg" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Fruit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Payment_workerId_idx" ON "Payment"("workerId");

-- CreateIndex
CREATE INDEX "WorkRecord_workerId_idx" ON "WorkRecord"("workerId");

-- CreateIndex
CREATE INDEX "WorkRecord_fruitId_idx" ON "WorkRecord"("fruitId");

-- CreateIndex
CREATE INDEX "WorkRecord_date_idx" ON "WorkRecord"("date");

-- AddForeignKey
ALTER TABLE "WorkRecord" ADD CONSTRAINT "WorkRecord_fruitId_fkey" FOREIGN KEY ("fruitId") REFERENCES "Fruit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
