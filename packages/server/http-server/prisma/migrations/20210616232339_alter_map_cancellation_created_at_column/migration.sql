/*
  Warnings:

  - You are about to drop the column `canceled_at` on the `cancellations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "cancellations" DROP COLUMN "canceled_at",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
